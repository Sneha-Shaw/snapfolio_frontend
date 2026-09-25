import { api } from './api';
import type { ApiSuccess } from '@/types/api';
import type { Profile, SiteTemplate, SiteTheme } from '@/types/models';

export interface ProfileInput {
  name?: string;
  headline?: string;
  bio?: string;
  location?: string;
  email?: string;
  profileImage?: { url: string; publicId: string };
  resumeUrl?: string;
  availability?: string;
  heroEyebrow?: string;
  heroStatement?: string;
  heroCurrently?: string;
  heroTimezone?: string;
  aboutText?: string;
  focusAreas?: string[];
  theme?: SiteTheme;
  template?: SiteTemplate;
}

export const profileService = {
  async get() {
    const res = await api.get<ApiSuccess<Profile>>('/profile');
    return res.data.data;
  },

  async update(input: ProfileInput) {
    const res = await api.put<ApiSuccess<Profile>>('/profile', input);
    return res.data.data;
  },
};
