import { LAYOUT_PRESETS, type LayoutPreset } from '@/components/sections/registry';

/** Catch-alls that have no layout of their own — they get the general-purpose designs. */
export const GENERAL_PROFESSIONS = ['Software / tech', 'Something else'];

/** Every profession a layout is built for, plus the catch-alls. */
export const PROFESSIONS = [
  ...Array.from(new Set(LAYOUT_PRESETS.map((p) => p.profession).filter((p): p is string => Boolean(p)))).sort(),
  ...GENERAL_PROFESSIONS,
];

/**
 * Layouts for a profession, best first: the ones built for it, then the
 * polished general-purpose ones (recommended, then modern/premium). Never
 * layouts made for a different trade.
 */
export function designsFor(profession: string | undefined | null): LayoutPreset[] {
  if (!profession) return [];
  const own = LAYOUT_PRESETS.filter((p) => p.profession === profession);
  const general = LAYOUT_PRESETS.filter((p) => !p.profession && !p.concept);
  const rank = (p: LayoutPreset) => (p.recommended ? 0 : p.modern || p.premium ? 1 : 2);
  const generalRanked = [...general].sort((a, b) => rank(a) - rank(b));
  return [...own, ...generalRanked].slice(0, own.length ? 9 : 12);
}
