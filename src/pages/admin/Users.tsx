import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { CreditCard, DollarSign, Users as UsersIcon } from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { Badge, Card, EmptyState, PageSpinner, Switch } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';
import { userService } from '@/services/user.service';
import { formatMoney, subscriptionLabel } from '@/lib/plans';
import { planService } from '@/services/plan.service';
import type { ManagedUser } from '@/types/models';

/** Super admin: every account on the platform, its plan, and access control. */
export default function Users() {
  const fetcher = useCallback(() => userService.list(), []);
  const { data, isLoading, refetch } = useFetch(fetcher);
  const { data: plans } = useFetch(() => planService.list(), []);
  const [pending, setPending] = useState<string | null>(null);

  const toggleActive = async (user: ManagedUser) => {
    setPending(user.id);
    try {
      await userService.setActive(user.id, !user.isActive);
      toast.success(user.isActive ? `${user.name} deactivated` : `${user.name} reactivated`);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setPending(null);
    }
  };

  if (isLoading || !data) return <PageSpinner />;
  const { items, summary } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Users</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Every account on the platform. Deactivating one signs it out and blocks its login.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Accounts" value={summary.total} icon={<UsersIcon className="size-5" />} />
        <StatCard label="Paying (monthly + yearly)" value={summary.activeSubscriptions} icon={<CreditCard className="size-5" />} />
        <StatCard label="Monthly revenue (simulated)" value={formatMoney(summary.mrr, summary.currency)} icon={<DollarSign className="size-5" />} />
      </div>

      {plans && (
        <div className="flex flex-wrap gap-2 text-xs text-[var(--color-text-muted)]">
          {plans.map((p) => (
            <Badge key={p.id}>
              {p.interval === 'trial' ? 'On trial' : p.name}: {summary.byPlan[p.id] ?? 0}
            </Badge>
          ))}
          <Badge className="text-amber-500">Trial or plan ended: {summary.expired}</Badge>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState title="No accounts yet" description="Subscribers appear here after checkout." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-text-faint)]">
              <tr>
                <th className="px-4 py-3 font-medium">Account</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Card</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 text-right font-medium">Projects</th>
                <th className="px-4 py-3 font-medium">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {items.map((u) => (
                <tr key={u.id} className={u.isActive ? '' : 'opacity-60'}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--color-text)]">{u.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge>{u.role === 'super_admin' ? 'Super admin' : 'User'}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {u.subscription ? (
                      <span className={u.subscription.active ? 'text-[var(--color-text-muted)]' : 'font-medium text-amber-500'}>{subscriptionLabel(u.subscription)}</span>
                    ) : (
                      <span className="text-[var(--color-text-faint)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">
                    {u.subscription?.cardLast4 ? `${u.subscription.cardBrand} •••• ${u.subscription.cardLast4}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">{new Date(u.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-[var(--color-text-muted)]">{u.projects}</td>
                  <td className="px-4 py-3">
                    {u.role === 'super_admin' ? (
                      <span className="text-xs text-[var(--color-text-faint)]">Always</span>
                    ) : (
                      <Switch checked={u.isActive} onChange={() => toggleActive(u)} disabled={pending === u.id} label={u.isActive ? 'Active' : 'Inactive'} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
