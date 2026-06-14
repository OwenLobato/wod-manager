import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorPage } from './ErrorPage.tsx';
import '@/locales/i18n.ts';

describe('ErrorPage', () => {
  it('renders a retry button', () => {
    render(<ErrorPage />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows the real error detail in dev', () => {
    render(<ErrorPage error={new Error('boom detail')} />);
    expect(screen.getByText(/boom detail/)).toBeInTheDocument();
  });
});
