import { useAppSelector } from '@/app/hooks.ts';

/** Exposes the current session state from the store. */
export const useAuth = () => {
  const { user, status } = useAppSelector((state) => state.auth);

  return { user, status, isAuthenticated: status === 'authenticated' };
};
