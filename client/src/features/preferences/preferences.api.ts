import { api } from '@/api/axios.ts';
import type { ApiResponse } from '@/types/api.ts';
import { profileSchema, type Profile } from '@/types/user.ts';
import type { UserPreferences } from '@/types/preferences.ts';

/** PATCH /users/me/preferences — persists a partial preferences change, returns the updated profile. */
export const updatePreferencesRequest = async (
  patch: Partial<UserPreferences>
): Promise<Profile> => {
  const { data } = await api.patch<ApiResponse<Profile>>('/users/me/preferences', patch);
  return profileSchema.parse(data.data);
};
