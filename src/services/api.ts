import axios, { AxiosError } from 'axios';
import type { ApiError } from '@/types/api';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
  withCredentials: true,
});

/**
 * Whose portfolio reads return. By default the signed-in account's own
 * (`scope=mine`) — without it the API returns the site owner's, the one
 * portfolio-site shows. A shared page (/p/:username) switches to that
 * account's public portfolio for as long as it is open.
 */
let publicSite: string | null = null;
export function setPublicSite(username: string | null) {
  publicSite = username;
}

api.interceptors.request.use((config) => {
  config.params = publicSite ? { site: publicSite, ...config.params } : { scope: 'mine', ...config.params };
  return config;
});

export class ApiRequestError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.details = details;
  }
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const message = error.response?.data?.message ?? error.message ?? 'Something went wrong';
    return Promise.reject(new ApiRequestError(message, error.response?.status, error.response?.data?.details));
  }
);
