import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { hexToRgb } from '@/lib/color';

interface PixelatedCanvasProps {
  src: string;
  width?: number;
  height?: number;
  cellSize?: number;
  dotScale?: number;
  shape?: 'circle' | 'square';
  backgroundColor?: string;
  grayscale?: boolean;
  className?: string;
  /** Size the canvas to fill its parent (measured via ResizeObserver) instead of using fixed `width`/`height`. */
  responsive?: boolean;
  dropoutStrength?: number;
  interactive?: boolean;
  distortionStrength?: number;
  distortionRadius?: number;
  distortionMode?: 'repel' | 'attract' | 'swirl';
  followSpeed?: number;
  sampleAverage?: boolean;
  tintColor?: string;
  tintStrength?: number;
  /**
   * Two-color duotone mapping (not part of the upstream registry component) —
   * shadows interpolate to `shadow`, highlights to `highlight`, by per-dot
   * luminance. Takes priority over `grayscale`/`tintColor` when set, since a
   * precise two-color map reads as far more deliberate than a flat tint wash.
   */
  duotone?: { shadow: string; highlight: string } | null;
  maxFps?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  jitterStrength?: number;
  jitterSpeed?: number;
  fadeOnLeave?: boolean;
  fadeSpeed?: number;
}

interface Sample {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
  drop: boolean;
  seed: number;
}

/**
 * Aceternity UI's "Pixelated Canvas" component
 * (ui.aceternity.com/components/pixelated-canvas) — a free, copy-paste
 * component: any image rendered as a grid of dots/squares on a canvas, with
 * pointer-reactive distortion (repel / attract / swirl) and pointer-local
 * jitter. Fetched via the real `npx shadcn add @aceternity/pixelated-canvas`
 * registry and ported in verbatim (DPR-correct canvas sizing, gradient-based
 * dropout so dots survive on edges/features and fall away in flat regions,
 * true rotational swirl, Gaussian distortion falloff) — only the sizing
 * layer is ours: the registry version takes fixed pixel `width`/`height`
 * with no notion of "fill the parent", so `responsive` here wraps it in a
 * ResizeObserver that feeds measured container dimensions into the same
 * upstream algorithm.
 */
export function PixelatedCanvas({
  src,
  width = 400,
  height = 500,
  cellSize = 3,
  dotScale = 0.9,
  shape = 'square',
  backgroundColor = '#000000',
  grayscale = false,
  className,
  responsive = false,
  dropoutStrength = 0.4,
  interactive = true,
  distortionStrength = 3,
  distortionRadius = 80,
  distortionMode = 'swirl',
  followSpeed = 0.2,
  sampleAverage = true,
  tintColor = '#FFFFFF',
  tintStrength = 0.2,
  duotone = null,
  maxFps = 60,
  objectFit = 'cover',
  jitterStrength = 4,
  jitterSpeed = 4,
  fadeOnLeave = true,
  fadeSpeed = 0.1,
}: PixelatedCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const samplesRef = useRef<Sample[]>([]);
  const dimsRef = useRef<{ width: number; height: number; dot: number } | null>(null);
  const targetMouseRef = useRef({ x: -9999, y: -9999 });
  const animMouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);
  const pointerInsideRef = useRef(false);
  const activityRef = useRef(0);
  const activityTargetRef = useRef(0);

  const [measured, setMeasured] = useState({ width, height });
  const duotoneShadow = duotone?.shadow;
  const duotoneHighlight = duotone?.highlight;

  useEffect(() => {
    if (!responsive || !containerRef.current) return;
    const el = containerRef.current;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setMeasured({ width: Math.max(1, Math.round(rect.width)), height: Math.max(1, Math.round(rect.height)) });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [responsive]);

  const effectiveWidth = responsive ? measured.width : width;
  const effectiveHeight = responsive ? measured.height : height;

  useEffect(() => {
    let isCancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    samplesRef.current = [];

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    const compute = () => {
      if (!canvas) return;
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

      const displayWidth = effectiveWidth || img.naturalWidth;
      const displayHeight = effectiveHeight || img.naturalHeight;

      canvas.width = Math.max(1, Math.floor(displayWidth * dpr));
      canvas.height = Math.max(1, Math.floor(displayHeight * dpr));
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, displayWidth, displayHeight);
      } else {
        ctx.clearRect(0, 0, displayWidth, displayHeight);
      }

      const offscreen = document.createElement('canvas');
      offscreen.width = Math.max(1, Math.floor(displayWidth));
      offscreen.height = Math.max(1, Math.floor(displayHeight));
      const off = offscreen.getContext('2d');
      if (!off) return;

      const iw = img.naturalWidth || displayWidth;
      const ih = img.naturalHeight || displayHeight;
      let dw = displayWidth;
      let dh = displayHeight;
      let dx = 0;
      let dy = 0;
      if (objectFit === 'cover') {
        const scale = Math.max(displayWidth / iw, displayHeight / ih);
        dw = Math.ceil(iw * scale);
        dh = Math.ceil(ih * scale);
        dx = Math.floor((displayWidth - dw) / 2);
        dy = Math.floor((displayHeight - dh) / 2);
      } else if (objectFit === 'contain') {
        const scale = Math.min(displayWidth / iw, displayHeight / ih);
        dw = Math.ceil(iw * scale);
        dh = Math.ceil(ih * scale);
        dx = Math.floor((displayWidth - dw) / 2);
        dy = Math.floor((displayHeight - dh) / 2);
      } else if (objectFit === 'fill') {
        dw = displayWidth;
        dh = displayHeight;
      } else {
        dw = iw;
        dh = ih;
        dx = Math.floor((displayWidth - dw) / 2);
        dy = Math.floor((displayHeight - dh) / 2);
      }
      off.drawImage(img, dx, dy, dw, dh);

      let imageData: ImageData;
      try {
        imageData = off.getImageData(0, 0, offscreen.width, offscreen.height);
      } catch {
        ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
        return;
      }

      const data = imageData.data;
      const stride = offscreen.width * 4;
      const effectiveDotSize = Math.max(1, Math.floor(cellSize * dotScale));
      dimsRef.current = { width: displayWidth, height: displayHeight, dot: effectiveDotSize };

      const luminanceAt = (px: number, py: number) => {
        const ix = Math.max(0, Math.min(offscreen.width - 1, px));
        const iy = Math.max(0, Math.min(offscreen.height - 1, py));
        const i = iy * stride + ix * 4;
        return 0.2126 * data[i]! + 0.7152 * data[i + 1]! + 0.0722 * data[i + 2]!;
      };

      const hash2D = (ix: number, iy: number) => {
        const s = Math.sin(ix * 12.9898 + iy * 78.233) * 43758.5453123;
        return s - Math.floor(s);
      };

      const samples: Sample[] = [];

      let tintRGB: [number, number, number] | null = null;
      if (tintColor && tintStrength > 0) {
        tintRGB = tintColor.startsWith('#') ? hexToRgb(tintColor) : null;
      }

      const duotoneShadowRGB = duotoneShadow ? hexToRgb(duotoneShadow) : null;
      const duotoneHighlightRGB = duotoneHighlight ? hexToRgb(duotoneHighlight) : null;

      for (let y = 0; y < offscreen.height; y += cellSize) {
        const cy = Math.min(offscreen.height - 1, y + Math.floor(cellSize / 2));
        for (let x = 0; x < offscreen.width; x += cellSize) {
          const cx = Math.min(offscreen.width - 1, x + Math.floor(cellSize / 2));
          let r = 0;
          let g = 0;
          let b = 0;
          let a = 0;

          if (!sampleAverage) {
            const idx = cy * stride + cx * 4;
            r = data[idx]!;
            g = data[idx + 1]!;
            b = data[idx + 2]!;
            a = data[idx + 3]! / 255;
          } else {
            let count = 0;
            for (let oy = -1; oy <= 1; oy++) {
              for (let ox = -1; ox <= 1; ox++) {
                const sx = Math.max(0, Math.min(offscreen.width - 1, cx + ox));
                const sy = Math.max(0, Math.min(offscreen.height - 1, cy + oy));
                const sIdx = sy * stride + sx * 4;
                r += data[sIdx]!;
                g += data[sIdx + 1]!;
                b += data[sIdx + 2]!;
                a += data[sIdx + 3]! / 255;
                count++;
              }
            }
            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);
            a = a / count;
          }

          if (duotoneShadowRGB && duotoneHighlightRGB) {
            // Precise two-color map by luminance, rather than a flat tint
            // wash — shadows land exactly on one color, highlights on the
            // other, so the result reads as deliberately graded, not muddy.
            const lum = Math.max(0, Math.min(1, (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255));
            r = Math.round(duotoneShadowRGB[0] + (duotoneHighlightRGB[0] - duotoneShadowRGB[0]) * lum);
            g = Math.round(duotoneShadowRGB[1] + (duotoneHighlightRGB[1] - duotoneShadowRGB[1]) * lum);
            b = Math.round(duotoneShadowRGB[2] + (duotoneHighlightRGB[2] - duotoneShadowRGB[2]) * lum);
          } else if (grayscale) {
            const L = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
            r = L;
            g = L;
            b = L;
          } else if (tintRGB && tintStrength > 0) {
            const k = Math.max(0, Math.min(1, tintStrength));
            r = Math.round(r * (1 - k) + tintRGB[0] * k);
            g = Math.round(g * (1 - k) + tintRGB[1] * k);
            b = Math.round(b * (1 - k) + tintRGB[2] * k);
          }

          const Lc = luminanceAt(cx, cy);
          const Lx1 = luminanceAt(cx - 1, cy);
          const Lx2 = luminanceAt(cx + 1, cy);
          const Ly1 = luminanceAt(cx, cy - 1);
          const Ly2 = luminanceAt(cx, cy + 1);
          const grad = Math.abs(Lx2 - Lx1) + Math.abs(Ly2 - Ly1) + Math.abs(Lc - (Lx1 + Lx2 + Ly1 + Ly2) / 4);
          const gradientNorm = Math.max(0, Math.min(1, grad / 255));
          const dropoutProb = Math.max(0, Math.min(1, (1 - gradientNorm) * dropoutStrength));
          const drop = hash2D(cx, cy) < dropoutProb;
          const seed = hash2D(cx, cy);

          samples.push({ x, y, r, g, b, a, drop, seed });
        }
      }

      samplesRef.current = samples;
    };

    let cleanup: (() => void) | undefined;

    img.onload = () => {
      if (isCancelled) return;
      compute();
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;

      if (!interactive) {
        const ctx = canvasEl.getContext('2d');
        const dims = dimsRef.current;
        const samples = samplesRef.current;
        if (!ctx || !dims) return;
        if (backgroundColor) {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, dims.width, dims.height);
        } else {
          ctx.clearRect(0, 0, dims.width, dims.height);
        }
        for (const s of samples) {
          if (s.drop || s.a <= 0) continue;
          ctx.globalAlpha = s.a;
          ctx.fillStyle = `rgb(${s.r}, ${s.g}, ${s.b})`;
          if (shape === 'circle') {
            const radius = dims.dot / 2;
            ctx.beginPath();
            ctx.arc(s.x + cellSize / 2, s.y + cellSize / 2, radius, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(s.x + cellSize / 2 - dims.dot / 2, s.y + cellSize / 2 - dims.dot / 2, dims.dot, dims.dot);
          }
        }
        ctx.globalAlpha = 1;
        return;
      }

      const onPointerMove = (e: PointerEvent) => {
        const rect = canvasEl.getBoundingClientRect();
        targetMouseRef.current.x = e.clientX - rect.left;
        targetMouseRef.current.y = e.clientY - rect.top;
        pointerInsideRef.current = true;
        activityTargetRef.current = 1;
      };
      const onPointerEnter = () => {
        pointerInsideRef.current = true;
        activityTargetRef.current = 1;
      };
      const onPointerLeave = () => {
        pointerInsideRef.current = false;
        if (fadeOnLeave) {
          activityTargetRef.current = 0;
        } else {
          targetMouseRef.current.x = -9999;
          targetMouseRef.current.y = -9999;
        }
      };
      canvasEl.addEventListener('pointermove', onPointerMove);
      canvasEl.addEventListener('pointerenter', onPointerEnter);
      canvasEl.addEventListener('pointerleave', onPointerLeave);

      let lastFrame = 0;
      const animate = (now: number) => {
        const minDelta = 1000 / Math.max(1, maxFps);
        if (now - lastFrame < minDelta) {
          rafRef.current = requestAnimationFrame(animate);
          return;
        }
        lastFrame = now;
        const ctx = canvasEl.getContext('2d');
        const dims = dimsRef.current;
        const samples = samplesRef.current;
        if (!ctx || !dims) {
          rafRef.current = requestAnimationFrame(animate);
          return;
        }

        animMouseRef.current.x += (targetMouseRef.current.x - animMouseRef.current.x) * followSpeed;
        animMouseRef.current.y += (targetMouseRef.current.y - animMouseRef.current.y) * followSpeed;

        if (fadeOnLeave) {
          activityRef.current += (activityTargetRef.current - activityRef.current) * fadeSpeed;
        } else {
          activityRef.current = pointerInsideRef.current ? 1 : 0;
        }

        if (backgroundColor) {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, dims.width, dims.height);
        } else {
          ctx.clearRect(0, 0, dims.width, dims.height);
        }

        const mx = animMouseRef.current.x;
        const my = animMouseRef.current.y;
        const sigma = Math.max(1, distortionRadius * 0.5);
        const t = now * 0.001 * jitterSpeed;
        const activity = Math.max(0, Math.min(1, activityRef.current));

        for (const s of samples) {
          if (s.drop || s.a <= 0) continue;
          let drawX = s.x + cellSize / 2;
          let drawY = s.y + cellSize / 2;
          const dx = drawX - mx;
          const dy = drawY - my;
          const dist2 = dx * dx + dy * dy;
          const falloff = Math.exp(-dist2 / (2 * sigma * sigma));
          const influence = falloff * activity;
          if (influence > 0.0005) {
            if (distortionMode === 'repel') {
              const dist = Math.sqrt(dist2) + 0.0001;
              drawX += (dx / dist) * distortionStrength * influence;
              drawY += (dy / dist) * distortionStrength * influence;
            } else if (distortionMode === 'attract') {
              const dist = Math.sqrt(dist2) + 0.0001;
              drawX -= (dx / dist) * distortionStrength * influence;
              drawY -= (dy / dist) * distortionStrength * influence;
            } else {
              const angle = distortionStrength * 0.05 * influence;
              const cosA = Math.cos(angle);
              const sinA = Math.sin(angle);
              const rx = cosA * dx - sinA * dy;
              const ry = sinA * dx + cosA * dy;
              drawX = mx + rx;
              drawY = my + ry;
            }

            if (jitterStrength > 0) {
              const k = s.seed * 43758.5453;
              drawX += Math.sin(t + k) * jitterStrength * influence;
              drawY += Math.cos(t + k * 1.13) * jitterStrength * influence;
            }
          }

          ctx.globalAlpha = s.a;
          ctx.fillStyle = `rgb(${s.r}, ${s.g}, ${s.b})`;
          if (shape === 'circle') {
            const radius = dims.dot / 2;
            ctx.beginPath();
            ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(drawX - dims.dot / 2, drawY - dims.dot / 2, dims.dot, dims.dot);
          }
        }
        ctx.globalAlpha = 1;

        rafRef.current = requestAnimationFrame(animate);
      };

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(animate);

      cleanup = () => {
        canvasEl.removeEventListener('pointermove', onPointerMove);
        canvasEl.removeEventListener('pointerenter', onPointerEnter);
        canvasEl.removeEventListener('pointerleave', onPointerLeave);
        cancelAnimationFrame(rafRef.current);
      };
    };

    img.onerror = () => {
      // Bad URL, network failure, or a non-image file — degrade to just the
      // background color rather than getting stuck on a stale/broken frame.
      samplesRef.current = [];
    };

    return () => {
      isCancelled = true;
      cleanup?.();
    };
  }, [
    src,
    effectiveWidth,
    effectiveHeight,
    cellSize,
    dotScale,
    shape,
    backgroundColor,
    grayscale,
    dropoutStrength,
    interactive,
    distortionStrength,
    distortionRadius,
    distortionMode,
    followSpeed,
    sampleAverage,
    tintColor,
    tintStrength,
    duotoneShadow,
    duotoneHighlight,
    maxFps,
    objectFit,
    jitterStrength,
    jitterSpeed,
    fadeOnLeave,
    fadeSpeed,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      style={responsive ? undefined : { width, height }}
    >
      <canvas ref={canvasRef} aria-label="Pixelated rendering of source image" role="img" />
    </div>
  );
}
