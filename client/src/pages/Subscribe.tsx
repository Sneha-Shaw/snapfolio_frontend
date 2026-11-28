import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Check, Lock } from 'lucide-react';
import { Button, Input, PageSpinner } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useFetch } from '@/hooks/useFetch';
import { planService } from '@/services/plan.service';
import { ApiRequestError } from '@/services/api';
import { PRODUCT_NAME } from '@/config/product';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { cn } from '@/utils/cn';
import { priceLabel } from '@/lib/plans';
import { formatCardNumber, formatExpiry } from '@/lib/card';
import { USERNAME_STATUS_TEXT, normalizeUsername, suggestUsername, useUsernameStatus } from '@/lib/username';

type FieldErrors = Record<string, string>;

/** API validation details arrive as [{ path: 'card.number', message }]. */
function toFieldErrors(err: unknown): FieldErrors {
  if (!(err instanceof ApiRequestError) || !Array.isArray(err.details)) return {};
  return Object.fromEntries((err.details as { path: string; message: string }[]).map((d) => [d.path, d.message]));
}

/** Checkout: the free trial needs no card; monthly / yearly use the simulated card form. Then setup opens. */
export default function Subscribe() {
  const { subscribe } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: plans, isLoading, error } = useFetch(() => planService.list(), []);

  const [form, setForm] = useState({ name: '', email: '', password: '', username: '', number: '', expiry: '', cvc: '' });
  // Suggested from the name until the user types their own.
  const [usernameEdited, setUsernameEdited] = useState(false);
  const usernameStatus = useUsernameStatus(form.username);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) return <PageSpinner />;
  if (error || !plans?.length) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-sm text-[var(--color-text-muted)]">
        Couldn't load plans. <Link to="/" className="ml-1 underline">Back to home</Link>
      </div>
    );
  }

  // No plan chosen → the free trial.
  const plan = plans.find((p) => p.id === searchParams.get('plan')) ?? plans.find((p) => p.interval === 'trial') ?? plans[0]!;
  const isTrial = plan.interval === 'trial';
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((f) => ({ ...f, name, username: usernameEdited ? f.username : suggestUsername(name) }));
  };
  const setUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameEdited(true);
    setErrors(({ username: _stale, ...rest }) => rest);
    setForm((f) => ({ ...f, username: normalizeUsername(e.target.value) }));
  };
  const usernameBlocked = usernameStatus === 'invalid' || usernameStatus === 'taken';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    try {
      await subscribe({
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
        plan: plan.id,
        card: isTrial ? undefined : { number: form.number, expiry: form.expiry, cvc: form.cvc },
      });
      toast.success(`Welcome to ${PRODUCT_NAME}!`);
      // New accounts start with setup (skippable) — profession-matched designs.
      navigate('/onboarding', { replace: true });
    } catch (err) {
      setErrors(toFieldErrors(err));
      toast.error(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="font-mono text-sm font-semibold text-[var(--color-text)]">
            ← {PRODUCT_NAME}
          </Link>
          <ThemeToggle />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1.2fr]">
          {/* Plan summary */}
          <aside className="space-y-4">
            <h1 className="text-2xl font-semibold text-[var(--color-text)]">Choose your plan</h1>
            <p className="text-sm text-[var(--color-text-muted)]">Start free for 30 days, or go straight to monthly or yearly. Every plan includes everything.</p>
            <div className="space-y-2" role="radiogroup" aria-label="Plan">
              {plans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={p.id === plan.id}
                  onClick={() => setSearchParams({ plan: p.id }, { replace: true })}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors',
                    p.id === plan.id
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]'
                      : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-hover)]'
                  )}
                >
                  <span className="text-sm font-medium text-[var(--color-text)]">{p.name}</span>
                  <span className="text-sm tabular-nums text-[var(--color-text-muted)]">
                    {priceLabel(p).amount} {priceLabel(p).per}
                    {p.badge && <span className="ml-2 rounded-full bg-[var(--color-accent)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-on-accent)]">{p.badge}</span>}
                  </span>
                </button>
              ))}
            </div>
            <ul className="space-y-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-sm text-[var(--color-text-muted)]">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" /> {f}
                </li>
              ))}
            </ul>
          </aside>

          {/* Account + payment */}
          <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6" noValidate>
            <fieldset className="space-y-4">
              <legend className="mb-1 text-sm font-semibold text-[var(--color-text)]">Your account</legend>
              <Input label="Name" autoComplete="name" value={form.name} onChange={setName} error={errors.name} required />
              <div className="space-y-1.5">
                <label htmlFor="username" className="text-sm font-medium text-[var(--color-text)]">
                  Username
                </label>
                <div
                  className={cn(
                    'flex items-center overflow-hidden rounded-lg border bg-[var(--color-bg-elevated)] focus-within:border-[var(--color-accent)]',
                    usernameBlocked || errors.username ? 'border-red-500/50' : 'border-[var(--color-border)]'
                  )}
                >
                  <span className="select-none whitespace-nowrap border-r border-[var(--color-border)] bg-[var(--color-bg-elevated-2)] px-3 py-2 text-sm text-[var(--color-text-faint)]">
                    {window.location.host}/p/
                  </span>
                  <input
                    id="username"
                    value={form.username}
                    onChange={setUsername}
                    autoComplete="username"
                    spellCheck={false}
                    aria-describedby="username-status"
                    aria-invalid={usernameBlocked || Boolean(errors.username)}
                    required
                    className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:outline-none"
                    placeholder="your-name"
                  />
                </div>
                <p
                  id="username-status"
                  aria-live="polite"
                  className={cn(
                    'text-xs',
                    errors.username || usernameBlocked ? 'text-red-400' : usernameStatus === 'available' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-faint)]'
                  )}
                >
                  {errors.username ?? (usernameStatus === 'idle' ? 'Your portfolio’s address — you can change it later.' : USERNAME_STATUS_TEXT[usernameStatus])}
                </p>
              </div>
              <Input label="Email" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} required />
              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={set('password')}
                error={errors.password}
                hint="At least 8 characters."
                required
              />
            </fieldset>

            {isTrial ? (
              <p className="flex gap-2 rounded-lg border-t border-[var(--color-border)] bg-[var(--color-bg-elevated-2)] px-3 py-3 text-sm text-[var(--color-text-muted)]">
                <Check className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" />
                No card needed. After 30 days, choose monthly or yearly to keep editing and keep your portfolio online.
              </p>
            ) : (
              <fieldset className="space-y-4 border-t border-[var(--color-border)] pt-5">
                <legend className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text)]">
                  <Lock className="size-3.5" /> Payment
                </legend>
                <p className="rounded-lg bg-[var(--color-bg-elevated-2)] px-3 py-2 text-xs text-[var(--color-text-muted)]">
                  Demo checkout — nothing is charged. Use <span className="font-mono">4242 4242 4242 4242</span>, any future expiry and any CVC.
                </p>
                <Input
                  label="Card number"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 1234 1234 1234"
                  value={form.number}
                  onChange={(e) => setForm((f) => ({ ...f, number: formatCardNumber(e.target.value) }))}
                  error={errors['card.number']}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    value={form.expiry}
                    onChange={(e) => setForm((f) => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                    error={errors['card.expiry']}
                    required
                  />
                  <Input
                    label="CVC"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    maxLength={4}
                    value={form.cvc}
                    onChange={(e) => setForm((f) => ({ ...f, cvc: e.target.value.replace(/\D/g, '') }))}
                    error={errors['card.cvc']}
                    required
                  />
                </div>
              </fieldset>
            )}

            <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting} disabled={usernameBlocked || usernameStatus === 'checking'}>
              {isTrial ? 'Start my free trial' : `Subscribe — ${priceLabel(plan).amount} ${priceLabel(plan).per}`}
            </Button>
            <p className="text-center text-xs text-[var(--color-text-faint)]">
              Already have an account? <Link to="/admin/login" className="underline hover:text-[var(--color-text)]">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
