import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { profileService } from '@/services/profile.service';
import { DEFAULT_THEME, applyTheme, decodeTheme } from '@/lib/themes';
import type { SiteTheme } from '@/types/models';

interface ThemeContextValue {
  theme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
});

/**
 * Fetches the site's theme once on mount, applies it as CSS custom
 * properties on the document root (see `applyTheme`), and exposes the raw
 * values via context for the handful of components that compute
 * gradients/canvas colors in JS rather than pure CSS.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<SiteTheme>(DEFAULT_THEME);

  useEffect(() => {
    // `?theme=` (from admin preview links) overrides the saved theme for this visit only.
    const preview = decodeTheme(new URLSearchParams(window.location.search).get('theme'));
    if (preview) {
      setThemeState(preview);
      applyTheme(preview);
      return;
    }
    profileService
      .get()
      .then((profile) => {
        if (profile.theme) {
          const next = { ...DEFAULT_THEME, ...profile.theme };
          setThemeState(next);
          applyTheme(next);
        }
      })
      .catch(() => {
        // Keep the CSS defaults already baked into index.css.
      });
  }, []);

  function setTheme(next: SiteTheme) {
    setThemeState(next);
    applyTheme(next);
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
