import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '@/test/test-utils.tsx';
import { LoginPage } from './LoginPage.tsx';

describe('LoginPage', () => {
  it('renders the email and password inputs', () => {
    const { container } = renderWithProviders(<LoginPage />);
    expect(container.querySelector('#email')).not.toBeNull();
    expect(container.querySelector('#password')).not.toBeNull();
  });
});
