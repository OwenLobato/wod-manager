import { Outlet } from 'react-router-dom';
import { Card } from '@/components/ui';

/** Layout route: centered card shell shared by the auth screens (login, register…). */
export const AuthLayout = () => (
  <main className="flex min-h-dvh items-center justify-center bg-background p-6 text-foreground">
    <Card className="w-full max-w-sm">
      <Outlet />
    </Card>
  </main>
);
