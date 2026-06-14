import { useQuery } from '@tanstack/react-query';
import { getProfileRequest } from './user.api.ts';

export const profileQueryKey = ['profile'] as const;

/** Query hook for the authenticated user's profile (GET /users/me); pass `false` to skip it for guests. */
export const useProfile = (enabled = true) =>
  useQuery({
    queryKey: profileQueryKey,
    queryFn: getProfileRequest,
    enabled,
  });
