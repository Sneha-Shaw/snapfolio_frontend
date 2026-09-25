import { api } from './api';
import type { ApiSuccess } from '@/types/api';
import type { DashboardStats } from '@/types/models';

export const dashboardService = {
  async getStats() {
    const res = await api.get<ApiSuccess<DashboardStats>>('/dashboard/stats');
    return res.data.data;
  },
};
