import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { profileService } from '@/services/profile.service';
import { DEFAULT_THEME, applyTheme } from '@/lib/themes';
import type { SiteTemplate, SiteTheme } from '@/types/models';

interface ThemeContextValue {
  theme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
  template: SiteTemplate;
  setTemplate: (template: SiteTemplate) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  template: 'aurora',
  setTemplate: () => {},
});

/**
 * Fetches the site's theme + template once on mount, applies the theme as
 * CSS custom properties on the document root (see `applyTheme`), and
 * exposes both via context — the raw hex values for the handful of
 * components that compute gradients/canvas colors in JS, and the template
 * id so the home page knows which layout to render.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<SiteTheme>(DEFAULT_THEME);
  const [template, setTemplate] = useState<SiteTemplate>('aurora');

  useEffect(() => {
    profileService
      .get()
      .then((profile) => {
        if (profile.theme) {
          const next = { ...DEFAULT_THEME, ...profile.theme };
          setThemeState(next);
          applyTheme(next);
        }
        if (profile.template) setTemplate(profile.template);
      })
      .catch(() => {
        // Keep the CSS defaults already baked into index.css.
      });
  }, []);

  function setTheme(next: SiteTheme) {
    setThemeState(next);
    applyTheme(next);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, template, setTemplate }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
