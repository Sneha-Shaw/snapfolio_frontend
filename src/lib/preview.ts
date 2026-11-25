import { encodeLayout } from '@/components/sections/registry';
import type { LayoutSection } from '@/types/models';

/**
 * Link to the portfolio preview showing exactly the given (unsaved) design.
 * `layout` wins over `template` for the page; `template` still lets the footer
 * resolve a preset's footer / Motif material, and `footer` overrides both.
 */
export function previewHref({ layout, template, theme, footer }: { layout?: LayoutSection[]; template?: string; theme: string; footer?: string }) {
  const params = new URLSearchParams();
  if (layout) params.set('layout', encodeLayout(layout));
  if (template && template !== 'custom') params.set('template', template);
  params.set('theme', theme);
  if (footer) params.set('footer', footer);
  return `/admin/preview?${params.toString()}`;
}
