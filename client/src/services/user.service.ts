import { api } from './api';
import type { ApiSuccess } from '@/types/api';
import type { ManagedUser, PlatformSummary } from '@/types/models';

/** Platform management — super admin only. */
export const userService = {
  async list() {
    const res = await api.get<ApiSuccess<ManagedUser[]>>('/users');
    return { items: res.data.data, summary: res.data.meta as unknown as PlatformSummary };
  },

  async setActive(id: string, isActive: boolean) {
    const res = await api.patch<ApiSuccess<{ id: string; isActive: boolean }>>(`/users/${id}`, { isActive });
    return res.data.data;
  },
};
