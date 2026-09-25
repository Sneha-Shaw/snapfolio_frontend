import type { LayoutSection, SiteSection } from '@/types/models';
import { HERO_VARIANTS } from './hero';
import { ABOUT_VARIANTS } from './about';
import { PROJECTS_VARIANTS } from './projects';
import { EXPERIENCE_VARIANTS } from './experience';
import { EDUCATION_VARIANTS } from './education';
import { SKILLS_VARIANTS } from './skills';
import { SERVICES_VARIANTS } from './services';
import { STATS_VARIANTS } from './stats';
import { TESTIMONIALS_VARIANTS } from './testimonials';
import { GALLERY_VARIANTS } from './gallery';
import { CONTACT_VARIANTS } from './contact';
import { DIVIDER_VARIANTS } from './divider';
import { LAYOUT_PRESETS } from './presets';
import {
  MODERN_ABOUT,
  MODERN_CONTACT,
  MODERN_EXPERIENCE,
  MODERN_HERO,
  MODERN_PROJECTS,
  MODERN_SKILLS,
  MODERN_STATS,
  MODERN_TESTIMONIALS,
} from './modern';
import {
  PREMIUM_ABOUT,
  PREMIUM_CONTACT,
  PREMIUM_HERO,
  PREMIUM_PROJECTS,
  PREMIUM_SERVICES,
  PREMIUM_SKILLS,
  PREMIUM_STATS,
  PREMIUM_TESTIMONIALS,
} from './premium';
import type { SectionVariant } from './shared';

export const SECTIONS: { id: SiteSection; label: string; variants: SectionVariant[] }[] = [
  { id: 'hero', label: 'Hero', variants: [...PREMIUM_HERO, ...MODERN_HERO, ...HERO_VARIANTS] },
  { id: 'about', label: 'About', variants: [...PREMIUM_ABOUT, ...MODERN_ABOUT, ...ABOUT_VARIANTS] },
  { id: 'projects', label: 'Projects', variants: [...PREMIUM_PROJECTS, ...MODERN_PROJECTS, ...PROJECTS_VARIANTS] },
  { id: 'experience', label: 'Experience', variants: [...MODERN_EXPERIENCE, ...EXPERIENCE_VARIANTS] },
  { id: 'education', label: 'Education', variants: EDUCATION_VARIANTS },
  { id: 'skills', label: 'Skills', variants: [...PREMIUM_SKILLS, ...MODERN_SKILLS, ...SKILLS_VARIANTS] },
  { id: 'services', label: 'Services', variants: [...PREMIUM_SERVICES, ...SERVICES_VARIANTS] },
  { id: 'stats', label: 'Stats', variants: [...PREMIUM_STATS, ...MODERN_STATS, ...STATS_VARIANTS] },
  { id: 'testimonials', label: 'Testimonials', variants: [...PREMIUM_TESTIMONIALS, ...MODERN_TESTIMONIALS, ...TESTIMONIALS_VARIANTS] },
  { id: 'gallery', label: 'Gallery', variants: GALLERY_VARIANTS },
  { id: 'contact', label: 'Contact', variants: [...PREMIUM_CONTACT, ...MODERN_CONTACT, ...CONTACT_VARIANTS] },
  { id: 'divider', label: 'Divider', variants: DIVIDER_VARIANTS },
];

export { LAYOUT_PRESETS };
export type { LayoutPreset } from './presets';

export function variantsFor(section: SiteSection): SectionVariant[] {
  return SECTIONS.find((s) => s.id === section)?.variants ?? [];
}

/** Unknown variant ids (e.g. from an older save) fall back to the section's first design. */
export function getVariant(section: SiteSection, variant: string): SectionVariant | undefined {
  const list = variantsFor(section);
  return list.find((v) => v.id === variant) ?? list.find((v) => !v.name.includes('✦') && !v.name.includes('◆')) ?? list[0];
}

export function presetLayout(presetId: string): LayoutSection[] {
  const preset = LAYOUT_PRESETS.find((p) => p.id === presetId) ?? LAYOUT_PRESETS.find((p) => p.id === 'aurora')!;
  return preset.sections.map(([section, variant]) => ({ section, variant, enabled: true }));
}

/** Saved layout, or the named preset's layout when nothing has been customised yet. */
export function resolveLayout(layout: LayoutSection[] | undefined, template: string | undefined): LayoutSection[] {
  return layout && layout.length > 0 ? layout : presetLayout(template ?? 'aurora');
}

/** Compact URL-safe encoding so the admin can preview an unsaved layout in a new tab. */
export function encodeLayout(layout: LayoutSection[]): string {
  return layout
    .filter((s) => s.enabled)
    .map((s) => `${s.section}.${s.variant}`)
    .join(',');
}

export function decodeLayout(value: string): LayoutSection[] {
  const valid = new Set(SECTIONS.map((s) => s.id));
  return value
    .split(',')
    .map((pair) => pair.split('.') as [SiteSection, string])
    .filter(([section, variant]) => valid.has(section) && !!variant)
    .map(([section, variant]) => ({ section, variant, enabled: true }));
}
