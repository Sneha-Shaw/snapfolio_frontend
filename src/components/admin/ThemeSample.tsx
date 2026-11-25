import { darken, hexToRgba, isLight, lighten, readableOn } from '@/lib/color';
import { FONT_OPTIONS } from '@/lib/themes';
import { cn } from '@/utils/cn';
import type { SiteTheme } from '@/types/models';

/**
 * A small mock page painted in `theme` — the portfolio's colours, font and
 * corners, independent of the admin's own appearance.
 */
export function ThemeSample({ theme, className }: { theme: SiteTheme; className?: string }) {
  const light = isLight(theme.background);
  const text = light ? '#111114' : '#f7f7f8';
  const muted = light ? '#4b5565' : '#a1a1ab';
  const surface = light ? lighten(theme.background, 0.6) : lighten(theme.background, 0.045);
  const border = light ? 'rgba(16, 24, 40, 0.1)' : 'rgba(255, 255, 255, 0.08)';
  const font = FONT_OPTIONS.find((f) => f.id === theme.font)?.stack ?? FONT_OPTIONS[0]!.stack;
  const radius = { sharp: '2px', rounded: '10px', soft: '18px' }[theme.radius ?? 'rounded'];

  return (
    <div
      aria-label="Theme sample"
      className={cn('overflow-hidden rounded-xl border border-[var(--color-border)]', className)}
      style={{ background: theme.background, color: text, fontFamily: font }}
    >
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${border}` }}>
        <span className="text-sm font-semibold">Your name</span>
        <span className="flex gap-4 text-xs" style={{ color: muted }}>
          <span>Work</span>
          <span>About</span>
          <span style={{ color: theme.accent }}>Contact</span>
        </span>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: theme.accent }}>Portfolio</p>
          <p className="mt-2 text-2xl font-semibold leading-tight">I design and build things people enjoy using.</p>
          <p className="mt-2 text-sm" style={{ color: muted }}>A short line about what you do and who you do it for.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1.5 text-xs font-semibold" style={{ background: theme.accent, color: readableOn(theme.accent), borderRadius: radius }}>
              View work
            </span>
            <span className="px-3 py-1.5 text-xs font-semibold" style={{ border: `1px solid ${border}`, borderRadius: radius }}>
              Get in touch
            </span>
          </div>
        </div>
        <div className="p-4" style={{ background: surface, border: `1px solid ${border}`, borderRadius: radius }}>
          <div className="h-16" style={{ background: hexToRgba(theme.accent, light ? 0.18 : 0.14), borderRadius: radius }} />
          <p className="mt-3 text-sm font-medium">Project title</p>
          <p className="mt-1 text-xs" style={{ color: muted }}>Case study · 2026</p>
          <div className="mt-3 h-1.5 w-2/3 rounded-full" style={{ background: light ? darken(theme.background, 0.08) : lighten(theme.background, 0.12) }}>
            <div className="h-full w-1/2 rounded-full" style={{ background: theme.accentStrong }} />
          </div>
        </div>
      </div>
    </div>
  );
}
