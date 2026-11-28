import { useEffect, useLayoutEffect, useState } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { PageSpinner } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';
import { setPublicSite } from '@/services/api';
import { profileService } from '@/services/profile.service';
import { PortfolioBaseProvider, rememberPortfolioBase } from '@/lib/portfolioBase';
import { PRODUCT_NAME } from '@/config/product';

/**
 * A shared portfolio: /p/:username. Switches every API read to that
 * account's public portfolio while open, and links within it stay under /p/:username.
 */
export default function PublicPortfolio() {
  const { username = '' } = useParams();
  const site = username.toLowerCase();
  const base = `/p/${site}`;
  const [ready, setReady] = useState(false);

  // Before any child fetches (their effects run after this layout effect).
  useLayoutEffect(() => {
    setPublicSite(site);
    rememberPortfolioBase(base);
    setReady(true);
    return () => setPublicSite(null);
  }, [site, base]);

  if (!ready) return <PageSpinner />;
  return (
    <PortfolioBaseProvider base={base}>
      <PublicGate key={site} />
    </PortfolioBaseProvider>
  );
}

function PublicGate() {
  const { data: profile, error, isLoading } = useFetch(() => profileService.get(), []);

  useEffect(() => {
    if (!profile?.name) return;
    const previous = document.title;
    document.title = `${profile.name}${profile.headline ? ` — ${profile.headline}` : ''}`;
    return () => {
      document.title = previous;
    };
  }, [profile]);

  if (isLoading) return <PageSpinner />;
  if (error || !profile) return <NotPublic />;
  return (
    <>
      <Outlet />
      <a
        href="/"
        className="fixed bottom-3 left-3 z-50 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/90 px-3 py-1 text-[11px] text-[var(--color-text-muted)] backdrop-blur transition-colors hover:text-[var(--color-text)]"
      >
        Made with {PRODUCT_NAME}
      </a>
    </>
  );
}

function NotPublic() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[var(--color-bg)] px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-text-faint)]">404</p>
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">This portfolio isn’t public</h1>
      <p className="max-w-sm text-sm text-[var(--color-text-muted)]">The link may be wrong, or its owner hasn’t shared it yet.</p>
      <Link to="/" className="mt-2 text-sm font-medium text-[var(--color-accent)] hover:underline">
        Make your own with {PRODUCT_NAME}
      </Link>
    </div>
  );
}
