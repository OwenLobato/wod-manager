import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.ts';

/** Redirects already-authenticated users away from public-only routes. */
export const GuestRoute = () => {
  const { status, isAuthenticated } = useAuth();

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex min-h-dvh items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};
