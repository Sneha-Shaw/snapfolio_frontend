import { api } from './api';
import type { ApiSuccess } from '@/types/api';
import type { Experience } from '@/types/models';

export interface ExperienceInput {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  displayOrder: number;
}

export const experienceService = {
  async list() {
    const res = await api.get<ApiSuccess<Experience[]>>('/experience');
    return res.data.data;
  },

  async getById(id: string) {
    const res = await api.get<ApiSuccess<Experience>>(`/experience/${id}`);
    return res.data.data;
  },

  async create(input: ExperienceInput) {
    const res = await api.post<ApiSuccess<Experience>>('/experience', input);
    return res.data.data;
  },

  async update(id: string, input: Partial<ExperienceInput>) {
    const res = await api.put<ApiSuccess<Experience>>(`/experience/${id}`, input);
    return res.data.data;
  },

  async remove(id: string) {
    await api.delete(`/experience/${id}`);
  },
};
