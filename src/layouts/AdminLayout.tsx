import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/plans';
import { cn } from '@/utils/cn';
import { Sidebar } from '@/components/admin/Sidebar';
import { Topbar } from '@/components/admin/Topbar';

export function AdminLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const sub = user?.subscription;

  // Trial (or plan) over: everything but Billing waits for a plan.
  if (sub && !sub.active && pathname !== '/admin/billing') return <Navigate to="/admin/billing" replace />;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        {sub?.status === 'trialing' && <TrialBanner daysLeft={sub.daysLeft ?? 0} endsOn={formatDate(sub.periodEnd)} />}
        {sub?.cancelAtPeriodEnd && pathname !== '/admin/billing' && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 bg-amber-500/10 px-6 py-2 text-sm text-[var(--color-text)]" role="status">
            <span>
              <b>Your plan ends on {formatDate(sub.periodEnd)}.</b> After that, editing stops and your portfolio goes offline.
            </span>
            <Link to="/admin/billing" className="rounded-lg bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-[var(--color-on-accent)] hover:opacity-90">
              Resume subscription
            </Link>
          </div>
        )}
        <main className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

/** "Free trial — 12 days left" with a way to choose a plan; louder in the final week. */
function TrialBanner({ daysLeft, endsOn }: { daysLeft: number; endsOn: string }) {
  const urgent = daysLeft <= 7;
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-2 border-b px-6 py-2 text-sm',
        urgent ? 'border-amber-500/30 bg-amber-500/10 text-[var(--color-text)]' : 'border-[var(--color-border)] bg-[var(--color-accent-soft)] text-[var(--color-text)]'
      )}
      role="status"
    >
      <span className="flex items-center gap-2">
        <Sparkles className={cn('size-4', urgent ? 'text-amber-500' : 'text-[var(--color-accent)]')} />
        <b>Free trial</b> — {daysLeft} day{daysLeft === 1 ? '' : 's'} left (ends {endsOn}). Choose a plan to keep editing and keep your portfolio online.
      </span>
      <Link to="/admin/billing" className="rounded-lg bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-[var(--color-on-accent)] hover:opacity-90">
        Choose a plan
      </Link>
    </div>
  );
}
