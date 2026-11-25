import { api } from './api';
import type { ApiSuccess } from '@/types/api';
import type { AdminUser } from '@/types/models';

export interface SubscribeInput {
  name: string;
  email: string;
  password: string;
  username: string;
  plan: string;
  /** Not needed for the free trial. */
  card?: { number: string; expiry: string; cvc: string };
}

export const authService = {
  async login(email: string, password: string) {
    const res = await api.post<ApiSuccess<AdminUser>>('/auth/login', { email, password });
    return res.data.data;
  },

  /** Simulated checkout — creates the account on `plan` and signs it in. No card is charged. */
  async subscribe(input: SubscribeInput) {
    const res = await api.post<ApiSuccess<AdminUser>>('/auth/subscribe', input);
    return res.data.data;
  },

  async logout() {
    await api.post('/auth/logout');
  },

  async me() {
    const res = await api.get<ApiSuccess<AdminUser>>('/auth/me');
    return res.data.data;
  },
};
