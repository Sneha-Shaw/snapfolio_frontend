import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--color-border)] px-6 py-16 text-center">
      {icon && <div className="text-[var(--color-text-faint)]">{icon}</div>}
      <div className="space-y-1">
        <p className="font-medium text-[var(--color-text)]">{title}</p>
        {description && <p className="text-sm text-[var(--color-text-muted)]">{description}</p>}
      </div>
      {action}
    </div>
  );
}
