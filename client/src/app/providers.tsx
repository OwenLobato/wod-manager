import { type ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { store } from './store.ts';
import { queryClient } from './queryClient.ts';
import { useAppSelector } from './hooks.ts';
import { SessionInitializer } from './SessionInitializer.tsx';
import { env } from '@/config/env.ts';
import '@/locales/i18n.ts';

/** Reflects the theme preference on the <html> element. */
const ThemeSync = ({ children }: { children: ReactNode }) => {
  const theme = useAppSelector((state) => state.preferences.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return <>{children}</>;
};

/** Wraps the app with the store, query client, i18n, theme and session initializer. */
export const AppProviders = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ThemeSync>
        <SessionInitializer>{children}</SessionInitializer>
      </ThemeSync>
      {env.ENVIRONMENT !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </Provider>
);
