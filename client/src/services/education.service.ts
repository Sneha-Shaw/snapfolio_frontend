import { api } from './api';
import type { ApiSuccess } from '@/types/api';
import type { Education } from '@/types/models';

export interface EducationInput {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string | null;
  description: string;
  displayOrder: number;
}

export const educationService = {
  async list() {
    const res = await api.get<ApiSuccess<Education[]>>('/education');
    return res.data.data;
  },

  async getById(id: string) {
    const res = await api.get<ApiSuccess<Education>>(`/education/${id}`);
    return res.data.data;
  },

  async create(input: EducationInput) {
    const res = await api.post<ApiSuccess<Education>>('/education', input);
    return res.data.data;
  },

  async update(id: string, input: Partial<EducationInput>) {
    const res = await api.put<ApiSuccess<Education>>(`/education/${id}`, input);
    return res.data.data;
  },

  async remove(id: string) {
    await api.delete(`/education/${id}`);
  },
};
