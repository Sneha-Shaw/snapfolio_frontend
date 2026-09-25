import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]',
        className
      )}
      {...props}
    />
  );
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated-2)] ' +
          'px-2.5 py-1 text-xs font-medium text-[var(--color-text-muted)]',
        className
      )}
      {...props}
    />
  );
}
