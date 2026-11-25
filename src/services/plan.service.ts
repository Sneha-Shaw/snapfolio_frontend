import { api } from './api';
import type { ApiSuccess } from '@/types/api';
import type { Plan } from '@/types/models';

export const planService = {
  async list() {
    const res = await api.get<ApiSuccess<Plan[]>>('/plans');
    return res.data.data;
  },
};
