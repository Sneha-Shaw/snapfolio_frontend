import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { AppearanceSettings, STEP_ICONS, type BuildStep } from '@/components/admin/AppearanceSettings';
import { DesignHeader } from '@/components/admin/DesignHeader';
import { IconTile } from '@/components/admin/SettingsSection';
import { Button, PageSpinner } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';
import { useTheme } from '@/context/ThemeContext';
import { useStoredFlag } from '@/hooks/useStoredFlag';
import { profileService } from '@/services/profile.service';
import { DEFAULT_THEME, THEME_PRESETS, encodeTheme } from '@/lib/themes';
import { LAYOUT_PRESETS, resolveLayout } from '@/components/sections/registry';
import { FOOTER_DESIGNS } from '@/components/site/footers';
import { previewHref } from '@/lib/preview';
import { ACTIVE_SECTION_EVENT, BUILD_SECTIONS } from '@/config/adminSections';
import { cn } from '@/utils/cn';
import type { LayoutSection, Profile, SiteTemplate, SiteTheme } from '@/types/models';

interface DesignForm {
  theme: SiteTheme;
  template: SiteTemplate;
  layout: LayoutSection[];
}

function designOf(profile: Profile | null): DesignForm {
  return {
    theme: { ...DEFAULT_THEME, ...profile?.theme },
    template: profile?.template ?? 'aurora',
    layout: resolveLayout(profile?.layout, profile?.template),
  };
}

const STEPS = BUILD_SECTIONS.map((s) => s.id) as BuildStep[];
const isStep = (id: string): id is BuildStep => (STEPS as string[]).includes(id);

/** One-line summary of the current choice in each step, shown under its tab. */
function summarize(step: BuildStep, form: DesignForm): string {
  const preset = LAYOUT_PRESETS.find((p) => p.id === form.template);
  switch (step) {
    case 'layouts':
      return preset?.name ?? 'Custom layout';
    case 'sections': {
      const shown = form.layout.filter((s) => s.enabled).length;
      return `${shown} section${shown === 1 ? '' : 's'}${shown < form.layout.length ? ` · ${form.layout.length - shown} hidden` : ''}`;
    }
    case 'theme':
      return THEME_PRESETS.find((t) => t.id === form.theme.preset)?.name ?? 'Custom theme';
    case 'footer': {
      const id = form.theme.footer || preset?.footer || 'classic';
      return FOOTER_DESIGNS.find((f) => f.id === id)?.name ?? id;
    }
  }
}

/** The portfolio's design, as four steps: starting layout, sections, theme, footer. */
export default function BuildPortfolio() {
  const fetcher = useCallback(() => profileService.get(), []);
  const { data: profile, isLoading } = useFetch(fetcher);

  const [saved, setSaved] = useState<DesignForm>(() => designOf(null));
  const [form, setForm] = useState<DesignForm>(saved);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!profile) return;
    const design = designOf(profile);
    setSaved(design);
    setForm(design);
  }, [profile]);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(saved), [form, saved]);

  // The open step lives in the URL hash, so the sidebar's sub-links (and the
  // back button) pick tabs; the sidebar highlights the open one.
  const location = useLocation();
  const navigate = useNavigate();
  const hash = location.hash.slice(1);
  const step: BuildStep = isStep(hash) ? hash : 'layouts';
  const stepIndex = STEPS.indexOf(step);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const goTo = (next: BuildStep) => {
    navigate({ hash: next }, { replace: true });
    // Bring the new panel's top into view without jumping past the toolbar.
    if (toolbarRef.current && toolbarRef.current.getBoundingClientRect().top <= 0) {
      window.scrollTo({ top: window.scrollY + toolbarRef.current.getBoundingClientRect().top });
    }
  };
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(ACTIVE_SECTION_EVENT, { detail: step }));
  }, [step]);
  useEffect(() => () => void window.dispatchEvent(new CustomEvent(ACTIVE_SECTION_EVENT, { detail: null })), []);

  // Tabs pattern: arrow keys / Home / End move between steps.
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const onTabKey = (e: KeyboardEvent) => {
    // Relative to the focused tab (not necessarily the selected one).
    const focused = (e.target as HTMLElement).id.replace(/^tab-/, '');
    const from = isStep(focused) ? STEPS.indexOf(focused) : stepIndex;
    const keys: Record<string, number> = { ArrowRight: from + 1, ArrowLeft: from - 1, Home: 0, End: STEPS.length - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = STEPS[(keys[e.key]! + STEPS.length) % STEPS.length]!;
    goTo(next);
    tabRefs.current[next]?.focus();
  };

  // Closing the tab with unsaved design changes asks first.
  useEffect(() => {
    if (!isDirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [isDirty]);

  // "Also apply matching theme" — off by default. Off: the admin keeps the global
  // light/dark theme and picking a layout keeps the portfolio theme. On: layouts
  // bring their theme, and the admin wears the portfolio theme being edited
  // (unsaved changes included) while this page is open. Leaving always hands
  // back to the global theme.
  const [matchTheme, setMatchTheme] = useStoredFlag('admin:match-theme', false);
  const { setPortfolioTheme } = useTheme();
  useLayoutEffect(() => {
    setPortfolioTheme(matchTheme && !isLoading ? form.theme : null);
  }, [matchTheme, isLoading, form.theme, setPortfolioTheme]);
  useEffect(() => () => setPortfolioTheme(null), [setPortfolioTheme]);

  const updateTheme = (theme: SiteTheme) => setForm((f) => ({ ...f, theme }));

  const updateLayout = (layout: LayoutSection[], template: SiteTemplate) => {
    setForm((f) => ({ ...f, layout, template }));
  };

  // Remounting the editor on discard also resets its memory of "your own theme".
  const [editorKey, setEditorKey] = useState(0);
  const discard = () => {
    setForm(saved);
    setEditorKey((k) => k + 1);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await profileService.update(form);
      setSaved(form);
      toast.success('Design saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save design');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <PageSpinner />;

  const previewLink = previewHref({ layout: form.layout, template: form.template, theme: encodeTheme(form.theme), footer: form.theme.footer });
  const prevStep = STEPS[stepIndex - 1];
  const nextStep = STEPS[stepIndex + 1];
  const labelOf = (id: BuildStep) => BUILD_SECTIONS.find((s) => s.id === id)!.label;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Build portfolio</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Four steps — each tab shows what you have chosen so far. Preview and save from the bar any time.</p>
      </div>

      <DesignHeader theme={form.theme} template={form.template} layout={form.layout} previewLink={previewLink} />

      {/* Sticky toolbar: steps (doubling as a summary of the design) + preview/save. */}
      <div
        ref={toolbarRef}
        className="sticky top-0 z-20 -mx-6 space-y-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 px-6 pb-3 pt-3 backdrop-blur"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2" role="status">
            <span
              aria-hidden="true"
              className={cn('size-2 rounded-full', isDirty ? 'bg-amber-400' : 'bg-[var(--color-accent)]')}
            />
            <span className="text-sm text-[var(--color-text-muted)]">{isDirty ? 'Unsaved changes' : 'All changes saved'}</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={previewLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-elevated-2)]"
            >
              <ExternalLink className="size-3.5" /> Preview
            </a>
            {isDirty && (
              <Button variant="ghost" size="sm" onClick={discard} disabled={isSubmitting}>
                Discard
              </Button>
            )}
            <Button size="sm" onClick={handleSave} isLoading={isSubmitting} disabled={!isDirty}>
              Save design
            </Button>
          </div>
        </div>

        <div role="tablist" aria-label="Build steps" className="grid grid-cols-2 gap-2 md:grid-cols-4" onKeyDown={onTabKey}>
          {STEPS.map((id, i) => {
            const selected = id === step;
            return (
              <button
                key={id}
                ref={(el) => {
                  tabRefs.current[id] = el;
                }}
                id={`tab-${id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={id}
                tabIndex={selected ? 0 : -1}
                onClick={() => goTo(id)}
                className={cn(
                  'flex min-w-0 items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors',
                  selected
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]'
                    : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-hover)]'
                )}
              >
                <IconTile icon={STEP_ICONS[id].icon} tone={STEP_ICONS[id].tone} />
                <span className="min-w-0">
                  <span className={cn('block text-sm font-medium', selected ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]')}>
                    <span className="mr-1 text-[var(--color-text-faint)]">{i + 1}.</span>
                    {labelOf(id)}
                  </span>
                  <span className="block truncate text-xs text-[var(--color-text-faint)]">{summarize(id, form)}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AppearanceSettings
        key={editorKey}
        step={step}
        theme={form.theme}
        template={form.template}
        layout={form.layout}
        onThemeChange={updateTheme}
        onLayoutChange={updateLayout}
        matchTheme={matchTheme}
        onMatchThemeChange={setMatchTheme}
      />

      {/* Walk-through: back / next between steps. */}
      <nav aria-label="Step navigation" className="flex items-center justify-between gap-3 pb-4">
        {prevStep ? (
          <Button variant="ghost" onClick={() => goTo(prevStep)}>
            <ArrowLeft className="size-4" /> {labelOf(prevStep)}
          </Button>
        ) : (
          <span />
        )}
        {nextStep ? (
          <Button variant="secondary" onClick={() => goTo(nextStep)}>
            Next: {labelOf(nextStep)} <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button onClick={handleSave} isLoading={isSubmitting} disabled={!isDirty}>
            {isDirty ? 'Save design' : 'All saved'}
          </Button>
        )}
      </nav>
    </div>
  );
}
