import { cn } from '@/utils/cn';
import { getTechIcon } from '@/lib/techIcons';
import type { Technology } from '@/types/models';

interface TechBadgeProps {
  technology: Technology;
  className?: string;
}

export function TechBadge({ technology, className }: TechBadgeProps) {
  const Icon = getTechIcon(technology.icon || technology.slug, technology.category);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated-2)] ' +
          'px-3 py-1.5 font-mono text-xs font-medium text-[var(--color-text-muted)]',
        className
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      {technology.name}
    </span>
  );
}
