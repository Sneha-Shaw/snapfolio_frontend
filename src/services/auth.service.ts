import { api } from './api';
import type { ApiSuccess } from '@/types/api';
import type { AdminUser } from '@/types/models';

export const authService = {
  async login(email: string, password: string) {
    const res = await api.post<ApiSuccess<AdminUser>>('/auth/login', { email, password });
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
