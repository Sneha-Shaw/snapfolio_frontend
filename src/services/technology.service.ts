import { api } from './api';
import type { ApiSuccess } from '@/types/api';
import type { Technology, TechCategory } from '@/types/models';

export interface TechnologyInput {
  name: string;
  slug?: string;
  icon?: string;
  category: TechCategory;
  documentationUrl: string;
  enabled: boolean;
  displayOrder: number;
}

export const technologyService = {
  async list(includeDisabled = false) {
    const res = await api.get<ApiSuccess<Technology[]>>('/technologies', {
      params: includeDisabled ? { all: '1' } : undefined,
    });
    return res.data.data;
  },

  async getById(id: string) {
    const res = await api.get<ApiSuccess<Technology>>(`/technologies/${id}`);
    return res.data.data;
  },

  async create(input: TechnologyInput) {
    const res = await api.post<ApiSuccess<Technology>>('/technologies', input);
    return res.data.data;
  },

  async update(id: string, input: Partial<TechnologyInput>) {
    const res = await api.put<ApiSuccess<Technology>>(`/technologies/${id}`, input);
    return res.data.data;
  },

  async remove(id: string) {
    await api.delete(`/technologies/${id}`);
  },
};
