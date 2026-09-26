import { useLocation } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import { socialLinkService } from '@/services/socialLink.service';
import { profileService } from '@/services/profile.service';
import { useTheme } from '@/context/ThemeContext';
import { LAYOUT_PRESETS } from '@/components/sections/registry';
import { getFooterDesign } from './footers';

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

  const { Component } = getFooterDesign(id);
  return (
    /* The nav's "Get in touch" targets #contact; on pages without their own
       contact section, the footer is that target. */
    <div id={compact ? undefined : 'contact'}>
      <Component profile={profile} links={links ?? []} compact={compact} template={template} />
    </div>
  );
}
