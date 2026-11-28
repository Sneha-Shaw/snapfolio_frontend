import type { Plan, Subscription } from '@/types/models';

/** ₹4,990 — Indian digit grouping, no paise. */
export function formatMoney(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

/** "₹499 / month", "₹4,990 / year", "₹0 for 30 days". */
export function priceLabel(plan: Plan, trialDays = 30): { amount: string; per: string } {
  if (plan.interval === 'trial') return { amount: formatMoney(0, plan.currency), per: `for ${trialDays} days` };
  return { amount: formatMoney(plan.price, plan.currency), per: plan.interval === 'year' ? '/ year' : '/ month' };
}

/** Yearly as a monthly figure, e.g. "₹416 / month, billed yearly". */
export function perMonthNote(plan: Plan): string | null {
  return plan.interval === 'year' ? `${formatMoney(Math.round(plan.price / 12), plan.currency)} / month, billed yearly` : null;
}

/** "22 Dec" */
function shortDate(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '';
}

export function formatDate(iso: string | null | undefined): string {
  return iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '';
}

/** One line for badges and the billing page: "Trial · 12 days left", "Yearly", "Trial ended". */
export function subscriptionLabel(sub: Subscription | null | undefined): string {
  if (!sub || sub.status === 'none') return '';
  if (sub.status === 'trialing') return `Trial · ${sub.daysLeft} day${sub.daysLeft === 1 ? '' : 's'} left`;
  if (sub.status === 'expired') return sub.plan === 'trial' ? 'Trial ended' : 'Plan ended';
  const name = sub.plan === 'yearly' ? 'Yearly' : 'Monthly';
  return sub.status === 'canceled' ? `${name} · ends ${shortDate(sub.periodEnd)}` : name;
}
