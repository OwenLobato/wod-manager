import type { ComponentType } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { GuestRoute } from '@/app/guards/GuestRoute.tsx';
import { ProtectedRoute } from '@/app/guards/ProtectedRoute.tsx';
import { AuthLayout } from '@/features/auth/components/AuthLayout.tsx';
import { AppLayout } from '@/components/layout/AppLayout.tsx';
import { RouteError } from '@/components/RouteError.tsx';

/** Turns a dynamic import + named export into a React Router lazy loader (code-splitting per route). */
const lazyRoute = (loader: () => Promise<Record<string, unknown>>, name: string) => async () => ({
  Component: (await loader())[name] as ComponentType,
});

/** Rendered during the initial lazy-route hydration. */
const RouteFallback = () => (
  <div className="flex min-h-dvh items-center justify-center text-muted-foreground">Loading…</div>
);

// Lazy page loaders (named for readability; each becomes its own chunk).
const loginPage = lazyRoute(() => import('@/features/auth/pages/LoginPage.tsx'), 'LoginPage');
const registerPage = lazyRoute(
  () => import('@/features/auth/pages/RegisterPage.tsx'),
  'RegisterPage'
);
const forgotPasswordPage = lazyRoute(
  () => import('@/features/auth/pages/ForgotPasswordPage.tsx'),
  'ForgotPasswordPage'
);
const resetPasswordPage = lazyRoute(
  () => import('@/features/auth/pages/ResetPasswordPage.tsx'),
  'ResetPasswordPage'
);
const dashboardPage = lazyRoute(() => import('@/pages/DashboardPage.tsx'), 'DashboardPage');
const profilePage = lazyRoute(
  () => import('@/features/users/pages/ProfilePage.tsx'),
  'ProfilePage'
);

const router = createBrowserRouter([
  {
    HydrateFallback: RouteFallback,
    errorElement: <RouteError />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: '/login', lazy: loginPage },
              { path: '/register', lazy: registerPage },
              { path: '/forgot-password', lazy: forgotPasswordPage },
              { path: '/reset-password', lazy: resetPasswordPage },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { path: '/', lazy: dashboardPage },
              { path: '/profile', lazy: profilePage },
            ],
          },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
