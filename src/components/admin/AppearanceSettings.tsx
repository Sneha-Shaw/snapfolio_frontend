import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Check, ChevronDown, ExternalLink, Plus, RotateCcw, Star, Trash2 } from 'lucide-react';
import { ThemeColorField } from '@/components/admin/ThemeColorField';
import { Card, Switch } from '@/components/ui';
import { isLight } from '@/lib/color';
import { DEFAULT_THEME, FONT_OPTIONS, RADIUS_OPTIONS, THEME_PRESETS, encodeTheme, themeFromPreset, type ThemePreset } from '@/lib/themes';
import { LAYOUT_PRESETS, SECTIONS, encodeLayout, getVariant, presetLayout, variantsFor, type LayoutPreset } from '@/components/sections/registry';
import { cn } from '@/utils/cn';
import type { LayoutSection, SiteSection, SiteTemplate, SiteTheme } from '@/types/models';

interface AppearanceSettingsProps {
  theme: SiteTheme;
  template: SiteTemplate;
  layout: LayoutSection[];
  onThemeChange: (theme: SiteTheme) => void;
  onLayoutChange: (layout: LayoutSection[], template: SiteTemplate) => void;
}


// ---------------------------------------------------------------------------
// Layout presets ("templates")
// ---------------------------------------------------------------------------

function PresetCard({
  preset,
  active,
  onApply,
  previewTheme,
}: {
  preset: LayoutPreset;
  active: boolean;
  onApply: () => void;
  /** Encoded theme for the preview link — the preset's own, or the current one. */
  previewTheme: string;
}) {
  const theme = THEME_PRESETS.find((t) => t.id === preset.theme);
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border transition-all',
        active ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/30' : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
      )}
    >
      <button type="button" onClick={onApply} className="flex flex-1 flex-col text-left">
        <div className="relative h-20 overflow-hidden p-3" style={{ background: theme?.background }}>
          <div className="absolute -right-4 -top-6 size-20 rounded-full opacity-60 blur-xl" style={{ background: theme?.accent }} />
          <div className="relative flex h-full flex-col justify-end gap-1">
            {preset.sections.slice(0, 3).map(([section, variant], i) => (
              <span
                key={i}
                className="w-fit rounded px-1.5 py-0.5 font-mono text-[9px]"
                style={{
                  background: i === 0 ? theme?.accent : 'transparent',
                  color: i === 0 ? (isLight(theme?.accent ?? '#000') ? '#111' : '#fff') : isLight(theme?.background ?? '#000') ? '#333' : '#ccc',
                }}
              >
                {section}.{variant}
              </span>
            ))}
          </div>
          {preset.recommended && (
            <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-black">
              <Star className="size-2.5 fill-current" /> Best
            </span>
          )}
        </div>
        <div className="flex-1 p-3">
          <p className="flex items-center justify-between text-sm font-medium text-[var(--color-text)]">
            {preset.name}
            {active && <Check className="size-4 text-[var(--color-accent)]" />}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-faint)]">{preset.description}</p>
        </div>
      </button>
      <a
        href={`/?template=${preset.id}&theme=${previewTheme}`}
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
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
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
          <button type="button" className={cn(iconBtn, 'hover:text-red-400')} onClick={onRemove} aria-label="Remove section">
            <Trash2 className="size-4" />
          </button>
          <span className="ml-2">
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

export function AppearanceSettings({ theme, template, layout, onThemeChange, onLayoutChange }: AppearanceSettingsProps) {
  const [adding, setAdding] = useState(false);

  // "Also apply matching theme" reflects the real state: with a layout preset
  // active it is ON exactly when that preset's theme is the current theme.
  // With a custom layout there is nothing to match, so it is just the
  // preference used the next time a preset is picked.
  const layoutPreset = LAYOUT_PRESETS.find((p) => p.id === template);
  const matchingTheme = layoutPreset ? THEME_PRESETS.find((t) => t.id === layoutPreset.theme) : undefined;
  const themeMatches = !!matchingTheme && theme.preset === matchingTheme.id;
  const [preferMatching, setPreferMatching] = useState(true);
  const withTheme = matchingTheme ? themeMatches : preferMatching;

  // Last theme the admin had that wasn't a preset's matching theme — restored when the toggle is switched off.
  const ownTheme = useRef<SiteTheme | null>(null);
  useEffect(() => {
    if (!themeMatches) ownTheme.current = theme;
  }, [theme, themeMatches]);

  const toggleMatchingTheme = (on: boolean) => {
    setPreferMatching(on);
    if (!matchingTheme) return;
    if (on) {
      onThemeChange(themeFromPreset(matchingTheme));
    } else if (ownTheme.current) {
      onThemeChange(ownTheme.current);
    } else {
      // Nothing to go back to (the page loaded with the matching theme) — fall back to the default look.
      onThemeChange(DEFAULT_THEME.preset !== matchingTheme.id ? DEFAULT_THEME : { ...theme, preset: 'custom' });
    }
  };

  const activePreset = theme.preset ?? 'custom';
  const presetGroups = [
    { label: 'Styles', presets: THEME_PRESETS.filter((p) => p.group === 'style') },
    { label: 'Dark', presets: THEME_PRESETS.filter((p) => !p.group && !isLight(p.background)) },
    { label: 'Light', presets: THEME_PRESETS.filter((p) => !p.group && isLight(p.background)) },
  ];

  const applyLayoutPreset = (preset: LayoutPreset) => {
    onLayoutChange(presetLayout(preset.id), preset.id);
    const matching = THEME_PRESETS.find((t) => t.id === preset.theme);
    if (withTheme && matching) onThemeChange(themeFromPreset(matching));
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

  const tweak = (patch: Partial<SiteTheme>) => onThemeChange({ ...theme, ...patch, preset: 'custom' });

  return (
    <>
      {/* ---- Presets ---- */}
      <Card className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Design presets</h2>
            <p className="mt-1 max-w-xl text-xs text-[var(--color-text-faint)]">
              Ready-made combinations of section designs. Pick one as a starting point, then mix and match below. Presets marked <b>Best</b> are the most polished.
            </p>
          </div>
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <Switch checked={withTheme} onChange={toggleMatchingTheme} label="Also apply matching theme" />
            <span className="text-xs text-[var(--color-text-faint)]">
              {matchingTheme
                ? withTheme
                  ? `Using ${matchingTheme.name}, the theme made for ${layoutPreset?.name}`
                  : `${layoutPreset?.name} is designed for the ${matchingTheme.name} theme — switch on to use it`
                : withTheme
                  ? 'Picking a preset will also switch the theme'
                  : 'Picking a preset keeps your current theme'}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LAYOUT_PRESETS.map((p) => (
            <PresetCard
              key={p.id}
              preset={p}
              active={template === p.id}
              onApply={() => applyLayoutPreset(p)}
              previewTheme={withTheme ? p.theme : encodeTheme(theme)}
            />
          ))}
        </div>
      </Card>

      {/* ---- Section builder ---- */}
      <Card className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-text)]">
              Sections {template === 'custom' && <span className="ml-1 rounded bg-[var(--color-accent-soft)] px-1.5 py-0.5 text-[10px] text-[var(--color-accent)]">Custom</span>}
            </h2>
            <p className="mt-1 max-w-xl text-xs text-[var(--color-text-faint)]">
              Your home page, top to bottom. Click a section to choose its design, use the arrows to reorder, the switch to hide it. You can add the same section twice with different designs.
            </p>
          </div>
          <a
            href={`/?layout=${encodeURIComponent(encodeLayout(layout))}&theme=${encodeTheme(theme)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-elevated-2)]"
          >
            <ExternalLink className="size-3.5" /> Preview this layout
          </a>
        </div>

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

      {/* ---- Theme ---- */}
      <Card className="space-y-5 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Theme</h2>
            <p className="mt-1 text-xs text-[var(--color-text-faint)]">
              {THEME_PRESETS.length} themes. Pick one, then fine-tune colors, font and corners. Changes preview live across the admin; hit Save to publish.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onThemeChange(DEFAULT_THEME)}
            className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated-2)] hover:text-[var(--color-text)]"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </button>
        </div>

        {presetGroups.map((group) => (
          <div key={group.label} className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">{group.label}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {group.presets.map((p) => (
                <PresetSwatch key={p.id} preset={p} active={activePreset === p.id} onClick={() => onThemeChange(themeFromPreset(p))} />
              ))}
            </div>
          </div>
        ))}

        <div className="grid grid-cols-1 gap-4 border-t border-[var(--color-border)] pt-5 sm:grid-cols-3">
          <ThemeColorField label="Accent" hint="Buttons, links, highlights" value={theme.accent} onChange={(v) => tweak({ accent: v })} />
          <ThemeColorField label="Accent (strong)" hint="Hover states" value={theme.accentStrong} onChange={(v) => tweak({ accentStrong: v })} />
          <ThemeColorField label="Background" hint="Light colors switch to a light theme" value={theme.background} onChange={(v) => tweak({ background: v })} />
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
      </Card>
    </>
  );
}
