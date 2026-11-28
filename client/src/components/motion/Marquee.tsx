import type { ReactNode } from 'react';

/**
 * An endless horizontal ticker. The children render twice and the track slides by -50%,
 * so the loop is seamless. Pauses on hover; stays still under prefers-reduced-motion.
 */
export function Marquee({ children, seconds = 50, reverse = false, className = '' }: { children: ReactNode; seconds?: number; reverse?: boolean; className?: string }) {
  return (
    <div className={`lp-marquee overflow-hidden ${className}`} style={{ ['--marquee-seconds' as string]: `${seconds}s` }}>
      <div className={`lp-marquee-track flex w-max gap-2 ${reverse ? 'lp-marquee-reverse' : ''}`}>
        <div className="flex shrink-0 gap-2">{children}</div>
        <div className="flex shrink-0 gap-2" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
