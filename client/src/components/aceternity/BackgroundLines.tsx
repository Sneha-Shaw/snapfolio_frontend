import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { hexToRgba } from '@/lib/color';
import { useTheme } from '@/context/ThemeContext';

interface BackgroundLinesProps {
  className?: string;
}

interface LineShape {
  d: string;
  duration: number;
  accentTinted: boolean;
  alpha?: number;
}

const LINE_SHAPES: LineShape[] = [
  { d: 'M -50 40 C 200 10, 400 90, 650 30 S 1100 60, 1350 20', duration: 28, accentTinted: false },
  { d: 'M -50 90 C 220 140, 380 30, 620 100 S 1050 40, 1350 110', duration: 34, accentTinted: true, alpha: 0.15 },
  { d: 'M -50 150 C 180 100, 420 200, 680 140 S 1080 190, 1350 150', duration: 26, accentTinted: false },
  { d: 'M -50 210 C 240 260, 460 160, 700 220 S 1120 180, 1350 240', duration: 38, accentTinted: true, alpha: 0.12 },
  { d: 'M -50 270 C 200 230, 400 320, 660 260 S 1090 310, 1350 270', duration: 30, accentTinted: false },
  { d: 'M -50 320 C 220 370, 440 280, 690 340 S 1100 300, 1350 330', duration: 40, accentTinted: true, alpha: 0.1 },
  { d: 'M -50 370 C 190 330, 410 400, 670 360 S 1080 390, 1350 380', duration: 32, accentTinted: false },
];

/**
 * Aceternity UI's "Background Lines" component
 * (ui.aceternity.com/components/background-lines) — a free, copy-paste
 * component: smooth curved SVG paths flowing across the background,
 * inspired by height.app's hero. Reproduced from memory (their docs page
 * only exposes source via an interactive tab this environment can't
 * render).
 */
export function BackgroundLines({ className }: BackgroundLinesProps) {
  const { theme } = useTheme();

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      style={{
        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 100%)',
      }}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1000 400"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {LINE_SHAPES.map((line, i) => (
          <motion.path
            key={i}
            d={line.d}
            stroke={line.accentTinted ? hexToRgba(theme.accent, line.alpha ?? 0.12) : 'var(--color-border-hover)'}
            strokeWidth={1}
            strokeDasharray="12 8"
            fill="none"
            animate={{ strokeDashoffset: [0, -1000] }}
            transition={{ duration: line.duration, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </svg>
    </div>
  );
}
