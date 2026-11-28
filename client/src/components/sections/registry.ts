import {
  HERO_VARIANTS,
  ABOUT_VARIANTS,
  PROJECTS_VARIANTS,
  EXPERIENCE_VARIANTS,
  EDUCATION_VARIANTS,
  SKILLS_VARIANTS,
  SERVICES_VARIANTS,
  STATS_VARIANTS,
  TESTIMONIALS_VARIANTS,
  GALLERY_VARIANTS,
  CONTACT_VARIANTS,
  DIVIDER_VARIANTS,
  MODERN_ABOUT,
  MODERN_CONTACT,
  MODERN_EXPERIENCE,
  MODERN_HERO,
  MODERN_PROJECTS,
  MODERN_SKILLS,
  MODERN_STATS,
  MODERN_TESTIMONIALS,
  PREMIUM_ABOUT,
  PREMIUM_CONTACT,
  PREMIUM_HERO,
  PREMIUM_PROJECTS,
  PREMIUM_SERVICES,
  PREMIUM_SKILLS,
  PREMIUM_STATS,
  PREMIUM_TESTIMONIALS,
  NATURE_ABOUT,
  NATURE_CONTACT,
  NATURE_EDUCATION,
  NATURE_EXPERIENCE,
  NATURE_GALLERY,
  NATURE_HERO,
  NATURE_SKILLS,
  NATURE_STATS,
  OBJECT_ABOUT,
  OBJECT_CONTACT,
  OBJECT_EXPERIENCE,
  OBJECT_GALLERY,
  OBJECT_HERO,
  OBJECT_PROJECTS,
  OBJECT_SKILLS,
  OBJECT_STATS,
  OBJECT_TESTIMONIALS,
  ENV_ABOUT,
  ENV_EXPERIENCE,
  ENV_GALLERY,
  ENV_HERO,
  ENV_PROJECTS,
  ENV_SKILLS,
  ENV_STATS,
  ENV_TESTIMONIALS,
  WEATHER_CONTACT,
  WEATHER_HERO,
  WEATHER_PROJECTS,
  WEATHER_SKILLS,
  WEATHER_STATS,
  MAC_HERO,
  MAC_PROJECTS,
  MAC_SKILLS,
  ANALOG_EXPERIENCE,
  ANALOG_HERO,
  ANALOG_PROJECTS,
  ANALOG_SKILLS,
  MAKER_ABOUT,
  MAKER_HERO,
  MAKER_PROJECTS,
  MAKER_SKILLS,
  MAKER_STATS,
  SCI_EXPERIENCE,
  SCI_HERO,
  SCI_PROJECTS,
  SCI_SKILLS,
  SCI_STATS,
  SIGNATURE_HERO,
  SIGNATURE_ABOUT,
  SIGNATURE_PROJECTS,
  SIGNATURE_EXPERIENCE,
  SIGNATURE_EDUCATION,
  SIGNATURE_SKILLS,
  SIGNATURE_SERVICES,
  SIGNATURE_STATS,
  SIGNATURE_TESTIMONIALS,
  SIGNATURE_GALLERY,
  SIGNATURE_CONTACT,
  SIGNATURE_DIVIDER,
} from './variantCatalog';
import type { LayoutSection, SiteSection } from '@/types/models';

import { LAYOUT_PRESETS } from './presets';

import {
  KIT_ABOUT,
  KIT_CONTACT,
  KIT_EDUCATION,
  KIT_EXPERIENCE,
  KIT_GALLERY,
  KIT_PROJECTS,
  KIT_SERVICES,
  KIT_SKILLS,
  KIT_STATS,
  KIT_TESTIMONIALS,
} from './kits';
import type { SectionVariant } from './shared';
import { conceptVariant } from './conceptScenes';

const CONCEPT_HERO: SectionVariant[] = [
  { id: 'living-tree', name: 'Living tree ✺', description: 'A branching canopy introduces the person behind the work.', Component: conceptVariant('canopy', 'hero') },
  { id: 'flower-opening', name: 'Flower opening ✺', description: 'An introduction inside a flowering garden.', Component: conceptVariant('bloom', 'hero') },
  { id: 'artist-canvas', name: 'Artist canvas ✺', description: 'A hanging canvas opens the exhibition.', Component: conceptVariant('salon', 'hero') },
];

export const SECTIONS: { id: SiteSection; label: string; variants: SectionVariant[] }[] = [
  { id: 'hero', label: 'Hero', variants: [...SIGNATURE_HERO, ...CONCEPT_HERO, ...PREMIUM_HERO, ...MODERN_HERO, ...NATURE_HERO, ...OBJECT_HERO, ...ENV_HERO, ...WEATHER_HERO, ...MAC_HERO, ...ANALOG_HERO, ...MAKER_HERO, ...SCI_HERO, ...HERO_VARIANTS] },
  { id: 'about', label: 'About', variants: [...SIGNATURE_ABOUT, ...PREMIUM_ABOUT, ...MODERN_ABOUT, ...NATURE_ABOUT, ...OBJECT_ABOUT, ...ENV_ABOUT, ...MAKER_ABOUT, ...ABOUT_VARIANTS, ...KIT_ABOUT] },
  { id: 'projects', label: 'Projects', variants: [...SIGNATURE_PROJECTS, ...PREMIUM_PROJECTS, ...MODERN_PROJECTS, ...OBJECT_PROJECTS, ...ENV_PROJECTS, ...WEATHER_PROJECTS, ...MAC_PROJECTS, ...ANALOG_PROJECTS, ...MAKER_PROJECTS, ...SCI_PROJECTS, ...PROJECTS_VARIANTS, ...KIT_PROJECTS] },
  { id: 'experience', label: 'Experience', variants: [...SIGNATURE_EXPERIENCE, ...MODERN_EXPERIENCE, ...NATURE_EXPERIENCE, ...OBJECT_EXPERIENCE, ...ENV_EXPERIENCE, ...ANALOG_EXPERIENCE, ...SCI_EXPERIENCE, ...EXPERIENCE_VARIANTS, ...KIT_EXPERIENCE] },
  { id: 'education', label: 'Education', variants: [...SIGNATURE_EDUCATION, ...NATURE_EDUCATION, ...EDUCATION_VARIANTS, ...KIT_EDUCATION] },
  { id: 'skills', label: 'Skills', variants: [...SIGNATURE_SKILLS, ...PREMIUM_SKILLS, ...MODERN_SKILLS, ...NATURE_SKILLS, ...OBJECT_SKILLS, ...ENV_SKILLS, ...WEATHER_SKILLS, ...MAC_SKILLS, ...ANALOG_SKILLS, ...MAKER_SKILLS, ...SCI_SKILLS, ...SKILLS_VARIANTS, ...KIT_SKILLS] },
  { id: 'services', label: 'Services', variants: [...SIGNATURE_SERVICES, ...PREMIUM_SERVICES, ...SERVICES_VARIANTS, ...KIT_SERVICES] },
  { id: 'stats', label: 'Stats', variants: [...SIGNATURE_STATS, ...PREMIUM_STATS, ...MODERN_STATS, ...NATURE_STATS, ...OBJECT_STATS, ...ENV_STATS, ...WEATHER_STATS, ...MAKER_STATS, ...SCI_STATS, ...STATS_VARIANTS, ...KIT_STATS] },
  { id: 'testimonials', label: 'Testimonials', variants: [...SIGNATURE_TESTIMONIALS, ...PREMIUM_TESTIMONIALS, ...MODERN_TESTIMONIALS, ...OBJECT_TESTIMONIALS, ...ENV_TESTIMONIALS, ...TESTIMONIALS_VARIANTS, ...KIT_TESTIMONIALS] },
  { id: 'gallery', label: 'Gallery', variants: [...SIGNATURE_GALLERY, ...NATURE_GALLERY, ...OBJECT_GALLERY, ...ENV_GALLERY, ...GALLERY_VARIANTS, ...KIT_GALLERY] },
  { id: 'contact', label: 'Contact', variants: [...SIGNATURE_CONTACT, ...PREMIUM_CONTACT, ...MODERN_CONTACT, ...NATURE_CONTACT, ...OBJECT_CONTACT, ...WEATHER_CONTACT, ...CONTACT_VARIANTS, ...KIT_CONTACT] },
  { id: 'divider', label: 'Divider', variants: [...SIGNATURE_DIVIDER, ...DIVIDER_VARIANTS] },
];

export { LAYOUT_PRESETS };
export type { LayoutPreset } from './presets';

export function variantsFor(section: SiteSection): SectionVariant[] {
  return SECTIONS.find((s) => s.id === section)?.variants ?? [];
}

/** Markers for the promoted design families, which are listed before the plain ones. */
const PROMOTED = ['✦', '◆', '✺'];

/** Unknown variant ids (e.g. from an older save) fall back to the section's first plain design. */
export function getVariant(section: SiteSection, variant: string): SectionVariant | undefined {
  const list = variantsFor(section);
  return list.find((v) => v.id === variant) ?? list.find((v) => !PROMOTED.some((mark) => v.name.includes(mark))) ?? list[0];
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
