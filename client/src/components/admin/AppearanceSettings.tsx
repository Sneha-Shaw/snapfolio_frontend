import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUp, Check, ChevronDown, ExternalLink, LayoutTemplate, Palette, PanelBottom, Plus, RotateCcw, Rows3, Search, Star, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { designsFor } from '@/lib/professions';
import { ThemeColorField } from '@/components/admin/ThemeColorField';
import { Card, Switch } from '@/components/ui';
import { isLight } from '@/lib/color';
import { DEFAULT_THEME, FONT_OPTIONS, RADIUS_OPTIONS, THEME_PRESETS, encodeTheme, themeFromPreset, type ThemePreset } from '@/lib/themes';
import { LAYOUT_PRESETS, SECTIONS, getVariant, presetLayout, variantsFor, type LayoutPreset } from '@/components/sections/registry';
import { FOOTER_DESIGNS } from '@/components/site/footers';
import { MOTIF_KITS } from '@/components/sections/kits';
import { cn } from '@/utils/cn';
import { previewHref } from '@/lib/preview';
import { ThemeSample } from '@/components/admin/ThemeSample';
import { IconTile, type Icon, type SectionTone } from '@/components/admin/SettingsSection';
import type { LayoutSection, SiteSection, SiteTemplate, SiteTheme } from '@/types/models';

function themeLabel(theme: SiteTheme): string {
  return THEME_PRESETS.find((t) => t.id === theme.preset)?.name ?? 'your custom theme';
}

/** Same look, ignoring the footer (which isn't part of the colour theme). */
function sameColours(a: SiteTheme, b: SiteTheme): boolean {
  return a.accent === b.accent && a.accentStrong === b.accentStrong && a.background === b.background && a.font === b.font && a.radius === b.radius;
}

const FAVOURITES_KEY = 'admin:preset-favourites';

function readFavourites(): string[] {
  try {
    const raw = localStorage.getItem(FAVOURITES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

/** Starred presets, remembered per browser. */
function useFavourites() {
  const [favourites, setFavourites] = useState<string[]>(readFavourites);

  useEffect(() => {
    try {
      localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
    } catch {
      /* blocked storage — starring still works for this session */
    }
  }, [favourites]);

  const toggle = (id: string) =>
    setFavourites((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

  return { favourites, toggle };
}


export type BuildStep = 'layouts' | 'sections' | 'theme' | 'footer';

interface AppearanceSettingsProps {
  theme: SiteTheme;
  template: SiteTemplate;
  layout: LayoutSection[];
  onThemeChange: (theme: SiteTheme) => void;
  onLayoutChange: (layout: LayoutSection[], template: SiteTemplate) => void;
  /** Which step's panel to show (the page renders them as tabs). */
  step: BuildStep;
  /** "Also apply matching theme" — owned by the page, which also uses it to decide the admin's look. */
  matchTheme: boolean;
  onMatchThemeChange: (on: boolean) => void;
}

/** Icon and colour of each build step — shared with the step tabs. */
export const STEP_ICONS: Record<BuildStep, { icon: Icon; tone: SectionTone }> = {
  layouts: { icon: LayoutTemplate, tone: 'violet' },
  sections: { icon: Rows3, tone: 'amber' },
  theme: { icon: Palette, tone: 'pink' },
  footer: { icon: PanelBottom, tone: 'teal' },
};

function SectionHeader({ id, title, description, badge, children }: { id: BuildStep; title: string; description: React.ReactNode; badge?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex min-w-0 flex-1 basis-80 items-start gap-3">
        <IconTile icon={STEP_ICONS[id].icon} tone={STEP_ICONS[id].tone} />
        <div className="min-w-0">
          <h2 id={`${id}-title`} className="flex items-center gap-2 text-base font-semibold text-[var(--color-text)]">
            {title} {badge}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--color-text-muted)]">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

/** Pill filters with counts — one active at a time. */
function FilterChips<T extends string>({ options, value, onChange, label }: { options: { id: T; label: string; count: number }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
            value === o.id
              ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
              : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text)]'
          )}
        >
          {o.label} <span className="tabular-nums opacity-70">{o.count}</span>
        </button>
      ))}
    </div>
  );
}

function ShowMore({ shown, total, onClick }: { shown: number; total: number; onClick: () => void }) {
  if (shown >= total) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-dashed border-[var(--color-border-hover)] py-2.5 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
    >
      Show all {total} <span className="text-[var(--color-text-faint)]">({total - shown} more)</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Layout presets ("templates")
// ---------------------------------------------------------------------------

function PresetCard({
  preset,
  active,
  onApply,
  previewTheme,
  favourite,
  onToggleFavourite,
}: {
  preset: LayoutPreset;
  favourite: boolean;
  onToggleFavourite: () => void;
  active: boolean;
  onApply: () => void;
  /** Encoded theme for the preview link — the preset's own, or the current one. */
  previewTheme: string;
}) {
  // Human-readable names of the first few sections ("Hero · Beam grid ✦"), not raw ids.
  const sample = preset.sections.slice(0, 3).map(([section, variant]) => ({
    section: SECTIONS.find((s) => s.id === section)?.label ?? section,
    design: getVariant(section, variant)?.name ?? variant,
  }));
  const theme = THEME_PRESETS.find((t) => t.id === preset.theme);
  return (
    <div
      className={cn(
        'relative flex flex-col overflow-hidden rounded-xl border transition-all',
        active ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/30' : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
      )}
    >
      {/* Sibling of the apply button, not a child of it. */}
      <button
        type="button"
        onClick={onToggleFavourite}
        aria-pressed={favourite}
        title={favourite ? 'Remove from favourites' : 'Add to favourites'}
        className={cn(
          'absolute left-2 top-2 z-10 grid size-7 place-items-center rounded-full backdrop-blur transition-colors',
          favourite
            ? 'bg-amber-400 text-black'
            : 'bg-black/35 text-white/70 hover:bg-black/55 hover:text-white'
        )}
      >
        <Star className={cn('size-3.5', favourite && 'fill-current')} />
      </button>

      <button type="button" onClick={onApply} className="flex flex-1 flex-col text-left">
        {/* Top padding keeps the section labels clear of the star (left) and badges (right). */}
        <div className="relative h-28 overflow-hidden px-3 pb-3 pt-11" style={{ background: theme?.background }}>
          <div className="absolute -right-4 -top-6 size-20 rounded-full opacity-60 blur-xl" style={{ background: theme?.accent }} />
          <div className="relative flex h-full flex-col justify-end gap-1">
            {sample.map(({ section, design }, i) => (
              <span
                key={i}
                className="w-fit max-w-full truncate rounded px-1.5 py-0.5 text-[10px]"
                style={{
                  background: i === 0 ? theme?.accent : 'transparent',
                  color: i === 0 ? (isLight(theme?.accent ?? '#000') ? '#111' : '#fff') : isLight(theme?.background ?? '#000') ? '#333' : '#ccc',
                }}
              >
                <span className="font-semibold">{section}</span> · {design}
              </span>
            ))}
          </div>
          <span className="absolute right-2 top-2 flex max-w-[70%] flex-wrap justify-end gap-1">
            {preset.premium && (
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 px-2 py-0.5 text-[10px] font-bold text-black shadow">
                Premium ◆
              </span>
            )}
            {preset.modern && !preset.premium && (
              <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-black">New ✦</span>
            )}
            {preset.recommended && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-black">
                <Star className="size-2.5 fill-current" /> Best
              </span>
            )}
          </span>
        </div>
        <div className="flex-1 p-3">
          <p className="flex items-center justify-between text-sm font-medium text-[var(--color-text)]">
            {preset.name}
            {active && <Check className="size-4 text-[var(--color-accent)]" />}
          </p>
          {(preset.profession || preset.concept) && (
            <p className="mt-1 text-[11px] font-medium text-[var(--color-accent)]">
              {preset.profession ?? preset.concept}
            </p>
          )}
          <p className="mt-1 text-xs text-[var(--color-text-faint)]">{preset.description}</p>
        </div>
      </button>
      <a
        href={previewHref({ template: preset.id, theme: previewTheme })}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 border-t border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated-2)] hover:text-[var(--color-text)]"
      >
        <ExternalLink className="size-3" /> Preview
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section builder
// ---------------------------------------------------------------------------

function SectionRow({
  item,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}: {
  item: LayoutSection;
  index: number;
  total: number;
  onChange: (next: LayoutSection) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const label = SECTIONS.find((s) => s.id === item.section)?.label ?? item.section;
  const current = getVariant(item.section, item.variant);
  const variants = variantsFor(item.section);
  const iconBtn = 'rounded-md p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated-2)] hover:text-[var(--color-text)] disabled:opacity-30 disabled:hover:bg-transparent';

  return (
    <li className={cn('rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] transition-opacity', !item.enabled && 'opacity-55')}>
      <div className="flex items-center gap-3 p-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[var(--color-bg-elevated-2)] font-mono text-xs text-[var(--color-text-faint)]">
          {index + 1}
        </span>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <span className="min-w-0">
            <span className="block text-sm font-medium text-[var(--color-text)]">{label}</span>
            <span className="block truncate text-xs text-[var(--color-accent)]">
              {current?.name} <span className="text-[var(--color-text-faint)]">· {variants.length} designs</span>
            </span>
          </span>
          <ChevronDown className={cn('ml-auto size-4 shrink-0 text-[var(--color-text-faint)] transition-transform', open && 'rotate-180')} />
        </button>
        <div className="flex shrink-0 items-center gap-0.5">
          <button type="button" className={iconBtn} disabled={index === 0} onClick={() => onMove(-1)} aria-label="Move up">
            <ArrowUp className="size-4" />
          </button>
          <button type="button" className={iconBtn} disabled={index === total - 1} onClick={() => onMove(1)} aria-label="Move down">
            <ArrowDown className="size-4" />
          </button>
          <button type="button" className={cn(iconBtn, 'hover:text-red-400')} onClick={onRemove} aria-label={`Remove ${label}`}>
            <Trash2 className="size-4" />
          </button>
          <span className="ml-2" title={item.enabled ? `Hide ${label}` : `Show ${label}`} aria-label={item.enabled ? `Hide ${label}` : `Show ${label}`}>
            <Switch checked={item.enabled} onChange={(enabled) => onChange({ ...item, enabled })} />
          </span>
        </div>
      </div>

      {open && (
        <div className="grid gap-2 border-t border-[var(--color-border)] p-3 sm:grid-cols-2 lg:grid-cols-3">
          {variants.map((v) => {
            const active = v.id === current?.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onChange({ ...item, variant: v.id })}
                className={cn(
                  'rounded-lg border p-3 text-left transition-colors',
                  active
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-elevated)]'
                )}
              >
                <span className="flex items-center justify-between text-sm font-medium text-[var(--color-text)]">
                  {v.name}
                  {active && <Check className="size-3.5 text-[var(--color-accent)]" />}
                </span>
                <span className="mt-0.5 block text-xs text-[var(--color-text-faint)]">{v.description}</span>
              </button>
            );
          })}
        </div>
      )}
    </li>
  );
}

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

function PresetSwatch({ preset, active, onClick }: { preset: ThemePreset; active: boolean; onClick: () => void }) {
  const light = isLight(preset.background);
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-lg border text-left transition-all',
        active ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/30' : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
      )}
    >
      <div className="flex h-14 items-end gap-1 p-2" style={{ background: preset.background }}>
        <span className="h-6 w-3 rounded-sm" style={{ background: preset.accent }} />
        <span className="h-4 w-3 rounded-sm" style={{ background: preset.accentStrong }} />
        <span
          className="ml-auto text-[10px] font-semibold"
          style={{ color: light ? '#111' : '#f7f7f8', fontFamily: FONT_OPTIONS.find((f) => f.id === preset.font)?.stack }}
        >
          Aa
        </span>
      </div>
      <div className="flex items-center justify-between px-2 py-1.5">
        <span className="truncate text-xs font-medium text-[var(--color-text)]">{preset.name}</span>
        {active && <Check className="size-3.5 shrink-0 text-[var(--color-accent)]" />}
      </div>
    </button>
  );
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  renderLabel,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  renderLabel?: (o: { id: T; label: string }) => React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
      <div className="flex flex-wrap gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-1">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={cn(
              'flex-1 whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors',
              value === o.id
                ? 'bg-[var(--color-accent)] text-[var(--color-on-accent)]'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated-2)] hover:text-[var(--color-text)]'
            )}
          >
            {renderLabel ? renderLabel(o) : o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

export function AppearanceSettings({
  theme,
  template,
  layout,
  onThemeChange: setThemeRaw,
  onLayoutChange,
  step,
  matchTheme: withTheme,
  onMatchThemeChange: setWithTheme,
}: AppearanceSettingsProps) {
  // Every theme preset replaces the whole theme object, which would silently
  // drop the footer choice. Carry it across unless the caller sets one.
  const onThemeChange = (next: SiteTheme) => setThemeRaw({ ...next, footer: next.footer ?? theme.footer });
  const [adding, setAdding] = useState(false);

  // "Also apply matching theme" is the user's preference, full stop — it used to
  // be derived from whether the current theme matched, so it flipped itself
  // off after any colour tweak and then silently stopped applying themes.
  // Whether the theme matches *right now* is reported separately below it.
  const layoutPreset = LAYOUT_PRESETS.find((p) => p.id === template);
  const matchingTheme = layoutPreset ? THEME_PRESETS.find((t) => t.id === layoutPreset.theme) : undefined;
  const themeMatches = !!matchingTheme && theme.preset === matchingTheme.id;

  // The user's own theme: the one they loaded with or last picked/tweaked
  // themselves. Themes a layout brings along never overwrite it, so switching
  // the preference off can always go back to it. (It used to be recorded only
  // while the theme didn't match the layout, so it was often empty and "off"
  // did nothing.)
  const ownTheme = useRef<SiteTheme>(theme);
  const chooseTheme = (next: SiteTheme) => {
    ownTheme.current = { ...next, footer: next.footer ?? theme.footer };
    onThemeChange(next);
  };

  // The portfolio theme isn't painted on the admin, so say what changed.
  const announceTheme = (next: SiteTheme) =>
    toast(`Portfolio theme switched to ${themeLabel(next)}`, { id: 'matching-theme', duration: 2500 });

  const applyMatchingTheme = () => {
    if (!matchingTheme) return;
    const next = themeFromPreset(matchingTheme);
    onThemeChange(next);
    announceTheme(next);
  };

  const toggleMatchingTheme = (on: boolean) => {
    setWithTheme(on);
    if (on) {
      if (!themeMatches) applyMatchingTheme();
      return;
    }
    if (!themeMatches) return;
    if (sameColours(ownTheme.current, theme)) {
      toast(`${themeLabel(theme)} is also your own theme — nothing to switch back to`, { id: 'matching-theme', duration: 2500 });
      return;
    }
    onThemeChange(ownTheme.current);
    announceTheme(ownTheme.current);
  };

  const { favourites, toggle: toggleFavourite } = useFavourites();
  const activePreset = theme.preset ?? 'custom';
  const favouriteSet = new Set(favourites);
  const currentTheme = encodeTheme(theme);

  // ---- Layout preset browser: filter + search, a short list until asked for more.
  // Designs for the profession chosen in onboarding come first and are the default view.
  const { user } = useAuth();
  const profession = user?.profession || '';
  const forYou = useMemo(() => designsFor(profession), [profession]);
  const forYouIds = useMemo(() => new Set(forYou.map((p) => p.id)), [forYou]);

  type PresetFilter = 'forYou' | 'all' | 'favourites' | 'profession' | 'concept' | 'style';
  const presetFilters: { id: PresetFilter; label: string; match: (p: LayoutPreset) => boolean }[] = [
    ...(profession ? [{ id: 'forYou' as const, label: `✦ For you · ${profession}`, match: (p: LayoutPreset) => forYouIds.has(p.id) }] : []),
    { id: 'all', label: 'All', match: () => true },
    { id: 'favourites', label: '★ Favourites', match: (p) => favouriteSet.has(p.id) },
    { id: 'profession', label: 'By profession', match: (p) => !!p.profession },
    { id: 'concept', label: 'By concept ✺', match: (p) => !!p.concept },
    { id: 'style', label: 'By style', match: (p) => !p.profession && !p.concept },
  ];
  const [presetFilter, setPresetFilter] = useState<PresetFilter>(profession ? 'forYou' : favourites.length ? 'favourites' : 'all');
  const [presetQuery, setPresetQuery] = useState('');
  const [presetsExpanded, setPresetsExpanded] = useState(false);
  const query = presetQuery.trim().toLowerCase();
  // "For you" keeps its best-match order; the other filters follow the catalogue.
  const filteredPresets = (presetFilter === 'forYou' ? forYou : LAYOUT_PRESETS.filter(presetFilters.find((f) => f.id === presetFilter)!.match)).filter(
    (p) => !query || [p.name, p.description, p.profession, p.concept].some((t) => t?.toLowerCase().includes(query))
  );
  const PRESET_LIMIT = 8;
  const shownPresets = presetsExpanded || query ? filteredPresets : filteredPresets.slice(0, PRESET_LIMIT);
  const choosePresetFilter = (f: PresetFilter) => {
    setPresetFilter(f);
    setPresetsExpanded(false);
  };

  // ---- Theme browser: filter by family, short list until asked for more.
  const themeGroups = [
    { id: 'all', label: 'All', presets: THEME_PRESETS },
    { id: 'premium', label: 'Premium ◆', presets: THEME_PRESETS.filter((p) => p.group === 'premium') },
    { id: 'modern', label: 'Modern ✦', presets: THEME_PRESETS.filter((p) => p.group === 'modern') },
    { id: 'profession', label: 'Professions', presets: THEME_PRESETS.filter((p) => p.group === 'profession') },
    { id: 'concept', label: 'Concepts ✺', presets: THEME_PRESETS.filter((p) => p.group === 'concept') },
    { id: 'style', label: 'Styles', presets: THEME_PRESETS.filter((p) => p.group === 'style') },
    { id: 'dark', label: 'Dark', presets: THEME_PRESETS.filter((p) => !p.group && !isLight(p.background)) },
    { id: 'light', label: 'Light', presets: THEME_PRESETS.filter((p) => !p.group && isLight(p.background)) },
  ].filter((g) => g.presets.length > 0);
  const [themeGroup, setThemeGroup] = useState('all');
  const [themesExpanded, setThemesExpanded] = useState(false);
  const groupThemes = themeGroups.find((g) => g.id === themeGroup)?.presets ?? THEME_PRESETS;
  const THEME_LIMIT = 15;
  const shownThemes = themesExpanded ? groupThemes : groupThemes.slice(0, THEME_LIMIT);

  const applyLayoutPreset = (preset: LayoutPreset) => {
    if (template === preset.id) return;
    const previous = { layout, template, theme };
    onLayoutChange(presetLayout(preset.id), preset.id);
    const matching = THEME_PRESETS.find((t) => t.id === preset.theme);
    // A preset's footer is part of its design, so it comes along either way.
    const footer = preset.footer ?? theme.footer;
    if (withTheme && matching) setThemeRaw({ ...themeFromPreset(matching), footer });
    else if (footer !== theme.footer) setThemeRaw({ ...theme, footer });

    // Applying replaces the whole section list — offer a way back, especially from a hand-built layout.
    toast(
      (t) => (
        <span className="flex items-center gap-3 text-sm">
          <span>
            Applied <b>{preset.name}</b>
            {previous.template === 'custom' && ' — your custom layout was replaced'}
          </span>
          <button
            type="button"
            className="rounded-md bg-[var(--color-accent)] px-2 py-1 text-xs font-semibold text-[var(--color-on-accent)]"
            onClick={() => {
              onLayoutChange(previous.layout, previous.template);
              setThemeRaw(previous.theme);
              toast.dismiss(t.id);
            }}
          >
            Undo
          </button>
        </span>
      ),
      { id: 'preset-applied', duration: 6000 }
    );
  };

  // Any hand edit to the section list makes the layout 'custom'.
  const editLayout = (next: LayoutSection[]) => onLayoutChange(next, 'custom');
  const updateAt = (i: number, next: LayoutSection) => editLayout(layout.map((s, j) => (j === i ? next : s)));
  const move = (i: number, dir: -1 | 1) => {
    const next = [...layout];
    const [item] = next.splice(i, 1);
    if (item) next.splice(i + dir, 0, item);
    editLayout(next);
  };
  const remove = (i: number) => editLayout(layout.filter((_, j) => j !== i));
  const add = (section: SiteSection) => {
    editLayout([...layout, { section, variant: variantsFor(section)[0]?.id ?? '', enabled: true }]);
    setAdding(false);
  };

  const tweak = (patch: Partial<SiteTheme>) => chooseTheme({ ...theme, ...patch, preset: 'custom' });

  // Motif builds the footer from a concept kit's material; without one it renders as Spotlight.
  const hasMotifKit = MOTIF_KITS.some((k) => k.id === template);
  const presetFooter = layoutPreset?.footer;

  return (
    <>
      {/* ---- Starting layout ---- */}
      {step === 'layouts' && (
        <Card id="layouts" role="tabpanel" aria-labelledby="tab-layouts" className="space-y-4 p-5 rounded-2xl shadow-[var(--shadow-card)]">
          <SectionHeader
            id="layouts"
            title="Starting layout"
            description={
              <>
                {LAYOUT_PRESETS.length} ready-made pages. Pick one as a starting point, then fine-tune its sections below. <b>Best</b> marks the most polished; star any card to keep it in Favourites.
              </>
            }
          >
            {/* Fixed width and height: the theme name and status text change length
                as the switch flips, and must not resize the block or reflow the header. */}
            <div className="flex w-full shrink-0 flex-col gap-1.5 sm:w-80">
              <div className="flex items-center justify-between gap-3">
                <span className="flex w-28 min-w-0 items-center gap-1.5 text-xs text-[var(--color-text-muted)]" title={`Current portfolio theme: ${themeLabel(theme)}`}>
                  <span
                    aria-hidden="true"
                    className="size-4 shrink-0 rounded-full border border-[var(--color-border-hover)]"
                    style={{ background: `linear-gradient(135deg, ${theme.background} 50%, ${theme.accent} 50%)` }}
                  />
                  <span className="truncate">{themeLabel(theme)}</span>
                </span>
                <Switch checked={withTheme} onChange={toggleMatchingTheme} label="Also apply matching theme" />
              </div>
              <span className="min-h-12 text-xs text-[var(--color-text-faint)] sm:text-right">
                {withTheme ? 'Picking a layout also switches to the theme made for it.' : 'Picking a layout keeps your current theme.'}
                {matchingTheme && (
                  <>
                    {' '}
                    {themeMatches ? (
                      <>Now using {matchingTheme.name}, made for {layoutPreset?.name}.</>
                    ) : (
                      <>{layoutPreset?.name} was made for {matchingTheme.name}.</>
                    )}
                  </>
                )}
              </span>
            </div>
          </SectionHeader>

          {profession && (
            <p className="-mt-1 text-xs text-[var(--color-text-faint)]">
              Showing designs for <b className="font-medium text-[var(--color-text-muted)]">{profession}</b> first.{' '}
              <Link to="/onboarding" className="text-[var(--color-accent)] hover:underline">
                Change profession
              </Link>
            </p>
          )}
          {!profession && (
            <Link
              to="/onboarding"
              className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)] px-4 py-3 text-sm text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)]"
            >
              <span>
                <b>Tell us what you do</b> — we’ll put the designs made for your profession first.
              </span>
              <ArrowRight className="size-4 shrink-0 text-[var(--color-accent)]" />
            </Link>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <FilterChips
              label="Filter layouts"
              value={presetFilter}
              onChange={choosePresetFilter}
              options={presetFilters.map((f) => ({ id: f.id, label: f.label, count: f.id === 'forYou' ? forYou.length : LAYOUT_PRESETS.filter(f.match).length }))}
            />
            <label className="relative w-full sm:w-56">
              <span className="sr-only">Search layouts</span>
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[var(--color-text-faint)]" />
              <input
                type="search"
                value={presetQuery}
                onChange={(e) => setPresetQuery(e.target.value)}
                placeholder="Search layouts…"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-1.5 pl-8 pr-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)] focus:outline-none"
              />
            </label>
          </div>

          {shownPresets.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[var(--color-border)] py-8 text-center text-sm text-[var(--color-text-muted)]">
              {presetFilter === 'favourites' && !query ? 'No favourites yet — star a layout to keep it here.' : 'No layouts match your search.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {shownPresets.map((p) => (
                <PresetCard
                  key={p.id}
                  preset={p}
                  active={template === p.id}
                  onApply={() => applyLayoutPreset(p)}
                  previewTheme={withTheme ? p.theme : currentTheme}
                  favourite={favouriteSet.has(p.id)}
                  onToggleFavourite={() => toggleFavourite(p.id)}
                />
              ))}
            </div>
          )}
          {!query && <ShowMore shown={shownPresets.length} total={filteredPresets.length} onClick={() => setPresetsExpanded(true)} />}
        </Card>
      )}

      {/* ---- Section builder ---- */}
      {step === 'sections' && (
        <Card id="sections" role="tabpanel" aria-labelledby="tab-sections" className="space-y-4 p-5 rounded-2xl shadow-[var(--shadow-card)]">
          <SectionHeader
            id="sections"
            title="Sections"
            badge={
              template === 'custom' ? (
                <span className="rounded bg-[var(--color-accent-soft)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-accent)]">Custom</span>
              ) : layoutPreset ? (
                <span className="rounded bg-[var(--color-bg-elevated-2)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">From {layoutPreset.name}</span>
              ) : undefined
            }
            description="Your home page, top to bottom. Open a section to choose its design, use the arrows to reorder and the switch to hide it. The same section can appear twice with different designs. Use Preview in the bar above to see the whole page."
          />

          {layout.length === 0 && (
            <p className="rounded-xl border border-dashed border-[var(--color-border)] py-6 text-center text-sm text-[var(--color-text-muted)]">
              No sections yet — pick a starting layout above or add one below.
            </p>
          )}
          <ol className="space-y-2">
            {layout.map((item, i) => (
              <SectionRow
                key={`${item.section}-${i}`}
                item={item}
                index={i}
                total={layout.length}
                onChange={(next) => updateAt(i, next)}
                onMove={(dir) => move(i, dir)}
                onRemove={() => remove(i)}
              />
            ))}
          </ol>

          {adding ? (
            <div className="flex flex-wrap gap-2 rounded-xl border border-dashed border-[var(--color-border-hover)] p-3">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => add(s.id)}
                  className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  {s.label} <span className="text-xs text-[var(--color-text-faint)]">({s.variants.length})</span>
                </button>
              ))}
              <button type="button" onClick={() => setAdding(false)} className="ml-auto px-2 text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)]">
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[var(--color-border-hover)] py-3 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <Plus className="size-4" /> Add section
            </button>
          )}
        </Card>
      )}

      {/* ---- Theme ---- */}
      {step === 'theme' && (
        <Card id="theme" role="tabpanel" aria-labelledby="tab-theme" className="space-y-5 p-5 rounded-2xl shadow-[var(--shadow-card)]">
          <SectionHeader
            id="theme"
            title="Theme"
            description={`${THEME_PRESETS.length} themes for your portfolio. Pick one, then fine-tune colours, font and corners — the sample below shows the result${withTheme ? ', and this page previews it live' : ''}. Save to publish.`}
          >
            <button
              type="button"
              onClick={() => chooseTheme(DEFAULT_THEME)}
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated-2)] hover:text-[var(--color-text)]"
            >
              <RotateCcw className="size-3.5" />
              Reset to default
            </button>
          </SectionHeader>

          <ThemeSample theme={theme} />

          <FilterChips
            label="Filter themes"
            value={themeGroup}
            onChange={(g) => {
              setThemeGroup(g);
              setThemesExpanded(false);
            }}
            options={themeGroups.map((g) => ({ id: g.id, label: g.label, count: g.presets.length }))}
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {shownThemes.map((p) => (
              <PresetSwatch key={p.id} preset={p} active={activePreset === p.id} onClick={() => chooseTheme(themeFromPreset(p))} />
            ))}
          </div>
          <ShowMore shown={shownThemes.length} total={groupThemes.length} onClick={() => setThemesExpanded(true)} />

          <div className="space-y-4 border-t border-[var(--color-border)] pt-5">
            <p className="text-sm font-medium text-[var(--color-text)]">
              Fine-tune {activePreset === 'custom' && <span className="text-xs font-normal text-[var(--color-text-faint)]">· custom theme</span>}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <ThemeColorField label="Accent" hint="Buttons, links, highlights" value={theme.accent} onChange={(v) => tweak({ accent: v })} />
              <ThemeColorField label="Accent (strong)" hint="Hover states" value={theme.accentStrong} onChange={(v) => tweak({ accentStrong: v })} />
              <ThemeColorField label="Background" hint="Light colours switch to a light theme" value={theme.background} onChange={(v) => tweak({ background: v })} />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
              <Segmented
                label="Font"
                options={FONT_OPTIONS}
                value={theme.font ?? 'sans'}
                onChange={(font) => tweak({ font })}
                renderLabel={(o) => <span style={{ fontFamily: FONT_OPTIONS.find((f) => f.id === o.id)?.stack }}>{o.label}</span>}
              />
              <Segmented label="Corners" options={RADIUS_OPTIONS} value={theme.radius ?? 'rounded'} onChange={(radius) => tweak({ radius })} />
            </div>
          </div>
        </Card>
      )}

      {/* ---- Footer ---- */}
      {step === 'footer' && (
        <Card id="footer" role="tabpanel" aria-labelledby="tab-footer" className="space-y-4 p-5 rounded-2xl shadow-[var(--shadow-card)]">
          <SectionHeader
            id="footer"
            title="Footer"
            description={
              theme.footer
                ? 'The closing statement every page shares. You picked one below — it overrides the layout’s own footer.'
                : `The closing statement every page shares. Currently using ${presetFooter ? `${layoutPreset?.name}’s footer (${FOOTER_DESIGNS.find((f) => f.id === presetFooter)?.name ?? presetFooter})` : 'the Classic footer'}; pick one to override it.`
            }
          >
            {theme.footer && (
              <button
                type="button"
                onClick={() => setThemeRaw({ ...theme, footer: '' })}
                className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated-2)] hover:text-[var(--color-text)]"
              >
                <RotateCcw className="size-3.5" /> Use the layout’s footer
              </button>
            )}
          </SectionHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FOOTER_DESIGNS.map((f) => {
              const active = (theme.footer || '') === f.id;
              const motifFallback = f.id === 'motif' && !hasMotifKit;
              return (
                <div
                  key={f.id}
                  className={cn(
                    'flex flex-col rounded-xl border p-3 transition-all',
                    active
                      ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/30'
                      : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                  )}
                >
                  <button type="button" onClick={() => setThemeRaw({ ...theme, footer: f.id })} aria-pressed={active} className="flex-1 text-left">
                    <p className="flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
                      {f.name}
                      {active && <Check className="size-3.5 text-[var(--color-accent)]" />}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">{f.description}</p>
                    {motifFallback && (
                      <p className="mt-2 text-[11px] text-amber-400">Needs a concept layout — with this one it shows as Spotlight.</p>
                    )}
                  </button>
                  <a
                    href={previewHref({ layout, template, theme: currentTheme, footer: f.id })}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs text-[var(--color-text-faint)] hover:text-[var(--color-accent)]"
                  >
                    Preview <ExternalLink className="size-3" />
                  </a>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </>
  );
}
