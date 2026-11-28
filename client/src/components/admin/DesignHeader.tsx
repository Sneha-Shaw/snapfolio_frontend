import { ExternalLink, Globe, Lock, Share2 } from 'lucide-react';
import { LivePreview } from '@/components/admin/LivePreview';
import { useAuth } from '@/context/AuthContext';
import { openShareDialog } from '@/lib/contentEvents';
import { FONT_OPTIONS, RADIUS_OPTIONS, THEME_PRESETS } from '@/lib/themes';
import { LAYOUT_PRESETS } from '@/components/sections/registry';
import { FOOTER_DESIGNS } from '@/components/site/footers';
import { cn } from '@/utils/cn';
import type { LayoutSection, SiteTemplate, SiteTheme } from '@/types/models';

const chip = 'inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/80 px-2.5 py-1 text-xs text-[var(--color-text-muted)]';
const smallBtn =
  'inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1 text-xs font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-elevated-2)]';

/**
 * The top of Build portfolio: what the design is right now (unsaved changes
 * included) — layout, theme, type, corners, footer — next to a live mini
 * preview of the real page.
 */
export function DesignHeader({
  theme,
  template,
  layout,
  previewLink,
}: {
  theme: SiteTheme;
  template: SiteTemplate;
  layout: LayoutSection[];
  previewLink: string;
}) {
  const { user } = useAuth();
  const preset = LAYOUT_PRESETS.find((p) => p.id === template);
  const themeName = THEME_PRESETS.find((t) => t.id === theme.preset)?.name ?? 'Custom theme';
  const font = FONT_OPTIONS.find((f) => f.id === (theme.font ?? 'sans'));
  const corners = RADIUS_OPTIONS.find((r) => r.id === (theme.radius ?? 'rounded'))?.label;
  const footerId = theme.footer || preset?.footer || 'classic';
  const footer = FOOTER_DESIGNS.find((f) => f.id === footerId)?.name ?? footerId;
  const shown = layout.filter((s) => s.enabled).length;
  const isPublic = Boolean(user?.portfolioPublic);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 140% at 0% 0%, var(--color-accent-soft), transparent 70%), radial-gradient(35% 90% at 100% 100%, var(--color-accent-soft), transparent 70%)',
        }}
      />
      <div className="relative grid items-center gap-6 p-6 lg:grid-cols-[1fr_auto]">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">Your design</p>
          <p className="mt-1 text-xl font-semibold text-[var(--color-text)]">{preset?.name ?? 'Custom layout'}</p>
          <p className="mt-1 line-clamp-2 max-w-xl text-sm text-[var(--color-text-muted)]">
            {preset?.description ?? 'Your own mix of section designs.'}
          </p>

          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Current design">
            <li className={chip} title="Theme">
              <span
                aria-hidden="true"
                className="size-3.5 rounded-full border border-[var(--color-border-hover)]"
                style={{ background: `linear-gradient(135deg, ${theme.background} 50%, ${theme.accent} 50%)` }}
              />
              {themeName}
            </li>
            <li className={chip} title="Font">
              <span style={{ fontFamily: font?.stack }}>Aa</span> {font?.label}
            </li>
            <li className={chip} title="Corners">
              {corners} corners
            </li>
            <li className={chip} title="Footer">
              {footer} footer
            </li>
            <li className={chip} title="Sections">
              {shown} section{shown === 1 ? '' : 's'}
            </li>
          </ul>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                isPublic ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]' : 'bg-[var(--color-bg-elevated-2)] text-[var(--color-text-muted)]'
              )}
            >
              {isPublic ? <Globe className="size-3" /> : <Lock className="size-3" />}
              {isPublic ? 'Public' : 'Private'}
            </span>
            <a href={previewLink} target="_blank" rel="noreferrer" className={smallBtn}>
              <ExternalLink className="size-3" /> Preview
            </a>
            <button type="button" onClick={openShareDialog} className={smallBtn}>
              <Share2 className="size-3" /> Share
            </button>
          </div>
        </div>

        <LivePreview src={previewLink} theme={theme} username={user?.username} className="hidden lg:block" />
      </div>
    </section>
  );
}
