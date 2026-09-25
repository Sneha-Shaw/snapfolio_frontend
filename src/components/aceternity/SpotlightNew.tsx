import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { hexToRgba, lighten } from '@/lib/color';
import { useTheme } from '@/context/ThemeContext';

interface SpotlightNewProps {
  className?: string;
  particleCount?: number;
}

interface Particle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  peakOpacity: number;
}

function useParticles(count: number): Particle[] {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, id) => ({
        id,
        left: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        duration: 9 + Math.random() * 12,
        delay: Math.random() * 10,
        drift: (Math.random() - 0.5) * 70,
        peakOpacity: 0.35 + Math.random() * 0.5,
      })),
    [count]
  );
}

/**
 * Aceternity UI's "Spotlight New" component
 * (ui.aceternity.com/components/spotlight-new) — a free, copy-paste
 * component: two symmetric animated gradient light-cones sweeping in from
 * the top corners. Reproduced from memory (their docs page only exposes
 * source via an interactive tab this environment can't render), with a
 * warmer secondary tone and a slow-pulsing core glow layered on top for
 * extra richness, and the two sides drifting on slightly different periods
 * so they fall out of phase instead of breathing in a perfect mirror.
 */
export function SpotlightNew({ className, particleCount = 36 }: SpotlightNewProps) {
  const particles = useParticles(particleCount);
  const { theme } = useTheme();
  const midTone = lighten(theme.accentStrong, 0.15);
  const paleTone = lighten(theme.accent, 0.55);

  const gradientFirst = `radial-gradient(68.54% 68.72% at 55.02% 31.46%, ${hexToRgba(theme.accent, 0.24)} 0%, ${hexToRgba(theme.accent, 0.1)} 50%, transparent 80%)`;
  const gradientSecond = `radial-gradient(50% 50% at 50% 50%, ${hexToRgba(midTone, 0.18)} 0%, ${hexToRgba(midTone, 0.08)} 80%, transparent 100%)`;
  const gradientThird = `radial-gradient(50% 50% at 50% 50%, ${hexToRgba(paleTone, 0.12)} 0%, ${hexToRgba(paleTone, 0.05)} 80%, transparent 100%)`;

  const translateY = -350;
  const width = 560;
  const height = 1380;
  const smallWidth = 240;
  const xOffset = 100;

  return (
    <motion.div className={cn('pointer-events-none absolute inset-0 h-full w-full overflow-hidden', className)}>
      <motion.div
        className="absolute left-1/2 top-0 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ background: `radial-gradient(circle, ${hexToRgba(theme.accent, 0.22)} 0%, transparent 70%)` }}
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        animate={{ x: [0, xOffset, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        className="absolute top-0 left-0 z-[1] h-screen w-screen"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(-45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-0"
        />
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(-45deg)`,
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-0 origin-top-left"
        />
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(-45deg)`,
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-32"
        />
      </motion.div>

      <motion.div
        animate={{ x: [0, -xOffset, 0] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        className="absolute top-0 right-0 z-[1] h-screen w-screen"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-0"
        />
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(45deg)`,
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-0 origin-top-right"
        />
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(45deg)`,
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-32"
        />
      </motion.div>

      <div className="absolute inset-0 z-[2]">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute bottom-0 rounded-full"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              backgroundColor: 'var(--color-accent)',
              boxShadow: `0 0 ${p.size * 3}px ${hexToRgba(theme.accent, 0.85)}`,
            }}
            animate={{
              y: ['0%', '-140%'],
              x: [0, p.drift],
              opacity: [0, p.peakOpacity, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
