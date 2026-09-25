export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  success: false;
  message: string;
  details?: unknown;
}

export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}
