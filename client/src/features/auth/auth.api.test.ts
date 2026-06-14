import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

vi.mock('@/api/axios.ts', () => ({ api: { post: vi.fn(), get: vi.fn() } }));

import { api } from '@/api/axios.ts';
import { loginRequest, forgotPasswordRequest } from './auth.api.ts';

const authData = {
  user: { id: '1', name: 'Owen', email: 'owen@test.com', roles: ['athlete'] },
  accessToken: 'access-token',
};

beforeEach(() => vi.clearAllMocks());

describe('auth.api', () => {
  it('loginRequest posts credentials and unwraps the auth data', async () => {
    (api.post as Mock).mockResolvedValue({
      data: { success: true, message: 'ok', data: authData, errors: null },
    });

    const result = await loginRequest({ email: 'owen@test.com', password: 'password123' });

    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'owen@test.com',
      password: 'password123',
    });
    expect(result).toEqual(authData);
  });

  it('forgotPasswordRequest posts the email', async () => {
    (api.post as Mock).mockResolvedValue({
      data: { success: true, message: 'ok', data: null, errors: null },
    });

    await forgotPasswordRequest('owen@test.com');

    expect(api.post).toHaveBeenCalledWith('/auth/forgot-password', { email: 'owen@test.com' });
  });
});
