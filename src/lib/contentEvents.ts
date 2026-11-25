import { useEffect, useState } from 'react';

/**
 * A tiny signal between the Personal information sections and the header
 * above them: sections announce "my content changed", the header re-counts.
 */
const EVENT = 'portfolio:content-changed';

export function notifyContentChanged() {
  window.dispatchEvent(new Event(EVENT));
}

/** Increments whenever content changes — use it as a fetch dependency. */
export function useContentVersion(): number {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const bump = () => setVersion((v) => v + 1);
    window.addEventListener(EVENT, bump);
    return () => window.removeEventListener(EVENT, bump);
  }, []);
  return version;
}

/** Ask the top bar to open the Share dialog (e.g. from the completion checklist). */
export const OPEN_SHARE_EVENT = 'portfolio:open-share';
export function openShareDialog() {
  window.dispatchEvent(new Event(OPEN_SHARE_EVENT));
}
