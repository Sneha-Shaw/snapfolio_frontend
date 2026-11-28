import type { ReactNode } from 'react';
import { Card } from '@/components/ui';
import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ label, value, icon, className }: StatCardProps) {
  return (
    <Card className={cn('flex items-center justify-between gap-4 p-5', className)}>
      <div className="space-y-1">
        <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
        <p className="font-mono text-2xl font-semibold text-[var(--color-text)]">{value}</p>
      </div>
      {icon && (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
          {icon}
        </div>
      )}
    </Card>
  );
}
