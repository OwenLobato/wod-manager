import { type ReactNode, useEffect, useRef } from 'react';
import { useAppDispatch } from './hooks.ts';
import { setStatus, setUser } from '@/features/auth/auth.slice.ts';
import { refreshSession } from '@/api/axios.ts';

/** On mount, restores the session via a silent /auth/refresh using the httpOnly cookie. */
export const SessionInitializer = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    dispatch(setStatus('loading'));
    refreshSession()
      .then((data) => dispatch(setUser(data.user)))
      .catch(() => dispatch(setStatus('unauthenticated')));
  }, [dispatch]);

  return <>{children}</>;
};
