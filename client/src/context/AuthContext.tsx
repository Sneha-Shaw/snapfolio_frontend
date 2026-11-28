import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService, type SubscribeInput } from '@/services/auth.service';
import { accountService } from '@/services/account.service';
import type { AdminUser } from '@/types/models';

interface AuthContextValue {
  user: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  subscribe: (input: SubscribeInput) => Promise<void>;
  updateSharing: (input: { username?: string; portfolioPublic?: boolean }) => Promise<void>;
  setProfession: (profession: string) => Promise<void>;
  upgrade: (input: Parameters<typeof accountService.upgrade>[0]) => Promise<void>;
  changePlan: (plan: 'monthly' | 'yearly') => Promise<void>;
  cancelSubscription: () => Promise<void>;
  resumeSubscription: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const loggedInUser = await authService.login(email, password);
    setUser(loggedInUser);
  }, []);

  const subscribe = useCallback(async (input: SubscribeInput) => {
    setUser(await authService.subscribe(input));
  }, []);

  const updateSharing = useCallback(async (input: { username?: string; portfolioPublic?: boolean }) => {
    setUser(await accountService.updateSharing(input));
  }, []);

  const setProfession = useCallback(async (profession: string) => {
    setUser(await accountService.setProfession(profession));
  }, []);

  const upgrade = useCallback(async (input: Parameters<typeof accountService.upgrade>[0]) => {
    setUser(await accountService.upgrade(input));
  }, []);

  const changePlan = useCallback(async (plan: 'monthly' | 'yearly') => {
    setUser(await accountService.changePlan(plan));
  }, []);
  const cancelSubscription = useCallback(async () => {
    setUser(await accountService.cancelSubscription());
  }, []);
  const resumeSubscription = useCallback(async () => {
    setUser(await accountService.resumeSubscription());
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, subscribe, updateSharing, setProfession, upgrade, changePlan, cancelSubscription, resumeSubscription, logout }),
    [user, isLoading, login, subscribe, updateSharing, setProfession, upgrade, changePlan, cancelSubscription, resumeSubscription, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
