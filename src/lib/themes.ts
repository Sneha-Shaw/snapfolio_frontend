import { darken, hexToRgba, isLight, lighten, readableOn } from '@/lib/color';
import type { SiteFont, SiteRadius, SiteTheme } from '@/types/models';

export interface ThemePreset extends Required<Omit<SiteTheme, 'preset'>> {
  id: string;
  name: string;
  /** 'style' presets are mood-driven looks (Retro, Modern…); the rest are grouped by light/dark. */
  group?: 'style';
}

/**
 * Curated starting points. Picking one fills every theme field; the admin
 * can still tweak individual colors/font/radius afterwards (the preset id is
 * then cleared to 'custom').
 */
export const THEME_PRESETS: ThemePreset[] = [
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
    root.setProperty('--color-border', 'rgba(0, 0, 0, 0.09)');
    root.setProperty('--color-border-hover', 'rgba(0, 0, 0, 0.18)');
    root.setProperty('--color-text', '#111114');
    root.setProperty('--color-text-muted', '#52525b');
    root.setProperty('--color-text-faint', '#8a8a94');
    root.setProperty('--shadow-card', '0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px -12px rgba(0, 0, 0, 0.12)');
    root.setProperty('--shadow-card-hover', '0 1px 2px rgba(0, 0, 0, 0.05), 0 16px 36px -14px rgba(0, 0, 0, 0.18)');
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
