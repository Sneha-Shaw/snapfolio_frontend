import { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';

interface SiteLayoutContext {
  /** Pages that render their own contact section collapse the footer to its bottom bar. */
  setCompactFooter: (compact: boolean) => void;
}

export function SiteLayout() {
  const [compactFooter, setCompactFooter] = useState(false);
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet context={{ setCompactFooter } satisfies SiteLayoutContext} />
      </main>
      <Footer compact={compactFooter} />
    </div>
  );
}

export function useSiteLayout() {
  return useOutletContext<SiteLayoutContext | undefined>();
}
