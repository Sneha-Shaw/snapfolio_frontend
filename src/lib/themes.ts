import { darken, hexToRgba, isLight, lighten, readableOn } from '@/lib/color';
import type { SiteFont, SiteRadius, SiteTemplate, SiteTheme } from '@/types/models';

export interface ThemePreset extends Required<Omit<SiteTheme, 'preset'>> {
  id: string;
  name: string;
}

/**
 * Curated starting points. Picking one fills every theme field; the admin
 * can still tweak individual colors/font/radius afterwards (the preset id is
 * then cleared to 'custom').
 */
export const THEME_PRESETS: ThemePreset[] = [
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

export const TEMPLATE_OPTIONS: { id: SiteTemplate; name: string; description: string }[] = [
  { id: 'aurora', name: 'Aurora', description: 'Animated hero, spotlight effects, 3D cards and a journey timeline.' },
  { id: 'minimal', name: 'Minimal', description: 'Editorial single column — big type, list-style work, lots of whitespace.' },
  { id: 'bento', name: 'Bento', description: 'Everything on one screen as a grid of tiles. Dense and scannable.' },
  { id: 'terminal', name: 'Terminal', description: 'A developer shell — commands, output and a blinking cursor.' },
];

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

  const font = FONT_OPTIONS.find((f) => f.id === theme.font) ?? FONT_OPTIONS[0];
  root.setProperty('--font-sans', font.stack);

  const scale = RADIUS_SCALE[theme.radius ?? 'rounded'];
  for (const [key, rem] of Object.entries(BASE_RADII)) {
    root.setProperty(`--radius-${key}`, `${+(rem * scale).toFixed(3)}rem`);
  }

  document.documentElement.style.colorScheme = light ? 'light' : 'dark';
  document.documentElement.dataset.themeMode = light ? 'light' : 'dark';
}
