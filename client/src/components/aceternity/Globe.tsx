import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import createGlobe from 'cobe';
import { hexToRgb, isLight } from '@/lib/color';
import { useTheme } from '@/context/ThemeContext';

interface GlobeMarker {
  location: [number, number];
  size: number;
}

interface GlobeProps {
  className?: string;
  markers?: GlobeMarker[];
}

/**
 * Aceternity UI's "Globe" / "GitHub Globe" component
 * (ui.aceternity.com/components/3d-globe) — a free, copy-paste component
 * built on the `cobe` WebGL globe renderer. Reproduced from memory (their
 * docs page only exposes source via an interactive tab this environment
 * can't render), verified against `cobe`'s real TypeScript types.
 */
const DEFAULT_MARKERS: GlobeMarker[] = [{ location: [20.5937, 78.9629], size: 0.08 }];

export function Globe({ className, markers = DEFAULT_MARKERS }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const visible = useInView(containerRef, { margin: '80px' });
  const reducedMotion = useReducedMotion();
  const [tabVisible, setTabVisible] = useState(!document.hidden);
  const { theme } = useTheme();

  useEffect(() => {
    const update = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible || !tabVisible || reducedMotion) return;

    const [mr, mg, mb] = hexToRgb(theme.accent);
    const light = isLight(theme.background);

    let width = 0;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    const onResize = () => {
      width = Math.min(canvas.offsetWidth, 480);
    };
    const resize = new ResizeObserver(onResize);
    resize.observe(canvas);
    onResize();

    const globe = createGlobe(canvas, {
      devicePixelRatio: pixelRatio,
      width: width * pixelRatio,
      height: width * pixelRatio,
      phi: 0,
      theta: 0.3,
      dark: light ? 0 : 1,
      diffuse: light ? 1.2 : 1.4,
      mapSamples: 6000,
      mapBrightness: light ? 4 : 9,
      baseColor: light ? [0.95, 0.95, 0.97] : [0.35, 0.35, 0.55],
      markerColor: [mr / 255, mg / 255, mb / 255],
      glowColor: light ? [0.9, 0.9, 0.93] : [0.4, 0.4, 0.65],
      markers: markers.map((m) => ({ location: m.location, size: m.size })),
      onRender: (state) => {
        state.phi = phiRef.current;
        phiRef.current += 0.004;
        state.width = width * pixelRatio;
        state.height = width * pixelRatio;
      },
    });

    return () => {
      globe.destroy();
      resize.disconnect();
    };
  }, [markers, theme.accent, theme.background, visible, tabVisible, reducedMotion]);

  return (
    <div ref={containerRef} className={className} style={{ aspectRatio: 1, position: 'relative' }} aria-hidden="true">
      {reducedMotion ? <svg viewBox="0 0 200 200" width="100%" height="100%" fill="none" stroke={theme.accent} opacity="0.5">
        <circle cx="100" cy="100" r="90" /><ellipse cx="100" cy="100" rx="45" ry="90" />
        <ellipse cx="100" cy="100" rx="90" ry="30" /><path d="M10 100h180M100 10v180" />
      </svg> : <canvas ref={canvasRef} style={{ width: '100%', height: '100%', contain: 'layout paint size' }} />}
    </div>
  );
}
