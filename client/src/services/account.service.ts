import { api } from './api';
import type { ApiSuccess } from '@/types/api';
import type { AdminUser } from '@/types/models';

export const accountService = {
  /** Free to take? Works before signing up; your own username counts as available. */
  async usernameAvailable(username: string) {
    const res = await api.get<ApiSuccess<{ username: string; available: boolean }>>(`/account/username/${encodeURIComponent(username)}`);
    return res.data.data.available;
  },

  /** Simulated checkout for monthly / yearly — from the trial, after it ends, or to switch. */
  async upgrade(input: { plan: 'monthly' | 'yearly'; card: { number: string; expiry: string; cvc: string } }) {
    const res = await api.post<ApiSuccess<AdminUser>>('/account/subscription', input);
    return res.data.data;
  },

  /** Schedule a Monthly ↔ Yearly switch for the next renewal; the current plan clears it. */
  async changePlan(plan: 'monthly' | 'yearly') {
    const res = await api.patch<ApiSuccess<AdminUser>>('/account/subscription', { plan });
    return res.data.data;
  },

  async cancelSubscription() {
    const res = await api.post<ApiSuccess<AdminUser>>('/account/subscription/cancel');
    return res.data.data;
  },

  async resumeSubscription() {
    const res = await api.post<ApiSuccess<AdminUser>>('/account/subscription/resume');
    return res.data.data;
  },

  async setProfession(profession: string) {
    const res = await api.patch<ApiSuccess<AdminUser>>('/account/profession', { profession });
    return res.data.data;
  },

  /** Change the username and/or make the portfolio public or private. */
  async updateSharing(input: { username?: string; portfolioPublic?: boolean }) {
    const res = await api.patch<ApiSuccess<AdminUser>>('/account/sharing', input);
    return res.data.data;
  },
};
