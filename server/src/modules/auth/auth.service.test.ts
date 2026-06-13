import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

vi.mock('../../config/env.ts', () => ({
  env: {
    JWT_SECRET: 'test-secret',
    JWT_REFRESH_SECRET: 'test-refresh-secret',
    JWT_EXPIRES_IN: '15m',
    JWT_REFRESH_EXPIRES_IN: '7d',
    CLIENT_URL: 'http://localhost:5173',
  },
}));

vi.mock('../../models/User.ts', () => ({
  User: {
    findOne: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
  },
}));

vi.mock('bcryptjs', () => ({
  default: { hash: vi.fn(), compare: vi.fn() },
}));

vi.mock('jsonwebtoken', () => ({
  default: { sign: vi.fn(() => 'signed-token'), verify: vi.fn() },
}));

vi.mock('../../utils/email.ts', () => ({
  sendPasswordResetEmail: vi.fn(),
}));

import { register, login, refresh, logout, forgotPassword, resetPassword } from './auth.service.ts';
import { User } from '../../models/User.ts';
import { sendPasswordResetEmail } from '../../utils/email.ts';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../../utils/AppError.ts';

const fakeUser = {
  _id: 'user-123',
  name: 'Owen',
  email: 'owen@test.com',
  password: 'hashed-password',
  roles: ['athlete'],
  tokenVersion: 0,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('auth.service · register', () => {
  it('creates a user and returns tokens when the email is free', async () => {
    (User.findOne as Mock).mockResolvedValue(null);
    (bcrypt.hash as Mock).mockResolvedValue('hashed-password');
    (User.create as Mock).mockResolvedValue(fakeUser);

    const result = await register({
      name: 'Owen',
      email: 'owen@test.com',
      password: 'password123',
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
    expect(result.user).toEqual({
      id: 'user-123',
      name: 'Owen',
      email: 'owen@test.com',
      roles: ['athlete'],
    });
    expect(result.accessToken).toBe('signed-token');
    expect(result.refreshToken).toBe('signed-token');
  });

  it('rejects with 409 when the email already exists', async () => {
    (User.findOne as Mock).mockResolvedValue(fakeUser);

    await expect(
      register({ name: 'Owen', email: 'owen@test.com', password: 'password123' })
    ).rejects.toMatchObject({ statusCode: 409 });
    expect(User.create).not.toHaveBeenCalled();
  });
});

describe('auth.service · login', () => {
  it('returns tokens when credentials are valid', async () => {
    (User.findOne as Mock).mockReturnValue({
      select: vi.fn().mockResolvedValue(fakeUser),
    });
    (bcrypt.compare as Mock).mockResolvedValue(true);

    const result = await login({ email: 'owen@test.com', password: 'password123' });

    expect(result.user.id).toBe('user-123');
    expect(result.accessToken).toBe('signed-token');
  });

  it('rejects with 401 when the user does not exist', async () => {
    (User.findOne as Mock).mockReturnValue({ select: vi.fn().mockResolvedValue(null) });

    await expect(login({ email: 'nobody@test.com', password: 'x' })).rejects.toBeInstanceOf(
      AppError
    );
  });

  it('rejects with 401 when the password does not match', async () => {
    (User.findOne as Mock).mockReturnValue({
      select: vi.fn().mockResolvedValue(fakeUser),
    });
    (bcrypt.compare as Mock).mockResolvedValue(false);

    await expect(login({ email: 'owen@test.com', password: 'wrong' })).rejects.toMatchObject({
      statusCode: 401,
    });
  });
});

describe('auth.service · refresh', () => {
  it('issues a new token pair when the refresh token is valid', async () => {
    (jwt.verify as Mock).mockReturnValue({ id: 'user-123', version: 0 });
    (User.findById as Mock).mockResolvedValue(fakeUser);

    const result = await refresh('valid-refresh');

    expect(result.user.id).toBe('user-123');
    expect(result.accessToken).toBe('signed-token');
    expect(result.refreshToken).toBe('signed-token');
  });

  it('rejects with 401 when the token cannot be verified', async () => {
    (jwt.verify as Mock).mockImplementation(() => {
      throw new Error('invalid');
    });

    await expect(refresh('bad-token')).rejects.toMatchObject({ statusCode: 401 });
    expect(User.findById).not.toHaveBeenCalled();
  });

  it('rejects with 401 when tokenVersion does not match (revoked)', async () => {
    (jwt.verify as Mock).mockReturnValue({ id: 'user-123', version: 0 });
    (User.findById as Mock).mockResolvedValue({ ...fakeUser, tokenVersion: 3 });

    await expect(refresh('stale-refresh')).rejects.toMatchObject({ statusCode: 401 });
  });
});

describe('auth.service · logout', () => {
  it('bumps tokenVersion when given a valid refresh token', async () => {
    (jwt.verify as Mock).mockReturnValue({ id: 'user-123', version: 0 });

    await logout('valid-refresh');

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith('user-123', {
      $inc: { tokenVersion: 1 },
    });
  });

  it('does nothing when no token is provided', async () => {
    await logout(undefined);
    expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
  });
});

describe('auth.service · forgotPassword', () => {
  it('stores a reset token and sends the email when the user exists', async () => {
    const save = vi.fn();
    (User.findOne as Mock).mockResolvedValue({ email: 'owen@test.com', save });

    const token = await forgotPassword('owen@test.com');

    expect(typeof token).toBe('string');
    expect(save).toHaveBeenCalled();
    expect(sendPasswordResetEmail).toHaveBeenCalledOnce();
  });

  it('does nothing and returns undefined when the user does not exist', async () => {
    (User.findOne as Mock).mockResolvedValue(null);

    const token = await forgotPassword('nobody@test.com');

    expect(token).toBeUndefined();
    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
  });
});

describe('auth.service · resetPassword', () => {
  it('updates the password and revokes sessions with a valid token', async () => {
    const save = vi.fn();
    const userDoc = { password: 'old', tokenVersion: 0, save };
    (User.findOne as Mock).mockReturnValue({ select: vi.fn().mockResolvedValue(userDoc) });
    (bcrypt.hash as Mock).mockResolvedValue('new-hash');

    await resetPassword({ token: 'raw-token', password: 'newpassword' });

    expect(userDoc.password).toBe('new-hash');
    expect(userDoc.tokenVersion).toBe(1);
    expect(save).toHaveBeenCalled();
  });

  it('rejects with 400 when the token is invalid or expired', async () => {
    (User.findOne as Mock).mockReturnValue({ select: vi.fn().mockResolvedValue(null) });

    await expect(
      resetPassword({ token: 'bad-token', password: 'newpassword' })
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});
