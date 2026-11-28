import { useState } from 'react';

/** A boolean preference remembered per browser. */
export function useStoredFlag(key: string, fallback: boolean) {
  const [value, setValue] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : raw === '1';
    } catch {
      return fallback;
    }
  });
  const set = (next: boolean) => {
    setValue(next);
    try {
      localStorage.setItem(key, next ? '1' : '0');
    } catch {
      /* blocked storage — lasts for this visit */
    }
  };
  return [value, set] as const;
}
