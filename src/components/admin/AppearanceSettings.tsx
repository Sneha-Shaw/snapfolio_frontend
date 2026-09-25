import { Check, ExternalLink, RotateCcw } from 'lucide-react';
import { ThemeColorField } from '@/components/admin/ThemeColorField';
import { Card } from '@/components/ui';
import { isLight } from '@/lib/color';
import { DEFAULT_THEME, FONT_OPTIONS, RADIUS_OPTIONS, TEMPLATE_OPTIONS, THEME_PRESETS, type ThemePreset } from '@/lib/themes';
import { cn } from '@/utils/cn';
import type { SiteTemplate, SiteTheme } from '@/types/models';

interface AppearanceSettingsProps {
  theme: SiteTheme;
  template: SiteTemplate;
  onThemeChange: (theme: SiteTheme) => void;
  onTemplateChange: (template: SiteTemplate) => void;
}

/** Tiny wireframe of each layout so the picker shows shape, not just a name. */
function TemplateThumb({ id }: { id: SiteTemplate }) {
  const bar = 'rounded-sm bg-[var(--color-text-faint)]/40';
  const accent = 'rounded-sm bg-[var(--color-accent)]';
  const box = 'rounded-sm border border-[var(--color-border-hover)]';

  switch (id) {
    case 'aurora':
      return (
        <div className="relative flex h-full flex-col gap-1.5 overflow-hidden p-3">
          <div className="absolute -top-6 left-1/2 size-16 -translate-x-1/2 rounded-full bg-[var(--color-accent)] opacity-30 blur-xl" />
          <div className={cn(accent, 'h-1 w-8')} />
          <div className={cn(bar, 'h-2.5 w-3/4')} />
          <div className={cn(bar, 'h-2.5 w-1/2')} />
          <div className="mt-auto grid grid-cols-3 gap-1">
            <div className={cn(box, 'h-6')} />
            <div className={cn(box, 'h-6')} />
            <div className={cn(box, 'h-6')} />
          </div>
        </div>
      );
    case 'minimal':
      return (
        <div className="flex h-full flex-col gap-1.5 p-3">
          <div className={cn(bar, 'h-3 w-11/12')} />
          <div className={cn(bar, 'h-3 w-2/3')} />
          <div className="mt-auto space-y-1.5">
            {[0, 1, 2].map((n) => (
              <div key={n} className="flex items-center gap-1.5 border-t border-[var(--color-border-hover)] pt-1.5">
                <div className={cn(bar, 'h-1 w-2')} />
                <div className={cn(bar, 'h-1 flex-1')} />
              </div>
            ))}
          </div>
        </div>
      );
    case 'bento':
      return (
        <div className="grid h-full grid-cols-4 grid-rows-3 gap-1 p-2">
          <div className={cn(box, 'col-span-2 row-span-2')} />
          <div className={cn(box, 'row-span-2 bg-[var(--color-text-faint)]/20')} />
          <div className={box} />
          <div className={box} />
          <div className={cn(box, 'col-span-2')} />
          <div className={cn(accent, 'opacity-80')} />
        </div>
      );
    case 'terminal':
      return (
        <div className="flex h-full flex-col p-2">
          <div className="flex gap-0.5 pb-1.5">
            <span className="size-1 rounded-full bg-[#ff5f57]" />
            <span className="size-1 rounded-full bg-[#febc2e]" />
            <span className="size-1 rounded-full bg-[#28c840]" />
          </div>
          <div className="space-y-1 font-mono text-[6px] leading-none">
            <div className="flex gap-1"><span className="text-[var(--color-accent)]">$</span><div className={cn(bar, 'h-1 w-8')} /></div>
            <div className={cn(bar, 'ml-2 h-1 w-3/4')} />
            <div className="flex gap-1"><span className="text-[var(--color-accent)]">$</span><div className={cn(bar, 'h-1 w-10')} /></div>
            <div className={cn(bar, 'ml-2 h-1 w-2/3')} />
            <div className={cn(bar, 'ml-2 h-1 w-1/2')} />
            <div className="flex gap-1"><span className="text-[var(--color-accent)]">$</span><div className={cn(accent, 'h-1.5 w-1')} /></div>
          </div>
        </div>
      );
  }
}

function PresetSwatch({ preset, active, onClick }: { preset: ThemePreset; active: boolean; onClick: () => void }) {
  const light = isLight(preset.background);
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-lg border text-left transition-all',
        active
          ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/30'
          : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
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

export function AppearanceSettings({ theme, template, onThemeChange, onTemplateChange }: AppearanceSettingsProps) {
  const activePreset = theme.preset ?? 'custom';
  const darkPresets = THEME_PRESETS.filter((p) => !isLight(p.background));
  const lightPresets = THEME_PRESETS.filter((p) => isLight(p.background));

  const applyPreset = (preset: ThemePreset) => {
    const { id, name: _name, ...rest } = preset;
    onThemeChange({ ...rest, preset: id });
  };

  // Any manual tweak turns the theme into a custom one.
  const tweak = (patch: Partial<SiteTheme>) => onThemeChange({ ...theme, ...patch, preset: 'custom' });

  return (
    <>
      <Card className="space-y-4 p-5">
        <div>
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Template</h2>
          <p className="mt-1 text-xs text-[var(--color-text-faint)]">
            The layout of your public home page. All your content carries over — switch any time. Use Preview to see a template with your real data before saving.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATE_OPTIONS.map((t) => {
            const active = t.id === template;
            return (
              <div
                key={t.id}
                className={cn(
                  'flex flex-col overflow-hidden rounded-xl border transition-all',
                  active
                    ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/30'
                    : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                )}
              >
                <button type="button" onClick={() => onTemplateChange(t.id)} className="flex flex-1 flex-col text-left">
                  <div className="h-24 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                    <TemplateThumb id={t.id} />
                  </div>
                  <div className="flex-1 p-3">
                    <p className="flex items-center justify-between text-sm font-medium text-[var(--color-text)]">
                      {t.name}
                      {active && <Check className="size-4 text-[var(--color-accent)]" />}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-text-faint)]">{t.description}</p>
                  </div>
                </button>
                <a
                  href={`/?template=${t.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 border-t border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated-2)] hover:text-[var(--color-text)]"
                >
                  <ExternalLink className="size-3" /> Preview
                </a>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="space-y-5 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Design</h2>
            <p className="mt-1 text-xs text-[var(--color-text-faint)]">
              Pick a preset, then fine-tune colors, font and corners. Changes preview live across the admin; hit Save to publish them.
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

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">Dark</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {darkPresets.map((p) => (
              <PresetSwatch key={p.id} preset={p} active={activePreset === p.id} onClick={() => applyPreset(p)} />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">Light</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {lightPresets.map((p) => (
              <PresetSwatch key={p.id} preset={p} active={activePreset === p.id} onClick={() => applyPreset(p)} />
            ))}
          </div>
        </div>

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
