import { api } from '@/api/axios.ts';
import type { ApiResponse } from '@/types/api.ts';
import { authDataSchema, type AuthData } from './auth.types.ts';
import type { LoginValues, RegisterValues } from './auth.schemas.ts';

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

/** POST /auth/login — returns the user and a fresh access token. */
export const loginRequest = async (payload: LoginValues): Promise<AuthData> => {
  const { data } = await api.post<ApiResponse<AuthData>>('/auth/login', payload);
  return authDataSchema.parse(data.data);
};

/** POST /auth/register — creates an account and returns the user and access token. */
export const registerRequest = async (payload: RegisterValues): Promise<AuthData> => {
  const { data } = await api.post<ApiResponse<AuthData>>('/auth/register', payload);
  return authDataSchema.parse(data.data);
};

/** POST /auth/logout — clears the refresh cookie and revokes the session. */
export const logoutRequest = async (): Promise<void> => {
  await api.post('/auth/logout');
};

/** POST /auth/forgot-password — triggers the reset email for the address. */
export const forgotPasswordRequest = async (email: string): Promise<void> => {
  await api.post('/auth/forgot-password', { email });
};

/** POST /auth/reset-password — sets a new password from a valid reset token. */
export const resetPasswordRequest = async (payload: ResetPasswordPayload): Promise<void> => {
  await api.post('/auth/reset-password', payload);
};
