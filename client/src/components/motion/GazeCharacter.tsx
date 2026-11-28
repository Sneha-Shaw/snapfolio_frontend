import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * A character that looks at the cursor, from a pre-rendered video of one full circle:
 * a ring of frames where the head and eyes sweep every direction (screen degrees: 0 = right,
 * 90 = down, 180 = left, 270 = up), plus one frame looking straight at the viewer.
 * The cursor's angle around the face picks a spot on the ring; the distance decides how far
 * the head is turned away from the viewer.
 */
export interface GazeFrame {
  src: string;
  /** The direction this frame looks, in screen degrees. Frames must be sorted by angle. */
  angle: number;
}

export interface GazeConfig {
  /** Frames around the circle, sorted by ascending angle. */
  ring: GazeFrame[];
  /** The frame looking straight at the viewer. */
  neutral: string;
  /** Where the face sits inside each frame, as fractions of its width and height. */
  focus: { x: number; y: number };
  /** Colour painted behind the picture while it loads. */
  background: string;
  /** Where the face should sit in the container (fractions). The picture fills the container; if it must be cropped, this decides what is kept. */
  anchor: { x: number; y: number };
  /** Within this many CSS px of the face the character looks at the viewer. */
  deadZone: number;
  /** Extra distance (px) the cursor must travel past the dead zone before he turns away again (no flicker at the edge). */
  band: number;
  /** 0–1: how quickly the head catches up with the cursor each 60fps frame. */
  smoothing: number;
}

type Frame = HTMLImageElement | ImageBitmap;

/** Fastest the head may turn, in degrees per 60fps frame (≈ 600°/s). */
const MAX_TURN = 10;
/** How long the look-at-viewer ↔ look-at-cursor fade takes. */
const FADE_MS = 110;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const wrap360 = (a: number) => ((a % 360) + 360) % 360;
/** Shortest signed turn from angle a to angle b, in degrees. */
const turn = (a: number, b: number) => ((((b - a) % 360) + 540) % 360) - 180;

function loadFrame(src: string): Promise<Frame> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = async () => {
      try {
        await img.decode?.();
      } catch {
        /* decode() can reject for already-decoded images; the image is still usable */
      }
      if ('createImageBitmap' in window) {
        try {
          return resolve(await createImageBitmap(img));
        } catch {
          /* fall back to the <img> */
        }
      }
      resolve(img);
    };
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

/** Runs async jobs with at most `limit` in flight. */
async function pool(jobs: Array<() => Promise<void>>, limit: number) {
  let next = 0;
  const worker = async () => {
    while (next < jobs.length) await jobs[next++]!().catch(() => undefined);
  };
  await Promise.all(Array.from({ length: Math.min(limit, jobs.length) }, worker));
}

interface Props {
  config: GazeConfig;
  /** Shown when the frames can't load. */
  fallback: ReactNode;
  className?: string;
}

/**
 * Draws the character onto a canvas, showing the whole picture (nothing cropped unless the container is portrait). The frame looking at the viewer is always the base; the ring frame for the
 * cursor's direction is blended over it by how far the cursor is from the face. The angle eases
 * along the shortest way round, so the head sweeps past the directions in between, and
 * neighbouring ring frames are cross-faded for smoothness. The neutral frame loads first.
 */
export function GazeCharacter({ config, fallback, className = '' }: Props) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');

  useEffect(() => {
    const count = config.ring.length;
    const canvas = canvasRef.current;
    const box = wrapRef.current;
    if (!canvas || !box) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return setState('failed');

    let disposed = false;
    let neutral: Frame | undefined;
    const ring: Array<Frame | undefined> = new Array(count);

    const view = { w: 0, h: 0, dpr: 1 };
    const sim = {
      ang: 0, // where the head looks now (unwrapped degrees)
      targetAng: 0, // the ring frame he is heading for (wrapped degrees)
      targetIdx: -1,
      mix: 0, // 0 = at the viewer, 1 = turned toward the cursor (ramps linearly, shown eased)
      targetMix: 0,
      visible: true,
      raf: 0,
      last: 0,
      faceX: 0,
      faceY: 0,
    };

    const measure = () => {
      const r = box.getBoundingClientRect();
      view.dpr = Math.min(window.devicePixelRatio || 1, 2);
      view.w = r.width;
      view.h = r.height;
      canvas.width = Math.round(r.width * view.dpr);
      canvas.height = Math.round(r.height * view.dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    };

    /**
     * Where the picture lands: it always fills the container edge to edge (no bars). When the container's
     * shape differs from the video's, the overflow is cropped on the side that keeps the face where `anchor` says.
     */
    const placement = (img: Frame) => {
      const s = Math.max(view.w / img.width, view.h / img.height);
      const dw = img.width * s;
      const dh = img.height * s;
      const a = config.anchor;
      const f = config.focus;
      return { dx: clamp(a.x * view.w - dw * f.x, view.w - dw, 0), dy: clamp(a.y * view.h - dh * f.y, view.h - dh, 0), dw, dh };
    };

    const draw = () => {
      if (!neutral) return;
      ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.fillStyle = config.background;
      ctx.fillRect(0, 0, view.w, view.h);
      const p = placement(neutral);
      sim.faceX = p.dx + p.dw * config.focus.x;
      sim.faceY = p.dy + p.dh * config.focus.y;
      ctx.drawImage(neutral, p.dx, p.dy, p.dw, p.dh);

      // The ring frame (or the blend of the two nearest) for the current direction.
      const m = smoothstep(clamp(sim.mix, 0, 1));
      if (m > 0.004 && count > 0) {
        const phi = wrap360(sim.ang);
        let i = count - 1;
        for (let k = 0; k < count - 1; k++) {
          if (phi >= config.ring[k]!.angle && phi < config.ring[k + 1]!.angle) {
            i = k;
            break;
          }
        }
        const j = (i + 1) % count;
        const aA = config.ring[i]!.angle;
        let aB = config.ring[j]!.angle;
        if (aB <= aA) aB += 360;
        // A steep blend: across a wide gap between two frames most of the way shows one pure frame or the other,
        // with only a short cross-fade in the middle (a plain linear blend would hang as a double image).
        const raw = clamp(((phi < aA ? phi + 360 : phi) - aA) / Math.max(1e-6, aB - aA), 0, 1);
        const t = smoothstep(clamp((raw - 0.3) / 0.4, 0, 1));
        const A = ring[i] ?? ring[j];
        const B = ring[j] ?? ring[i];
        // Sequential alpha blends that add up to N·(1−m) + (A·(1−t) + B·t)·m.
        if (A && B && A !== B) {
          const a2 = m * t;
          ctx.globalAlpha = (m * (1 - t)) / Math.max(1e-6, 1 - a2);
          ctx.drawImage(A, p.dx, p.dy, p.dw, p.dh);
          ctx.globalAlpha = a2;
          ctx.drawImage(B, p.dx, p.dy, p.dw, p.dh);
        } else if (A) {
          ctx.globalAlpha = m;
          ctx.drawImage(A, p.dx, p.dy, p.dw, p.dh);
        }
        ctx.globalAlpha = 1;
      }
    };

    const tick = (now: number) => {
      sim.raf = 0;
      if (disposed || !sim.visible) return;
      const dt = Math.min(64, sim.last ? now - sim.last : 16) / (1000 / 60); // in 60fps frames
      sim.last = now;

      // The head eases toward its frame, but never faster than MAX_TURN, so a jumpy cursor can't whip it round.
      const diff = turn(sim.ang, sim.targetAng);
      if (Math.abs(diff) < 0.05) sim.ang = sim.targetAng;
      else {
        const step = diff * (1 - Math.pow(1 - config.smoothing, dt));
        const cap = MAX_TURN * dt;
        sim.ang += clamp(step, -cap, cap);
      }
      // "At the viewer" ↔ "toward the cursor" is a short fixed-length fade, so it never rests half-way.
      const rate = dt / (FADE_MS * 0.06);
      sim.mix += clamp(sim.targetMix - sim.mix, -rate, rate);

      draw();
      if (Math.abs(turn(sim.ang, sim.targetAng)) > 0.05 || Math.abs(sim.targetMix - sim.mix) > 0.001) sim.raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!sim.raf && sim.visible) {
        sim.last = 0;
        sim.raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      const dx = e.clientX - (r.left + sim.faceX);
      const dy = e.clientY - (r.top + sim.faceY);
      const dist = Math.hypot(dx, dy);

      // Dead-band: look at the viewer when close, turn away only once clearly outside.
      if (dist < config.deadZone) sim.targetMix = 0;
      else if (dist > config.deadZone + config.band) sim.targetMix = 1;

      // Direction: snap to the nearest real frame (so he rests on one picture, never a blend of two),
      // and only change frames when the new one is clearly closer. Near the face the direction is unstable, so hold it.
      if (dist > config.deadZone * 0.8 && count > 0) {
        const want = (Math.atan2(dy, dx) * 180) / Math.PI;
        let best = 0;
        let bestD = Infinity;
        for (let k = 0; k < count; k++) {
          const d = Math.abs(turn(want, config.ring[k]!.angle));
          if (d < bestD) {
            bestD = d;
            best = k;
          }
        }
        const currentD = sim.targetIdx >= 0 ? Math.abs(turn(want, config.ring[sim.targetIdx]!.angle)) : Infinity;
        if (best !== sim.targetIdx && bestD + 2 < currentD) {
          sim.targetIdx = best;
          sim.targetAng = wrap360(config.ring[best]!.angle);
        }
      }
      wake();
    };
    const toNeutral = () => {
      sim.targetMix = 0;
      wake();
    };
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) toNeutral(); // left the window
    };

    loadFrame(config.neutral)
      .then((img) => {
        if (disposed) return;
        neutral = img;
        measure();
        draw();
        setState('ready');
        // Reduced motion shows only the still, so skip downloading the ring.
        if (reduce) return;
        void pool(
          config.ring.map((f, i) => async () => {
            const loaded = await loadFrame(f.src);
            if (!disposed) ring[i] = loaded;
          }),
          6
        );
      })
      .catch(() => {
        if (!disposed) setState('failed');
      });

    const ro = new ResizeObserver(() => {
      measure();
      draw();
    });
    ro.observe(box);

    const io = new IntersectionObserver(([entry]) => {
      sim.visible = Boolean(entry?.isIntersecting);
      if (sim.visible && !reduce) wake();
    });
    io.observe(box);

    if (!reduce) {
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerout', onOut);
      window.addEventListener('blur', toNeutral);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(sim.raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerout', onOut);
      window.removeEventListener('blur', toNeutral);
      if (neutral && 'close' in neutral) neutral.close();
      ring.forEach((f) => f && 'close' in f && f.close());
    };
  }, [config, reduce]);

  return (
    <div ref={wrapRef} className={`absolute inset-0 ${className}`}>
      {state === 'failed' ? (
        fallback
      ) : (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 size-full transition-opacity duration-700"
          style={{ opacity: state === 'ready' ? 1 : 0 }}
        />
      )}
    </div>
  );
}
