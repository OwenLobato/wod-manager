import { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api.ts';

export interface NormalizedApiError {
  status: number | null;
  message: string;
  fieldErrors: Record<string, string[]> | null;
}

/**
 * Normalizes any thrown error (AxiosError or unknown) into a consistent shape
 * the UI can render: a message plus optional field-level errors from the backend.
 */
export const getApiError = (error: unknown): NormalizedApiError => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiResponse | undefined;
    return {
      status: error.response?.status ?? null,
      message: data?.message ?? error.message,
      fieldErrors: data?.errors ?? null,
    };
  }

  return {
    status: null,
    message: error instanceof Error ? error.message : 'Unexpected error',
    fieldErrors: null,
  };
};
