import { api } from './api';
import type { ApiSuccess, PageMeta } from '@/types/api';
import type { Project, ProjectImage, ProjectThumbnail } from '@/types/models';

export interface ProjectInput {
  title: string;
  slug?: string;
  shortDescription: string;
  description: string;
  thumbnail: ProjectThumbnail;
  images: ProjectImage[];
  featured: boolean;
  published: boolean;
  displayOrder: number;
  year: number;
  role: string;
  liveUrl: string;
  githubUrl: string;
  challenges: string;
  solution: string;
  results: string;
  technologies: string[];
}

export interface AdminProjectListParams {
  search?: string;
  published?: boolean;
  page?: number;
  limit?: number;
}

export const projectService = {
  async listPublic() {
    const res = await api.get<ApiSuccess<Project[]>>('/projects');
    return res.data.data;
  },

  async getBySlug(slug: string) {
    const res = await api.get<ApiSuccess<Project>>(`/projects/${slug}`);
    return res.data.data;
  },

  async listAdmin(params: AdminProjectListParams) {
    const res = await api.get<ApiSuccess<Project[]>>('/projects/admin', { params });
    return { items: res.data.data, meta: res.data.meta as unknown as PageMeta };
  },

  async getById(id: string) {
    const res = await api.get<ApiSuccess<Project>>(`/projects/admin/${id}`);
    return res.data.data;
  },

  async create(input: ProjectInput) {
    const res = await api.post<ApiSuccess<Project>>('/projects/admin', input);
    return res.data.data;
  },

  async update(id: string, input: Partial<ProjectInput>) {
    const res = await api.put<ApiSuccess<Project>>(`/projects/admin/${id}`, input);
    return res.data.data;
  },

  async remove(id: string) {
    await api.delete(`/projects/admin/${id}`);
  },

  async reorder(items: Array<{ id: string; displayOrder: number }>) {
    await api.post('/projects/admin/reorder', { items });
  },

  async uploadImage(file: File) {
    const form = new FormData();
    form.append('image', file);
    const res = await api.post<ApiSuccess<{ url: string; publicId: string; width?: number; height?: number }>>(
      '/projects/admin/upload-image',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return res.data.data;
  },

  async deleteImage(publicId: string) {
    await api.delete('/projects/admin/image', { params: { publicId } });
  },
};
