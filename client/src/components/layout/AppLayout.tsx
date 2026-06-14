import { Outlet } from 'react-router-dom';

/** Layout route for the authenticated app shell. */
export const AppLayout = () => (
  <div className="min-h-dvh bg-background text-foreground">
    <Outlet />
  </div>
);
