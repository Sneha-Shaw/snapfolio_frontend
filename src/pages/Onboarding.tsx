import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button, Input, PageSpinner } from '@/components/ui';
import { LivePreview } from '@/components/admin/LivePreview';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { useFetch } from '@/hooks/useFetch';
import { profileService } from '@/services/profile.service';
import { presetLayout, type LayoutPreset } from '@/components/sections/registry';
import { DEFAULT_THEME, THEME_PRESETS, themeFromPreset } from '@/lib/themes';
import { PROFESSIONS, designsFor } from '@/lib/professions';
import { previewHref } from '@/lib/preview';
import { PRODUCT_NAME } from '@/config/product';
import { cn } from '@/utils/cn';
import type { SiteTheme } from '@/types/models';

const STEPS = ['About you', 'Designs for you'] as const;

/**
 * First-run setup (also reachable any time from Build portfolio): basic
 * details and a profession, then layouts made for that profession with a live
 * preview of the real page. Never blocks the rest of the admin.
 */
export default function Onboarding() {
  const { user, setProfession } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useFetch(() => profileService.get(), []);

  const [step, setStep] = useState(0);
  const [details, setDetails] = useState({ name: '', headline: '', location: '' });
  const [profession, setProfessionDraft] = useState(user?.profession ?? '');
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) setDetails({ name: profile.name || user?.name || '', headline: profile.headline ?? '', location: profile.location ?? '' });
  }, [profile, user?.name]);

  const designs = useMemo(() => designsFor(profession), [profession]);
  const choice = designs.find((d) => d.id === selected) ?? designs[0];

  if (user && !user.subscription.active) return <Navigate to="/admin/billing" replace />;
  if (isLoading) return <PageSpinner />;

  const saveDetails = async () => {
    setBusy(true);
    try {
      await profileService.update({ name: details.name.trim(), headline: details.headline.trim(), location: details.location.trim() });
      await setProfession(profession);
      setSelected(designsFor(profession)[0]?.id ?? null);
      setStep(1);
      window.scrollTo({ top: 0 });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save your details');
    } finally {
      setBusy(false);
    }
  };

  const applyDesign = async (preset: LayoutPreset) => {
    setBusy(true);
    try {
      const matching = THEME_PRESETS.find((t) => t.id === preset.theme);
      const theme: SiteTheme = { ...(matching ? themeFromPreset(matching) : DEFAULT_THEME), footer: preset.footer ?? '' };
      await profileService.update({ template: preset.id, layout: presetLayout(preset.id), theme });
      toast.success(`${preset.name} is your design — fine-tune it any time`);
      navigate('/admin/build', { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not apply the design');
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-4 pb-16 pt-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-4">
          <p className="font-mono text-sm font-semibold text-[var(--color-text)]">{PRODUCT_NAME}</p>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/admin/personal" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
              Skip for now
            </Link>
          </div>
        </header>

        <ol className="mx-auto mt-10 grid max-w-md grid-cols-2 gap-2" aria-label="Setup progress">
          {STEPS.map((label, i) => (
            <li key={label} aria-current={i === step ? 'step' : undefined}>
              <div className={cn('h-1 rounded-full', i <= step ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]')} />
              <p className={cn('mt-2 text-xs', i === step ? 'font-medium text-[var(--color-text)]' : 'text-[var(--color-text-faint)]')}>
                {i + 1}. {label}
              </p>
            </li>
          ))}
        </ol>

        {step === 0 && (
          <section className="mx-auto mt-10 max-w-3xl space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-semibold text-[var(--color-text)]">Let’s set up your portfolio</h1>
              <p className="mt-2 text-[var(--color-text-muted)]">A few basics, and what you do — we’ll show designs made for your kind of work.</p>
            </div>

            <div className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-card)] sm:grid-cols-3">
              <Input label="Your name" value={details.name} onChange={(e) => setDetails((d) => ({ ...d, name: e.target.value }))} required />
              <Input label="Headline" placeholder="e.g. Wedding photographer" value={details.headline} onChange={(e) => setDetails((d) => ({ ...d, headline: e.target.value }))} />
              <Input label="Location" placeholder="e.g. Kolkata, India" value={details.location} onChange={(e) => setDetails((d) => ({ ...d, location: e.target.value }))} />
            </div>

            <fieldset>
              <legend className="text-sm font-semibold text-[var(--color-text)]">What do you do?</legend>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup">
                {PROFESSIONS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    role="radio"
                    aria-checked={profession === p}
                    onClick={() => setProfessionDraft(p)}
                    className={cn(
                      'flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm transition-colors',
                      profession === p
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] font-medium text-[var(--color-text)]'
                        : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text)]'
                    )}
                  >
                    {p}
                    {profession === p && <Check className="size-4 shrink-0 text-[var(--color-accent)]" />}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="flex justify-end">
              <Button onClick={saveDetails} isLoading={busy} disabled={!details.name.trim() || !profession}>
                See designs for me <ArrowRight className="size-4" />
              </Button>
            </div>
          </section>
        )}

        {step === 1 && choice && (
          <section className="mt-10 space-y-6">
            <div>
              <h1 className="text-3xl font-semibold text-[var(--color-text)]">Designs for {profession.toLowerCase().startsWith('something') ? 'you' : profession.toLowerCase()}</h1>
              <p className="mt-2 text-[var(--color-text-muted)]">Pick one to start from — every section, colour and footer stays editable. The preview shows your real page.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
              <ul className="grid content-start gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Designs">
                {designs.map((preset, i) => {
                  const theme = THEME_PRESETS.find((t) => t.id === preset.theme);
                  const active = preset.id === choice.id;
                  return (
                    <li key={preset.id}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setSelected(preset.id)}
                        className={cn(
                          'flex w-full items-stretch gap-3 overflow-hidden rounded-xl border text-left transition-colors',
                          active
                            ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] ring-2 ring-[var(--color-accent)]/30'
                            : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-hover)]'
                        )}
                      >
                        <span className="w-14 shrink-0" style={{ background: `linear-gradient(160deg, ${theme?.background ?? '#111'} 55%, ${theme?.accent ?? '#34d399'} 55%)` }} aria-hidden="true" />
                        <span className="min-w-0 py-3 pr-3">
                          <span className="flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
                            {preset.name}
                            {i === 0 && <span className="rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-on-accent)]">Best match</span>}
                            {preset.profession === profession && i !== 0 && <span className="rounded-full bg-[var(--color-bg-elevated-2)] px-2 py-0.5 text-[10px] text-[var(--color-text-muted)]">Made for you</span>}
                          </span>
                          <span className="mt-0.5 line-clamp-2 block text-xs text-[var(--color-text-muted)]">{preset.description}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="lg:sticky lg:top-6 lg:self-start">
                <LivePreview
                  src={previewHref({ template: choice.id, theme: choice.theme })}
                  theme={THEME_PRESETS.find((t) => t.id === choice.theme) ? themeFromPreset(THEME_PRESETS.find((t) => t.id === choice.theme)!) : DEFAULT_THEME}
                  username={user?.username}
                  width={520}
                  className="w-full max-w-[522px]"
                />
                <p className="mt-3 text-sm font-medium text-[var(--color-text)]">{choice.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{choice.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-6">
              <Button variant="ghost" onClick={() => setStep(0)} disabled={busy}>
                <ArrowLeft className="size-4" /> Back
              </Button>
              <div className="flex items-center gap-3">
                <Link to="/admin/build#layouts" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                  Browse all designs
                </Link>
                <Button onClick={() => applyDesign(choice)} isLoading={busy}>
                  Use {choice.name} <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
