import { useEffect, useLayoutEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PageSpinner } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';
import { useTheme } from '@/context/ThemeContext';
import { profileService } from '@/services/profile.service';
import { DEFAULT_THEME, decodeTheme } from '@/lib/themes';

/**
 * Route wrapper for portfolio pages (the preview, concept pages). Paints the
 * signed-in account's saved portfolio theme — or a `?theme=` preview of one,
 * keeping the saved footer — and hands back to the app theme on the way out.
 */
export function PortfolioThemeScope() {
  const { setPortfolioTheme } = useTheme();
  const { search } = useLocation();
  const { data: profile, isLoading } = useFetch(() => profileService.get(), []);

  const preview = new URLSearchParams(search).get('theme');
  const theme = useMemo(() => {
    if (isLoading) return null;
    const saved = { ...DEFAULT_THEME, ...profile?.theme };
    const previewed = decodeTheme(preview);
    return previewed ? { ...previewed, footer: saved.footer } : saved;
  }, [isLoading, profile, preview]);

  useLayoutEffect(() => {
    if (theme) setPortfolioTheme(theme);
  }, [theme, setPortfolioTheme]);
  useEffect(() => () => setPortfolioTheme(null), [setPortfolioTheme]);

  // Hold the page until its theme is known, so it never flashes in the app theme.
  if (!theme) return <PageSpinner />;
  return <Outlet />;
}
