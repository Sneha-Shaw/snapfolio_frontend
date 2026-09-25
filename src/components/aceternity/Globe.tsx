import { useEffect, useRef } from 'react';
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const [mr, mg, mb] = hexToRgb(theme.accent);
    const light = isLight(theme.background);

    let width = 0;
    const onResize = () => {
      if (canvas) width = canvas.offsetWidth;
    };
    window.addEventListener('resize', onResize);
    onResize();

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: light ? 0 : 1,
      diffuse: light ? 1.2 : 1.4,
      mapSamples: 16000,
      mapBrightness: light ? 4 : 9,
      baseColor: light ? [0.95, 0.95, 0.97] : [0.35, 0.35, 0.55],
      markerColor: [mr / 255, mg / 255, mb / 255],
      glowColor: light ? [0.9, 0.9, 0.93] : [0.4, 0.4, 0.65],
      markers: markers.map((m) => ({ location: m.location, size: m.size })),
      onRender: (state) => {
        state.phi = phiRef.current;
        phiRef.current += 0.004;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, [markers, theme.accent, theme.background]);

  return (
    <div className={className} style={{ aspectRatio: 1, position: 'relative' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', contain: 'layout paint size' }} />
    </div>
  );
}
