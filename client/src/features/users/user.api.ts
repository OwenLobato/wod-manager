import { api } from '@/api/axios.ts';
import type { ApiResponse } from '@/types/api.ts';
import { profileSchema, type Profile } from '@/types/user.ts';

/** GET /users/me — returns and validates the authenticated user's full profile. */
export const getProfileRequest = async (): Promise<Profile> => {
  const { data } = await api.get<ApiResponse<Profile>>('/users/me');
  return profileSchema.parse(data.data);
};
