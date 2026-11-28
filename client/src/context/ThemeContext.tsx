import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import { applyTheme } from '@/lib/themes';
import type { SiteTheme } from '@/types/models';

/** The app's own appearance — admin, login, checkout, landing. */
export type ThemeMode = 'light' | 'dark' | 'system';

/** App chrome palettes. Never a portfolio's theme — that only paints portfolio pages. */
const APP_THEMES: Record<'light' | 'dark', SiteTheme> = {
  dark: { preset: 'app-dark', accent: '#34d399', accentStrong: '#10b981', background: '#08080a', font: 'sans', radius: 'rounded' },
  light: { preset: 'app-light', accent: '#059669', accentStrong: '#047857', background: '#f6f7f9', font: 'sans', radius: 'rounded' },
};

const MODE_KEY = 'app:theme-mode';

function readMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(MODE_KEY);
    return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
  } catch {
    return 'system';
  }
}

function systemPrefersDark() {
  return typeof window === 'undefined' || !window.matchMedia ? true : window.matchMedia('(prefers-color-scheme: dark)').matches;
}

interface ThemeContextValue {
  /** The user's choice from the theme switcher. */
  mode: ThemeMode;
  /** `mode` with "system" resolved. */
  resolvedMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  /**
   * The theme painted right now: the portfolio's on portfolio pages, otherwise
   * the app theme for `resolvedMode`. Components computing colours in JS read this.
   */
  theme: SiteTheme;
  /**
   * Paints a portfolio's theme instead of the app theme while set — used by
   * portfolio pages (PortfolioThemeScope) and Build portfolio. Pass null to hand back.
   */
  setPortfolioTheme: (theme: SiteTheme | null) => void;
  /** True while a portfolio theme is painted, i.e. the mode switcher has no visible effect. */
  portfolioThemeActive: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * The single owner of `applyTheme`. Two inputs, one output: the app mode
 * (switcher, remembered per browser) and, while a portfolio page is open, that
 * portfolio's theme. Nothing else writes the document's theme tokens.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readMode);
  const [prefersDark, setPrefersDark] = useState(systemPrefersDark);
  const [portfolioTheme, setPortfolioTheme] = useState<SiteTheme | null>(null);

  // Follow the OS setting live while in "system" mode.
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!query) return;
    const onChange = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    try {
      localStorage.setItem(MODE_KEY, next);
    } catch {
      /* blocked storage — the choice lasts for this visit */
    }
  }, []);

  const resolvedMode = mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode;
  const theme = portfolioTheme ?? APP_THEMES[resolvedMode];

  // Layout effect so a route change never paints a frame in the wrong theme.
  useLayoutEffect(() => applyTheme(theme), [theme]);

  const portfolioThemeActive = portfolioTheme !== null;
  const value = useMemo(
    () => ({ mode, resolvedMode, setMode, theme, setPortfolioTheme, portfolioThemeActive }),
    [mode, resolvedMode, setMode, theme, portfolioThemeActive]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
