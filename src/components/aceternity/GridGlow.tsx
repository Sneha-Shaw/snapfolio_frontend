import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface GridGlowProps {
  className?: string;
}

/**
 * Faint dot-grid backdrop with a radial fade mask and a slow-pulsing gradient
 * blob — a minimal, hand-rolled take on aceternity.com-style ambient backgrounds.
 * Purely decorative, kept subtle so it never competes with foreground content.
 */
export function GridGlow({ className }: GridGlowProps) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div
        className="absolute inset-0 opacity-50 [background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:28px_28px]"
        style={{
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 0%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 0%, black 40%, transparent 100%)',
        }}
      />
      <motion.div
        className="absolute left-1/2 top-0 size-[640px] -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-accent-soft) 0%, transparent 70%)' }}
        animate={{ opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
