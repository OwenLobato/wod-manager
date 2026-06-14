import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { store } from '@/app/store.ts';
import '@/locales/i18n.ts';

const Wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
};

/** Renders a component wrapped with the app providers (store, query, router, i18n). */
export const renderWithProviders = (ui: ReactElement) => render(ui, { wrapper: Wrapper });
