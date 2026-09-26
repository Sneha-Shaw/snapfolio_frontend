import { darken, hexToRgba, isLight, lighten, readableOn } from '@/lib/color';
import type { SiteFont, SiteRadius, SiteTheme } from '@/types/models';

/** Colour/type presets. The footer is a layout concern, so it is not part of one. */
export interface ThemePreset extends Required<Omit<SiteTheme, 'preset' | 'footer'>> {
  id: string;
  name: string;
  /**
   * 'modern' / 'style' presets are mood-driven looks, 'profession' presets are
   * tuned to a specific line of work; the rest are grouped by light/dark.
   */
  group?: 'style' | 'modern' | 'premium' | 'profession' | 'concept';
}

/**
 * Curated starting points. Picking one fills every theme field; the admin
 * can still tweak individual colors/font/radius afterwards (the preset id is
 * then cleared to 'custom').
 */
export const THEME_PRESETS: ThemePreset[] = [
  // Premium
  { id: 'champagne', name: 'Champagne', group: 'premium', accent: '#e8c98f', accentStrong: '#c9a45c', background: '#0c0a08', font: 'serif', radius: 'soft' },
  { id: 'sapphire', name: 'Sapphire', group: 'premium', accent: '#7aa7ff', accentStrong: '#3b6cf6', background: '#030712', font: 'grotesk', radius: 'soft' },
  { id: 'emerald-lux', name: 'Emerald Lux', group: 'premium', accent: '#6ee7b7', accentStrong: '#10b981', background: '#03110c', font: 'grotesk', radius: 'soft' },
  { id: 'rose-gold', name: 'Rosé Gold', group: 'premium', accent: '#f4b4a4', accentStrong: '#e08b7a', background: '#120c0c', font: 'serif', radius: 'soft' },
  { id: 'crimson', name: 'Crimson', group: 'premium', accent: '#ff4d4d', accentStrong: '#e11d48', background: '#0a0708', font: 'grotesk', radius: 'rounded' },
  { id: 'amethyst', name: 'Amethyst', group: 'premium', accent: '#c4b5fd', accentStrong: '#8b5cf6', background: '#07050f', font: 'grotesk', radius: 'soft' },
  { id: 'platinum', name: 'Platinum', group: 'premium', accent: '#18181b', accentStrong: '#52525b', background: '#f4f4f5', font: 'grotesk', radius: 'soft' },
  { id: 'ivory', name: 'Ivory', group: 'premium', accent: '#8a6a3b', accentStrong: '#5c4424', background: '#fbf8f1', font: 'serif', radius: 'rounded' },

  // Mechanism — the analog, maker and science motifs.
  { id: 'horology', name: 'Horology', group: 'concept', accent: '#d8c9a3', accentStrong: '#8f7a4e', background: '#101116', font: 'serif', radius: 'soft' },
  { id: 'shortwave', name: 'Shortwave', group: 'concept', accent: '#f0b458', accentStrong: '#b5651d', background: '#151009', font: 'serif', radius: 'rounded' },
  { id: 'cathode', name: 'Cathode', group: 'concept', accent: '#6fe3a8', accentStrong: '#2f9e6a', background: '#0a0d0b', font: 'mono', radius: 'sharp' },
  { id: 'concert', name: 'Concert', group: 'concept', accent: '#e8c45c', accentStrong: '#a8761f', background: '#0c0a10', font: 'serif', radius: 'soft' },
  { id: 'redline', name: 'Redline', group: 'concept', accent: '#ff5a2d', accentStrong: '#c11a12', background: '#0b0c0f', font: 'grotesk', radius: 'sharp' },
  { id: 'bindery', name: 'Bindery', group: 'concept', accent: '#c9a227', accentStrong: '#6b3a1e', background: '#150f0a', font: 'serif', radius: 'sharp' },
  { id: 'vitals', name: 'Vitals', group: 'concept', accent: '#34e06f', accentStrong: '#12a34c', background: '#050a08', font: 'mono', radius: 'soft' },
  { id: 'reagent', name: 'Reagent', group: 'concept', accent: '#4fd4c4', accentStrong: '#8b5cf6', background: '#071013', font: 'grotesk', radius: 'soft' },
  { id: 'quantum', name: 'Quantum', group: 'concept', accent: '#7cc4ff', accentStrong: '#c084fc', background: '#04060f', font: 'mono', radius: 'soft' },
  { id: 'meadow', name: 'Meadow', group: 'concept', accent: '#e0b64a', accentStrong: '#6f8f3a', background: '#120f08', font: 'serif', radius: 'rounded' },

  // Hardware — the CSS-built machines.
  { id: 'aluminium', name: 'Aluminium', group: 'concept', accent: '#7aa7d9', accentStrong: '#4a6b8f', background: '#0e1013', font: 'sans', radius: 'soft' },

  // Weather station — instrument readouts rather than weather effects.
  { id: 'barometer', name: 'Barometer', group: 'concept', accent: '#5ad1e6', accentStrong: '#f2a33c', background: '#0c141b', font: 'sans', radius: 'soft' },

  // Environment — tuned to the ✺ place motifs.
  { id: 'abyss', name: 'Abyss', group: 'concept', accent: '#38e1d0', accentStrong: '#0b7fa8', background: '#01121c', font: 'grotesk', radius: 'soft' },
  { id: 'woodland', name: 'Woodland', group: 'concept', accent: '#8fbf5a', accentStrong: '#3f6b32', background: '#0a1109', font: 'serif', radius: 'rounded' },
  { id: 'dune', name: 'Dune', group: 'concept', accent: '#f0b955', accentStrong: '#c06e2a', background: '#1a1108', font: 'grotesk', radius: 'soft' },
  { id: 'summit', name: 'Summit', group: 'concept', accent: '#9ec5e8', accentStrong: '#4a7ca8', background: '#0b1219', font: 'sans', radius: 'sharp' },
  { id: 'nebula', name: 'Nebula', group: 'concept', accent: '#b98cff', accentStrong: '#f06bd0', background: '#04030d', font: 'grotesk', radius: 'soft' },
  { id: 'monsoon', name: 'Monsoon', group: 'concept', accent: '#7fb3d5', accentStrong: '#3d6b8f', background: '#0a0e13', font: 'sans', radius: 'rounded' },
  { id: 'magma', name: 'Magma', group: 'concept', accent: '#ff7a33', accentStrong: '#c21807', background: '#0d0705', font: 'grotesk', radius: 'sharp' },
  { id: 'cirrus', name: 'Cirrus', group: 'concept', accent: '#4a9fd8', accentStrong: '#2c6fa8', background: '#f2f8fd', font: 'grotesk', radius: 'soft' },

  // Concept — tuned to the ✺ motif section designs.
  { id: 'arachnid', name: 'Arachnid', group: 'concept', accent: '#ff3131', accentStrong: '#8b0000', background: '#0a0a0c', font: 'grotesk', radius: 'sharp' },
  { id: 'comic', name: 'Comic', group: 'concept', accent: '#ffc400', accentStrong: '#e0102f', background: '#fffcf2', font: 'grotesk', radius: 'sharp' },
  { id: 'canopy', name: 'Canopy', group: 'concept', accent: '#c9a227', accentStrong: '#6b8f3c', background: '#12100a', font: 'serif', radius: 'rounded' },
  { id: 'bloom', name: 'Bloom', group: 'concept', accent: '#ff6fa5', accentStrong: '#b5179e', background: '#fff5f9', font: 'grotesk', radius: 'soft' },
  { id: 'orbital', name: 'Orbital', group: 'concept', accent: '#4cc9f0', accentStrong: '#4361ee', background: '#03050f', font: 'grotesk', radius: 'soft' },
  { id: 'mechanical', name: 'Mechanical', group: 'concept', accent: '#e8e3d5', accentStrong: '#b7ae98', background: '#131416', font: 'sans', radius: 'rounded' },
  { id: 'handset', name: 'Handset', group: 'concept', accent: '#30d158', accentStrong: '#0a84ff', background: '#000000', font: 'sans', radius: 'soft' },
  { id: 'oil', name: 'Oil Paint', group: 'concept', accent: '#d4a437', accentStrong: '#7c4a2d', background: '#14100c', font: 'serif', radius: 'sharp' },

  // Profession — each one tuned to the trust signals and mood its field trades on.
  { id: 'clinical', name: 'Clinical', group: 'profession', accent: '#1d70b8', accentStrong: '#14539a', background: '#f6fafd', font: 'sans', radius: 'soft' },
  { id: 'enamel', name: 'Enamel', group: 'profession', accent: '#14b8a6', accentStrong: '#0d9488', background: '#f4fdfb', font: 'grotesk', radius: 'soft' },
  { id: 'care', name: 'Care', group: 'profession', accent: '#e2657f', accentStrong: '#be4a63', background: '#fbf7f8', font: 'sans', radius: 'soft' },
  { id: 'counsel', name: 'Counsel', group: 'profession', accent: '#cba35c', accentStrong: '#a8822f', background: '#0a1020', font: 'serif', radius: 'sharp' },
  { id: 'ledger', name: 'Ledger', group: 'profession', accent: '#5eba7d', accentStrong: '#2f7a50', background: '#081019', font: 'sans', radius: 'sharp' },
  { id: 'advisory', name: 'Advisory', group: 'profession', accent: '#93a5c4', accentStrong: '#5b7194', background: '#0c1016', font: 'grotesk', radius: 'soft' },
  { id: 'studio-noir', name: 'Studio Noir', group: 'profession', accent: '#ff5c2b', accentStrong: '#e03e0d', background: '#0e0e10', font: 'grotesk', radius: 'sharp' },
  { id: 'aperture', name: 'Aperture', group: 'profession', accent: '#e7dccc', accentStrong: '#b9a68c', background: '#050505', font: 'grotesk', radius: 'sharp' },
  { id: 'cinema', name: 'Cinema', group: 'profession', accent: '#ffb648', accentStrong: '#ff7a18', background: '#000000', font: 'grotesk', radius: 'sharp' },
  { id: 'amplitude', name: 'Amplitude', group: 'profession', accent: '#ff2ea6', accentStrong: '#7b2bff', background: '#07060a', font: 'grotesk', radius: 'rounded' },
  { id: 'blueprint', name: 'Blueprint', group: 'profession', accent: '#2563a8', accentStrong: '#17457c', background: '#eef2f6', font: 'grotesk', radius: 'sharp' },
  { id: 'precision', name: 'Precision', group: 'profession', accent: '#f0a92b', accentStrong: '#b4740f', background: '#14161a', font: 'mono', radius: 'sharp' },
  { id: 'lab', name: 'Laboratory', group: 'profession', accent: '#22d3ee', accentStrong: '#0891b2', background: '#0a1117', font: 'mono', radius: 'sharp' },
  { id: 'culinary', name: 'Culinary', group: 'profession', accent: '#e2a13c', accentStrong: '#b9761c', background: '#140d08', font: 'serif', radius: 'rounded' },
  { id: 'estate', name: 'Estate', group: 'profession', accent: '#cfa349', accentStrong: '#2f4739', background: '#101512', font: 'serif', radius: 'sharp' },
  { id: 'athletic', name: 'Athletic', group: 'profession', accent: '#00e5ff', accentStrong: '#7cff00', background: '#08090b', font: 'grotesk', radius: 'rounded' },
  { id: 'haven', name: 'Haven', group: 'profession', accent: '#6f8f6a', accentStrong: '#4f6b4b', background: '#f7f6f0', font: 'serif', radius: 'soft' },
  { id: 'academy', name: 'Academy', group: 'profession', accent: '#4f46e5', accentStrong: '#3730a3', background: '#fbfaf7', font: 'sans', radius: 'rounded' },
  { id: 'manuscript', name: 'Manuscript', group: 'profession', accent: '#7c2d12', accentStrong: '#451a03', background: '#fbf7ee', font: 'serif', radius: 'sharp' },
  { id: 'amplify', name: 'Amplify', group: 'profession', accent: '#f97316', accentStrong: '#7c3aed', background: '#fdfaff', font: 'grotesk', radius: 'soft' },

  // Modern
  { id: 'indigo-night', name: 'Indigo Night', group: 'modern', accent: '#8b8cf8', accentStrong: '#5e6ad2', background: '#08090a', font: 'grotesk', radius: 'rounded' },
  { id: 'obsidian', name: 'Obsidian', group: 'modern', accent: '#fafafa', accentStrong: '#d4d4d8', background: '#000000', font: 'sans', radius: 'rounded' },
  { id: 'borealis', name: 'Borealis', group: 'modern', accent: '#5eead4', accentStrong: '#a78bfa', background: '#050814', font: 'grotesk', radius: 'soft' },
  { id: 'lime-pop', name: 'Lime Pop', group: 'modern', accent: '#c6f432', accentStrong: '#a3e635', background: '#0a0a0a', font: 'grotesk', radius: 'soft' },
  { id: 'holo', name: 'Holo', group: 'modern', accent: '#f0abfc', accentStrong: '#67e8f9', background: '#0b0b12', font: 'grotesk', radius: 'soft' },
  { id: 'coral-dark', name: 'Coral', group: 'modern', accent: '#ff6b6b', accentStrong: '#ff8e53', background: '#0d0d0f', font: 'sans', radius: 'rounded' },
  { id: 'nova', name: 'Nova', group: 'modern', accent: '#818cf8', accentStrong: '#c084fc', background: '#030014', font: 'grotesk', radius: 'soft' },
  { id: 'ice', name: 'Ice', group: 'modern', accent: '#0ea5e9', accentStrong: '#6366f1', background: '#f8fafc', font: 'grotesk', radius: 'soft' },
  { id: 'mono-light', name: 'Mono Light', group: 'modern', accent: '#111111', accentStrong: '#3f3f46', background: '#ffffff', font: 'sans', radius: 'rounded' },
  { id: 'peach', name: 'Peach', group: 'modern', accent: '#f43f5e', accentStrong: '#f97316', background: '#fff7f2', font: 'grotesk', radius: 'soft' },
  // Styles
  { id: 'retro', name: 'Retro', group: 'style', accent: '#e76f51', accentStrong: '#2a9d8f', background: '#f4ecd8', font: 'mono', radius: 'sharp' },
  { id: 'modern', name: 'Modern', group: 'style', accent: '#6366f1', accentStrong: '#4f46e5', background: '#0a0a0f', font: 'grotesk', radius: 'soft' },
  { id: 'synthwave', name: 'Synthwave', group: 'style', accent: '#ff2a6d', accentStrong: '#05d9e8', background: '#120322', font: 'grotesk', radius: 'sharp' },
  { id: 'cyberpunk', name: 'Cyberpunk', group: 'style', accent: '#fcee0a', accentStrong: '#00f0ff', background: '#0d0d12', font: 'mono', radius: 'sharp' },
  { id: 'vintage', name: 'Vintage', group: 'style', accent: '#8b5e3c', accentStrong: '#6b4226', background: '#efe6d5', font: 'serif', radius: 'rounded' },
  { id: 'brutalist', name: 'Brutalist', group: 'style', accent: '#ff3b00', accentStrong: '#000000', background: '#ffffff', font: 'mono', radius: 'sharp' },
  { id: 'luxury', name: 'Luxury', group: 'style', accent: '#d4af37', accentStrong: '#b8912a', background: '#0b0a08', font: 'serif', radius: 'sharp' },
  { id: 'pastel', name: 'Pastel', group: 'style', accent: '#f472b6', accentStrong: '#a78bfa', background: '#fdf7fb', font: 'grotesk', radius: 'soft' },
  { id: 'ocean', name: 'Ocean', group: 'style', accent: '#2dd4bf', accentStrong: '#0ea5e9', background: '#04141c', font: 'sans', radius: 'soft' },
  { id: 'forest', name: 'Forest', group: 'style', accent: '#84cc16', accentStrong: '#65a30d', background: '#0c130b', font: 'serif', radius: 'rounded' },
  { id: 'coffee', name: 'Coffee', group: 'style', accent: '#d6a36b', accentStrong: '#b7814a', background: '#16100c', font: 'serif', radius: 'rounded' },
  { id: 'monochrome', name: 'Monochrome', group: 'style', accent: '#e5e5e5', accentStrong: '#ffffff', background: '#0a0a0a', font: 'sans', radius: 'sharp' },
  { id: 'newspaper', name: 'Newspaper', group: 'style', accent: '#b91c1c', accentStrong: '#7f1d1d', background: '#f7f5ef', font: 'serif', radius: 'sharp' },
  { id: 'metro', name: 'Metro', group: 'style', accent: '#0078d7', accentStrong: '#005a9e', background: '#1d1d1d', font: 'sans', radius: 'sharp' },
  { id: 'metro-light', name: 'Metro Light', group: 'style', accent: '#0078d7', accentStrong: '#005a9e', background: '#f2f2f2', font: 'sans', radius: 'sharp' },
  { id: 'material', name: 'Material', group: 'style', accent: '#6750a4', accentStrong: '#4f378b', background: '#fffbfe', font: 'sans', radius: 'soft' },
  { id: 'glass', name: 'Glass', group: 'style', accent: '#38bdf8', accentStrong: '#818cf8', background: '#0b1020', font: 'grotesk', radius: 'soft' },
  { id: 'tokyo-night', name: 'Tokyo Night', group: 'style', accent: '#7aa2f7', accentStrong: '#bb9af7', background: '#1a1b26', font: 'mono', radius: 'rounded' },
  { id: 'gruvbox', name: 'Gruvbox', group: 'style', accent: '#fabd2f', accentStrong: '#fe8019', background: '#1d2021', font: 'mono', radius: 'sharp' },
  { id: 'catppuccin', name: 'Catppuccin', group: 'style', accent: '#cba6f7', accentStrong: '#f5c2e7', background: '#1e1e2e', font: 'grotesk', radius: 'soft' },
  { id: 'solarized', name: 'Solarized', group: 'style', accent: '#268bd2', accentStrong: '#2aa198', background: '#fdf6e3', font: 'mono', radius: 'rounded' },
  { id: 'sakura', name: 'Sakura', group: 'style', accent: '#e11d74', accentStrong: '#be185d', background: '#fff5f8', font: 'serif', radius: 'soft' },
  { id: 'arctic', name: 'Arctic', group: 'style', accent: '#0891b2', accentStrong: '#0e7490', background: '#f0f9ff', font: 'grotesk', radius: 'rounded' },
  // Dark
  { id: 'emerald', name: 'Emerald', accent: '#34d399', accentStrong: '#10b981', background: '#08080a', font: 'sans', radius: 'rounded' },
  { id: 'midnight', name: 'Midnight', accent: '#60a5fa', accentStrong: '#3b82f6', background: '#070b14', font: 'sans', radius: 'rounded' },
  { id: 'violet', name: 'Violet Dusk', accent: '#a78bfa', accentStrong: '#8b5cf6', background: '#0b0913', font: 'grotesk', radius: 'soft' },
  { id: 'sunset', name: 'Sunset', accent: '#fb923c', accentStrong: '#f97316', background: '#0f0a08', font: 'grotesk', radius: 'rounded' },
  { id: 'rose', name: 'Rose', accent: '#fb7185', accentStrong: '#f43f5e', background: '#0e080a', font: 'serif', radius: 'soft' },
  { id: 'nord', name: 'Nord', accent: '#88c0d0', accentStrong: '#5e81ac', background: '#1b1f27', font: 'sans', radius: 'rounded' },
  { id: 'dracula', name: 'Dracula', accent: '#ff79c6', accentStrong: '#bd93f9', background: '#1a1b24', font: 'mono', radius: 'rounded' },
  { id: 'matrix', name: 'Matrix', accent: '#22ff88', accentStrong: '#00cc66', background: '#020604', font: 'mono', radius: 'sharp' },
  { id: 'amber', name: 'Amber CRT', accent: '#fbbf24', accentStrong: '#f59e0b', background: '#0c0a05', font: 'mono', radius: 'sharp' },
  // Light
  { id: 'paper', name: 'Paper', accent: '#1f2937', accentStrong: '#000000', background: '#faf8f3', font: 'serif', radius: 'sharp' },
  { id: 'sky', name: 'Sky', accent: '#2563eb', accentStrong: '#1d4ed8', background: '#f5f8ff', font: 'sans', radius: 'rounded' },
  { id: 'terracotta', name: 'Terracotta', accent: '#c2410c', accentStrong: '#9a3412', background: '#fbf5ee', font: 'grotesk', radius: 'soft' },
  { id: 'mint', name: 'Mint', accent: '#059669', accentStrong: '#047857', background: '#f3faf6', font: 'sans', radius: 'soft' },
  { id: 'lavender', name: 'Lavender', accent: '#7c3aed', accentStrong: '#6d28d9', background: '#f8f6ff', font: 'grotesk', radius: 'rounded' },
];

export const DEFAULT_THEME: SiteTheme = {
  preset: 'emerald',
  accent: '#34d399',
  accentStrong: '#10b981',
  background: '#08080a',
  font: 'sans',
  radius: 'rounded',
};

export const FONT_OPTIONS: { id: SiteFont; label: string; stack: string }[] = [
  { id: 'sans', label: 'Inter', stack: "'Inter', ui-sans-serif, system-ui, sans-serif" },
  { id: 'grotesk', label: 'Space Grotesk', stack: "'Space Grotesk', 'Inter', ui-sans-serif, sans-serif" },
  { id: 'serif', label: 'Fraunces', stack: "'Fraunces', ui-serif, Georgia, serif" },
  { id: 'mono', label: 'JetBrains Mono', stack: "'JetBrains Mono', ui-monospace, monospace" },
];

/** Multipliers applied to Tailwind's default radius scale (rem). */
const RADIUS_SCALE: Record<SiteRadius, number> = { sharp: 0.15, rounded: 1, soft: 1.8 };
const BASE_RADII = { sm: 0.25, md: 0.375, lg: 0.5, xl: 0.75, '2xl': 1, '3xl': 1.5 };

export const RADIUS_OPTIONS: { id: SiteRadius; label: string }[] = [
  { id: 'sharp', label: 'Sharp' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'soft', label: 'Soft' },
];

export function themeFromPreset(preset: ThemePreset): SiteTheme {
  const { id, name: _name, group: _group, ...rest } = preset;
  return { ...rest, preset: id };
}

/** URL form of a theme for preview links: a preset id, or `accent.strong.bg.font.radius` (hex without #). */
export function encodeTheme(theme: SiteTheme): string {
  if (theme.preset && theme.preset !== 'custom' && THEME_PRESETS.some((p) => p.id === theme.preset)) return theme.preset;
  return [theme.accent, theme.accentStrong, theme.background].map((c) => c.replace('#', '')).concat(theme.font ?? 'sans', theme.radius ?? 'rounded').join('.');
}

export function decodeTheme(value: string | null): SiteTheme | null {
  if (!value) return null;
  const preset = THEME_PRESETS.find((p) => p.id === value);
  if (preset) return themeFromPreset(preset);
  const [accent, accentStrong, background, font, radius] = value.split('.');
  const hex = /^[0-9a-fA-F]{6}$/;
  if (!accent || !accentStrong || !background || ![accent, accentStrong, background].every((c) => hex.test(c))) return null;
  return {
    preset: 'custom',
    accent: `#${accent}`,
    accentStrong: `#${accentStrong}`,
    background: `#${background}`,
    font: FONT_OPTIONS.some((f) => f.id === font) ? (font as SiteTheme['font']) : 'sans',
    radius: RADIUS_OPTIONS.some((r) => r.id === radius) ? (radius as SiteTheme['radius']) : 'rounded',
  };
}

/**
 * Writes every derived CSS custom property to the document root, so all
 * `var(--color-*)`, `rounded-*` and `font-sans` usages restyle at once.
 * Light backgrounds flip the text/border/shadow tokens so light presets
 * stay readable.
 */
export function applyTheme(theme: SiteTheme) {
  const root = document.documentElement.style;
  const light = isLight(theme.background);

  root.setProperty('--color-accent', theme.accent);
  root.setProperty('--color-accent-strong', theme.accentStrong);
  root.setProperty('--color-accent-soft', hexToRgba(theme.accent, light ? 0.12 : 0.1));
  root.setProperty('--color-on-accent', readableOn(theme.accent));
  root.setProperty('--color-on-accent-strong', readableOn(theme.accentStrong));
  root.setProperty('--color-bg', theme.background);

  if (light) {
    root.setProperty('--color-bg-elevated', lighten(theme.background, 0.6));
    root.setProperty('--color-bg-elevated-2', darken(theme.background, 0.04));
    root.setProperty('--color-border', 'rgba(16, 24, 40, 0.1)');
    root.setProperty('--color-border-hover', 'rgba(16, 24, 40, 0.2)');
    root.setProperty('--color-text', '#111114');
    root.setProperty('--color-text-muted', '#4b5565');
    root.setProperty('--color-text-faint', '#79828f');
    root.setProperty('--shadow-card', '0 1px 2px -1px rgba(16, 24, 40, 0.08), 0 8px 24px -12px rgba(16, 24, 40, 0.14)');
    root.setProperty('--shadow-card-hover', '0 2px 4px -1px rgba(16, 24, 40, 0.1), 0 16px 40px -16px rgba(16, 24, 40, 0.2)');
  } else {
    root.setProperty('--color-bg-elevated', lighten(theme.background, 0.045));
    root.setProperty('--color-bg-elevated-2', lighten(theme.background, 0.09));
    root.setProperty('--color-border', 'rgba(255, 255, 255, 0.08)');
    root.setProperty('--color-border-hover', 'rgba(255, 255, 255, 0.16)');
    root.setProperty('--color-text', '#f7f7f8');
    root.setProperty('--color-text-muted', '#a1a1ab');
    root.setProperty('--color-text-faint', '#6b6b76');
    root.setProperty('--shadow-card', '0 1px 0 0 rgba(255, 255, 255, 0.04) inset, 0 12px 32px -12px rgba(0, 0, 0, 0.55)');
    root.setProperty('--shadow-card-hover', '0 1px 0 0 rgba(255, 255, 255, 0.06) inset, 0 20px 48px -16px rgba(0, 0, 0, 0.65)');
  }

  root.setProperty(
    '--shadow-glow',
    `0 0 0 1px ${hexToRgba(theme.accent, 0.25)}, 0 8px 28px -8px ${hexToRgba(theme.accent, 0.45)}`
  );

  const font = FONT_OPTIONS.find((f) => f.id === theme.font) ?? FONT_OPTIONS[0]!;
  root.setProperty('--font-sans', font.stack);

  const scale = RADIUS_SCALE[theme.radius ?? 'rounded'];
  for (const [key, rem] of Object.entries(BASE_RADII)) {
    root.setProperty(`--radius-${key}`, `${+(rem * scale).toFixed(3)}rem`);
  }

  document.documentElement.style.colorScheme = light ? 'light' : 'dark';
  document.documentElement.dataset.themeMode = light ? 'light' : 'dark';
}
