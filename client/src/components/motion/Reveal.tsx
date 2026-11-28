import { useRef, type ElementType, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/** Expo-out: fast start, long soft landing. The curve behind most "premium" site motion. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

interface RevealProps {
  children: ReactNode;
  /** Seconds to wait before starting — stagger siblings with i * 0.08. */
  delay?: number;
  /** Start offset in px. */
  y?: number;
  duration?: number;
  className?: string;
  as?: 'div' | 'li' | 'article' | 'section' | 'p' | 'h1' | 'h2' | 'h3' | 'span';
}

/** Fades and rises into place once, when scrolled into view. Honors prefers-reduced-motion. */
export function Reveal({ children, delay = 0, y = 14, duration = 0.7, className, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' });
  const reduce = useReducedMotion();
  const Tag = motion[as] as ElementType;

  if (reduce) return <Tag className={className}>{children}</Tag>;

  return (
    <Tag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </Tag>
  );
}
