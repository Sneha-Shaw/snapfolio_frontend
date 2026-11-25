import { useEffect, useState } from 'react';
import { accountService } from '@/services/account.service';

/** Mirrors the API: 3–30 lowercase letters, digits and single hyphens, not at either end. */
export const USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){1,28}[a-z0-9]$/;
export const USERNAME_RULES = '3–30 lowercase letters, numbers and single hyphens';

/** What a typed username becomes: lowercase, spaces/underscores → hyphens, other characters dropped. */
export function normalizeUsername(input: string): string {
  return input.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-{2,}/g, '-').slice(0, 30);
}

/** "Sneha Shaw" → "sneha-shaw" — a starting suggestion at signup. */
export function suggestUsername(name: string): string {
  return normalizeUsername(name.normalize('NFKD').replace(/[̀-ͯ]/g, '').trim()).replace(/^-+|-+$/g, '').slice(0, 24);
}

/** The portfolio page itself, on this app's own origin. */
export function portfolioUrl(username: string): string {
  return `${window.location.origin}/p/${username}`;
}

/**
 * The link to hand out: the API's share page, which carries the preview card
 * (name, headline, image) that LinkedIn, WhatsApp, Slack… read, then forwards
 * to the portfolio. `VITE_SHARE_URL` overrides the origin (e.g. when a proxy
 * serves /s from the app's own domain); by default it's the API's origin.
 */
export function shareUrl(username: string): string {
  const origin = import.meta.env.VITE_SHARE_URL ?? new URL(import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api').origin;
  return `${origin.replace(/\/$/, '')}/s/${username}`;
}

export type UsernameStatus = 'idle' | 'invalid' | 'checking' | 'available' | 'taken' | 'error';

/** Live availability as the user types (debounced). `current` — the user's own username — is always fine. */
export function useUsernameStatus(username: string, current?: string): UsernameStatus {
  const [status, setStatus] = useState<UsernameStatus>('idle');
  useEffect(() => {
    if (!username) return setStatus('idle');
    if (!USERNAME_PATTERN.test(username)) return setStatus('invalid');
    if (username === current) return setStatus('available');
    setStatus('checking');
    let cancelled = false;
    const timer = setTimeout(() => {
      accountService
        .usernameAvailable(username)
        .then((ok) => !cancelled && setStatus(ok ? 'available' : 'taken'))
        .catch(() => !cancelled && setStatus('error'));
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [username, current]);
  return status;
}

export const USERNAME_STATUS_TEXT: Record<UsernameStatus, string> = {
  idle: USERNAME_RULES,
  invalid: `Use ${USERNAME_RULES} (not at the start or end)`,
  checking: 'Checking…',
  available: 'Available',
  taken: 'Taken — try another',
  error: 'Couldn’t check right now',
};
