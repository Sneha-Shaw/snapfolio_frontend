import { api } from './api';
import type { ApiSuccess } from '@/types/api';
import type { SocialLink, SocialPlatform } from '@/types/models';

export interface SocialLinkInput {
  platform: SocialPlatform;
  label: string;
  url: string;
  icon: string;
  displayOrder: number;
  enabled: boolean;
}

export const socialLinkService = {
  async list(includeDisabled = false) {
    const res = await api.get<ApiSuccess<SocialLink[]>>('/social-links', {
      params: includeDisabled ? { all: '1' } : undefined,
    });
    return res.data.data;
  },

  async create(input: SocialLinkInput) {
    const res = await api.post<ApiSuccess<SocialLink>>('/social-links', input);
    return res.data.data;
  },

  async update(id: string, input: Partial<SocialLinkInput>) {
    const res = await api.put<ApiSuccess<SocialLink>>(`/social-links/${id}`, input);
    return res.data.data;
  },

  async remove(id: string) {
    await api.delete(`/social-links/${id}`);
  },
};
