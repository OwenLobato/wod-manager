import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

vi.mock('@/api/axios.ts', () => ({ api: { get: vi.fn() } }));

import { api } from '@/api/axios.ts';
import { getProfileRequest } from './user.api.ts';

const profile = {
  id: '1',
  name: 'Owen',
  email: 'owen@test.com',
  roles: ['athlete'],
  preferences: { theme: 'light', language: 'es', unit: 'lb', percentRange: 10 },
};

beforeEach(() => vi.clearAllMocks());

describe('users.api', () => {
  it('getProfileRequest fetches and unwraps the profile', async () => {
    (api.get as Mock).mockResolvedValue({
      data: { success: true, message: 'ok', data: profile, errors: null },
    });

    const result = await getProfileRequest();

    expect(api.get).toHaveBeenCalledWith('/users/me');
    expect(result).toEqual(profile);
  });
});
