import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CalendarClock, CreditCard, Lock, RotateCcw, XCircle } from 'lucide-react';
import { Button, ConfirmDialog, Input, PageSpinner } from '@/components/ui';
import { SettingsSection } from '@/components/admin/SettingsSection';
import { useAuth } from '@/context/AuthContext';
import { useFetch } from '@/hooks/useFetch';
import { planService } from '@/services/plan.service';
import { ApiRequestError } from '@/services/api';
import { DEMO_CARD_HINT, formatCardNumber, formatExpiry } from '@/lib/card';
import { formatDate, perMonthNote, priceLabel, subscriptionLabel } from '@/lib/plans';
import { cn } from '@/utils/cn';
import type { Plan } from '@/types/models';

type PaidPlan = 'monthly' | 'yearly';
type PaidPlanInfo = Plan & { id: PaidPlan };

/** One selectable plan card — shared by "Choose a plan" and "Change plan". */
function PlanOption({ plan, selected, current, scheduled, onSelect }: { plan: PaidPlanInfo; selected: boolean; current: boolean; scheduled: boolean; onSelect: () => void }) {
  const price = priceLabel(plan);
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'relative rounded-xl border p-4 text-left transition-colors',
        selected ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] ring-2 ring-[var(--color-accent)]/30' : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-[var(--color-text)]">{plan.name}</span>
        <span className="flex gap-1.5">
          {current && <span className="rounded-full bg-[var(--color-bg-elevated-2)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">Current</span>}
          {scheduled && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-500">Scheduled</span>}
          {plan.badge && !current && <span className="rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-on-accent)]">{plan.badge}</span>}
        </span>
      </span>
      <span className="mt-2 block">
        <span className="text-2xl font-semibold tabular-nums text-[var(--color-text)]">{price.amount}</span>
        <span className="text-sm text-[var(--color-text-muted)]"> {price.per}</span>
      </span>
      {perMonthNote(plan) && <span className="block text-xs text-[var(--color-text-faint)]">{perMonthNote(plan)}</span>}
      <span className="mt-2 block text-xs text-[var(--color-text-muted)]">{plan.tagline}</span>
    </button>
  );
}

/**
 * The account's plan: trial countdown, paying for a plan, switching Monthly ↔
 * Yearly at the next renewal, and canceling (or resuming) a subscription.
 */
export default function Billing() {
  const { user, upgrade, changePlan, cancelSubscription, resumeSubscription } = useAuth();
  const navigate = useNavigate();
  const { data: plans, isLoading } = useFetch(() => planService.list(), []);
  const sub = user?.subscription;

  // Yearly is the better deal, so it's the suggestion when paying.
  const [chosen, setChosen] = useState<PaidPlan>('yearly');
  // In "Change plan": what the user has clicked (defaults to whatever will apply at renewal).
  const [switchTo, setSwitchTo] = useState<PaidPlan | null>(null);
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (isLoading || !plans || !user) return <PageSpinner />;

  if (user.role === 'super_admin' || !sub || sub.status === 'none') {
    return (
      <SettingsSection title="Billing" icon={CreditCard} tone="teal" description="Your account runs the platform — it doesn’t need a plan.">
        <p className="px-5 py-6 text-sm text-[var(--color-text-muted)]">Nothing to pay here.</p>
      </SettingsSection>
    );
  }

  const paid = plans.filter((p): p is PaidPlanInfo => p.interval !== 'trial');
  const planName = (id: string | null) => plans.find((p) => p.id === id)?.name ?? '';
  const expired = !sub.active;
  const running = sub.status === 'active'; // paid, renewing
  const canceled = sub.cancelAtPeriodEnd; // paid, ends at periodEnd
  const needsCheckout = sub.status === 'trialing' || expired;
  const atRenewal: PaidPlan | null = running ? (sub.pendingPlan ?? (sub.plan as PaidPlan)) : null;
  const selectedSwitch = switchTo ?? atRenewal;

  const run = async (action: () => Promise<void>, success: string) => {
    setBusy(true);
    try {
      await action();
      toast.success(success);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  const pay = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setBusy(true);
    try {
      await upgrade({ plan: chosen, card });
      toast.success(expired ? 'Welcome back — your portfolio is live again' : `You’re on the ${planName(chosen)} plan`);
      setCard({ number: '', expiry: '', cvc: '' });
      if (expired) navigate('/admin/personal');
    } catch (err) {
      if (err instanceof ApiRequestError && Array.isArray(err.details)) {
        setErrors(Object.fromEntries((err.details as { path: string; message: string }[]).map((d) => [d.path.replace(/^card\./, ''), d.message])));
      }
      toast.error(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setBusy(false);
    }
  };

  const scheduleSwitch = (plan: PaidPlan) =>
    run(
      async () => {
        await changePlan(plan);
        setSwitchTo(null);
      },
      plan === sub.plan ? `You’ll stay on ${planName(plan)}` : `You’ll move to ${planName(plan)} on ${formatDate(sub.periodEnd)}`
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Billing</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Your plan, changes to it, and canceling.</p>
      </div>

      {/* Where the account stands */}
      <section
        className={cn(
          'relative overflow-hidden rounded-2xl border p-6 shadow-[var(--shadow-card)]',
          expired || canceled ? 'border-amber-500/40 bg-amber-500/5' : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)]'
        )}
      >
        <p className={cn('text-xs font-medium uppercase tracking-widest', expired || canceled ? 'text-amber-500' : 'text-[var(--color-accent)]')}>Current plan</p>
        <p className="mt-1 text-xl font-semibold text-[var(--color-text)]">{subscriptionLabel(sub)}</p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          {sub.status === 'trialing' && <>Your free trial ends on <b>{formatDate(sub.periodEnd)}</b>. Choose a plan before then to keep editing and keep your portfolio online.</>}
          {expired && <>Your {sub.plan === 'trial' ? 'free trial' : 'plan'} has ended. Your work is safe — choose a plan below to edit again and bring your portfolio back online.</>}
          {running && (
            <>
              Renews on <b>{formatDate(sub.periodEnd)}</b> at {priceLabel(paid.find((p) => p.id === atRenewal)!).amount}
              {sub.cardLast4 && <> · {sub.cardBrand} •••• {sub.cardLast4}</>}.
            </>
          )}
          {canceled && (
            <>
              Canceled — you keep full access until <b>{formatDate(sub.periodEnd)}</b>. After that, editing stops and your portfolio goes offline (nothing is deleted).
            </>
          )}
        </p>
        {running && sub.pendingPlan && (
          <p className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-[var(--color-text)]">
            <CalendarClock className="size-4 text-amber-500" />
            Switching to <b>{planName(sub.pendingPlan)}</b> on {formatDate(sub.periodEnd)}.
            <button type="button" onClick={() => scheduleSwitch(sub.plan as PaidPlan)} disabled={busy} className="font-medium text-[var(--color-accent)] hover:underline">
              Keep {planName(sub.plan)}
            </button>
          </p>
        )}
        {canceled && (
          <div className="mt-4">
            <Button size="sm" onClick={() => run(resumeSubscription, `Your ${planName(sub.plan)} plan will keep renewing`)} isLoading={busy}>
              <RotateCcw className="size-4" /> Resume subscription
            </Button>
          </div>
        )}
        {sub.status === 'trialing' && sub.daysLeft !== null && (
          <div className="mt-4 h-2 max-w-md overflow-hidden rounded-full bg-[var(--color-bg-elevated-2)]" aria-hidden="true">
            <div className="h-full rounded-full bg-[var(--color-accent)]" style={{ width: `${Math.max(4, (sub.daysLeft / 30) * 100)}%` }} />
          </div>
        )}
      </section>

      {/* Trial or ended: pay for a plan, starting today */}
      {needsCheckout && (
        <form onSubmit={pay}>
          <SettingsSection
            title="Choose a plan"
            icon={CreditCard}
            tone="teal"
            description="Every plan includes everything — it’s only how you’re billed. Starts today."
            footer={
              <>
                <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-faint)]">
                  <Lock className="size-3" /> {DEMO_CARD_HINT}
                </span>
                <Button type="submit" size="sm" isLoading={busy}>
                  Pay {priceLabel(paid.find((p) => p.id === chosen)!).amount}
                </Button>
              </>
            }
          >
            <div className="grid gap-3 p-5 sm:grid-cols-2" role="radiogroup" aria-label="Plan">
              {paid.map((p) => (
                <PlanOption key={p.id} plan={p} selected={chosen === p.id} current={false} scheduled={false} onSelect={() => setChosen(p.id)} />
              ))}
            </div>
            <div className="grid gap-4 border-t border-[var(--color-border)] p-5 sm:grid-cols-[2fr_1fr_1fr]">
              <Input
                label="Card number"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 1234 1234 1234"
                value={card.number}
                onChange={(e) => setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))}
                error={errors.number}
                required
              />
              <Input
                label="Expiry"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                value={card.expiry}
                onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                error={errors.expiry}
                required
              />
              <Input
                label="CVC"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                maxLength={4}
                value={card.cvc}
                onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, '') }))}
                error={errors.cvc}
                required
              />
            </div>
          </SettingsSection>
        </form>
      )}

      {/* Running plan: switch at the next renewal — nothing charged today */}
      {running && atRenewal && selectedSwitch && (
        <SettingsSection
          title="Change plan"
          icon={CalendarClock}
          tone="teal"
          description={`Switches take effect at your next renewal (${formatDate(sub.periodEnd)}) using your card on file — nothing is charged today, and you keep what you’ve paid for.`}
          footer={
            <>
              <span className="text-xs text-[var(--color-text-faint)]">
                {selectedSwitch === atRenewal
                  ? `From ${formatDate(sub.periodEnd)}: ${planName(atRenewal)}.`
                  : `From ${formatDate(sub.periodEnd)}: ${planName(selectedSwitch)} at ${priceLabel(paid.find((p) => p.id === selectedSwitch)!).amount} ${priceLabel(paid.find((p) => p.id === selectedSwitch)!).per}.`}
              </span>
              <Button size="sm" onClick={() => scheduleSwitch(selectedSwitch)} isLoading={busy} disabled={selectedSwitch === atRenewal}>
                {selectedSwitch === atRenewal ? 'No change' : selectedSwitch === sub.plan ? `Keep ${planName(sub.plan)}` : `Switch to ${planName(selectedSwitch)} on ${formatDate(sub.periodEnd)}`}
              </Button>
            </>
          }
        >
          <div className="grid gap-3 p-5 sm:grid-cols-2" role="radiogroup" aria-label="Plan from next renewal">
            {paid.map((p) => (
              <PlanOption
                key={p.id}
                plan={p}
                selected={selectedSwitch === p.id}
                current={sub.plan === p.id}
                scheduled={sub.pendingPlan === p.id}
                onSelect={() => setSwitchTo(p.id)}
              />
            ))}
          </div>
        </SettingsSection>
      )}

      {/* Running plan: cancel */}
      {running && (
        <section className="rounded-2xl border border-red-500/25 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--color-text)]">
                <XCircle className="size-4 text-red-400" /> Cancel subscription
              </h2>
              <p className="mt-1 max-w-xl text-sm text-[var(--color-text-muted)]">
                Stops renewal. You keep full access until {formatDate(sub.periodEnd)}; after that editing stops and your portfolio goes offline. Nothing is deleted, and you can resume before then or subscribe again later.
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={() => setConfirmCancel(true)}>
              Cancel subscription
            </Button>
          </div>
        </section>
      )}

      <ConfirmDialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        title="Cancel your subscription?"
        description={`Your ${planName(sub.plan)} plan won’t renew. You keep full access until ${formatDate(sub.periodEnd)}, then editing stops and your portfolio goes offline. You can resume any time before then.`}
        confirmLabel="Cancel subscription"
        onConfirm={async () => {
          await run(cancelSubscription, `Canceled — you have access until ${formatDate(sub.periodEnd)}`);
          setConfirmCancel(false);
        }}
      />
    </div>
  );
}
