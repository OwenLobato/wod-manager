import { useQuery } from '@tanstack/react-query';
import { getProfileRequest } from './user.api.ts';

export const profileQueryKey = ['profile'] as const;

/** Query hook for the authenticated user's profile (GET /users/me) — the app's first real query. */
export const useProfile = () =>
  useQuery({
    queryKey: profileQueryKey,
    queryFn: getProfileRequest,
  });
