import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { PREVIEW_BASE, PortfolioBaseProvider, rememberPortfolioBase } from '@/lib/portfolioBase';

/** Route wrapper for the admin preview: its links stay under /admin/preview. */
export function PreviewBase() {
  useEffect(() => rememberPortfolioBase(PREVIEW_BASE), []);
  return (
    <PortfolioBaseProvider base={PREVIEW_BASE}>
      <Outlet />
    </PortfolioBaseProvider>
  );
}
