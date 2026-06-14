import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, setAccessToken } from './session.ts';
import { env } from '@/config/env.ts';
import i18n from '@/locales/i18n.ts';
import type { ApiResponse } from '@/types/api.ts';
import { authDataSchema, type AuthData } from '@/features/auth/auth.types.ts';

const baseURL = env.API_URL;

export const api = axios.create({ baseURL, withCredentials: true });

// Attach the in-memory access token + active language to every request.
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['Accept-Language'] = i18n.language; // so the server localizes its messages
  return config;
});

// Separate client for refresh so its 401s never re-enter the interceptor.
const refreshClient = axios.create({ baseURL, withCredentials: true });

/** Exchanges the refresh cookie for a new access token and stores it in memory. */
export const refreshSession = async (): Promise<AuthData> => {
  const { data } = await refreshClient.post<ApiResponse<AuthData>>('/auth/refresh');
  const session = authDataSchema.parse(data.data);
  setAccessToken(session.accessToken);
  return session;
};

// Dedupe concurrent refreshes so a burst of 401s triggers a single refresh.
let refreshing: Promise<AuthData> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const isAuthRoute = original?.url?.includes('/auth/');

    if (error.response?.status === 401 && original && !original._retry && !isAuthRoute) {
      original._retry = true;
      try {
        refreshing ??= refreshSession();
        const { accessToken } = await refreshing;
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (refreshError) {
        setAccessToken(null);
        return Promise.reject(refreshError);
      } finally {
        refreshing = null;
      }
    }

    return Promise.reject(error);
  }
);
