import { AppProviders } from '@/app/providers.tsx';
import { AppRouter } from '@/app/router.tsx';

/** Root application component: wires global providers and routing. */
export const WodManagerApp = () => (
  <AppProviders>
    <AppRouter />
  </AppProviders>
);
