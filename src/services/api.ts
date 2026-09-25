import axios, { AxiosError } from 'axios';
import type { ApiError } from '@/types/api';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
  withCredentials: true,
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
