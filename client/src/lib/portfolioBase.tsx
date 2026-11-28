import { createContext, useContext, type ReactNode } from 'react';

/**
 * Where the portfolio being shown lives: the admin preview, or a shared page
 * (/p/:username). Navbar and footer links build on it; the section designs
 * link to plain `/work/…`, which App's redirect resolves against the base
 * remembered here — per tab, so it also survives full page loads.
 */
const KEY = 'portfolio:base';
export const PREVIEW_BASE = '/admin/preview';

export function rememberPortfolioBase(base: string) {
  try {
    sessionStorage.setItem(KEY, base);
  } catch {
    /* blocked storage — /work links fall back to the preview */
  }
}

export function lastPortfolioBase(): string {
  try {
    return sessionStorage.getItem(KEY) ?? PREVIEW_BASE;
  } catch {
    return PREVIEW_BASE;
  }
}

const PortfolioBaseContext = createContext<string>(PREVIEW_BASE);

export function PortfolioBaseProvider({ base, children }: { base: string; children: ReactNode }) {
  return <PortfolioBaseContext.Provider value={base}>{children}</PortfolioBaseContext.Provider>;
}

export function usePortfolioBase() {
  return useContext(PortfolioBaseContext);
}
