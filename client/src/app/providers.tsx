import { type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { store } from './store.ts';
import { queryClient } from './queryClient.ts';
import { SessionInitializer } from './SessionInitializer.tsx';
import { PreferencesSync } from './PreferencesSync.tsx';
import { env } from '@/config/env.ts';
import '@/locales/i18n.ts';

/** Wraps the app with the store, query client, i18n, session bootstrap and preferences sync. */
export const AppProviders = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <SessionInitializer>
        <PreferencesSync>{children}</PreferencesSync>
      </SessionInitializer>
      {env.ENVIRONMENT !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </Provider>
);
