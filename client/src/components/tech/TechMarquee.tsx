import { cn } from '@/utils/cn';
import { TechBadge } from './TechBadge';
import type { Technology } from '@/types/models';

interface TechMarqueeProps {
  technologies: Technology[];
}

function MarqueeRow({ technologies, reverse }: { technologies: Technology[]; reverse?: boolean }) {
  const doubled = [...technologies, ...technologies];

  return (
    <div className="flex overflow-hidden">
      <div className={cn('flex w-max shrink-0 animate-marquee gap-3 pr-3', reverse && '[animation-direction:reverse]')}>
        {doubled.map((tech, i) => (
          <TechBadge key={`${tech._id}-${i}`} technology={tech} />
        ))}
      </div>
    </div>
  );
}

export function TechMarquee({ technologies }: TechMarqueeProps) {
  if (technologies.length === 0) return null;

  const mid = Math.ceil(technologies.length / 2);
  const row1 = technologies.slice(0, mid);
  const row2 = technologies.slice(mid);

  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]/40 py-12">
      <p className="mb-8 text-center text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">
        Tools &amp; technologies
      </p>
      <div className="space-y-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <MarqueeRow technologies={row1} />
        {row2.length > 0 && <MarqueeRow technologies={row2} reverse />}
      </div>
    </section>
  );
}
