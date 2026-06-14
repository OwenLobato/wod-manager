import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/app/hooks.ts';
import { profileQueryKey } from '@/features/users/user.queries.ts';
import type { Profile } from '@/types/user.ts';
import type { UserPreferences } from '@/types/preferences.ts';
import { hydratePreferences } from './preferences.slice.ts';
import { updatePreferencesRequest } from './preferences.api.ts';

/** Mutation to persist preferences for authenticated users; syncs Redux and the profile cache. */
export const useUpdatePreferences = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: Partial<UserPreferences>) => updatePreferencesRequest(patch),
    onSuccess: (profile: Profile) => {
      dispatch(hydratePreferences(profile.preferences));
      queryClient.setQueryData(profileQueryKey, profile);
    },
  });
};
