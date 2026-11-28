import { lazy, Suspense, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import { socialLinkService } from '@/services/socialLink.service';
import { profileService } from '@/services/profile.service';
import { useTheme } from '@/context/ThemeContext';
import { LAYOUT_PRESETS } from '@/components/sections/presets';
import { SectionViewport } from '@/components/sections/SectionViewport';

/**
 * Picks and renders the footer design. Resolution order:
 *
 *   1. `?footer=` — explicit preview override
 *   2. `?template=` — a previewed preset's own footer, so preset previews
 *      show the page exactly as it would look applied
 *   3. the saved theme's footer
 *   4. the saved preset's footer
 *   5. classic
 */
export function Footer({ compact = false }: { compact?: boolean }) {
  const { data: links } = useFetch(() => socialLinkService.list(), []);
  const { data: profile } = useFetch(() => profileService.get(), []);
  const { theme } = useTheme();
  const { search } = useLocation();

  const params = new URLSearchParams(search);
  const previewTemplate = params.get('template');
  const template = previewTemplate || profile?.template || undefined;
  const presetFooter = LAYOUT_PRESETS.find((p) => p.id === template)?.footer;

  const id =
    params.get('footer') ||
    (previewTemplate ? presetFooter : undefined) ||
    theme.footer ||
    presetFooter ||
    'classic';

  const Component = useMemo(() => lazy(async () => {
    const { getFooterDesign } = await import('./footers');
    return { default: getFooterDesign(id).Component };
  }), [id]);
  return (
    /* The nav's "Get in touch" targets #contact; on pages without their own
       contact section, the footer is that target. */
    <div id={compact ? undefined : 'contact'}>
      {compact ? <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border)] px-6 py-6 text-xs text-[var(--color-text-muted)]">
        <p>© {new Date().getFullYear()} {profile?.name || 'Portfolio'}</p>
        <nav aria-label="Social links" className="flex flex-wrap gap-4">
          {(links ?? []).map(link => <a key={link._id} href={link.url} target="_blank" rel="noreferrer" className="hover:text-[var(--color-text)]">{link.label || link.platform}</a>)}
        </nav>
      </footer> : <SectionViewport section="footer">
        <Suspense fallback={null}><Component profile={profile} links={links ?? []} compact={false} template={template} /></Suspense>
      </SectionViewport>}
    </div>
  );
}
