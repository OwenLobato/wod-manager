import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.ts';
import { User } from '../../models/User.ts';
import { AppError } from '../../utils/AppError.ts';
import { sendPasswordResetEmail } from '../../utils/email.ts';
import type { RegisterInput, LoginInput, ResetPasswordInput } from './auth.validator.ts';

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const RESET_TOKEN_TTL = 15 * 60 * 1000; // 15 minutes

interface AuthResult {
  user: { id: string; name: string; email: string; roles: string[] };
  accessToken: string;
  refreshToken: string;
  cookieMaxAge: number;
}

interface RefreshPayload {
  id: string;
  version: number;
}

/** Signs a short-lived access token and a refresh token carrying the tokenVersion. */
const signTokens = (userId: string, roles: string[], tokenVersion: number) => {
  const accessToken = jwt.sign({ id: userId, roles }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
  const refreshToken = jwt.sign({ id: userId, version: tokenVersion }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
  return { accessToken, refreshToken };
};

/** Hashes a reset token with SHA-256 (only the hash is persisted). */
const hashResetToken = (rawToken: string): string =>
  crypto.createHash('sha256').update(rawToken).digest('hex');

/** Registers a new user and returns the user and a fresh token pair. */
export const register = async ({ name, email, password }: RegisterInput): Promise<AuthResult> => {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError(409, 'auth.errors.emailInUse');

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed });

  const { accessToken, refreshToken } = signTokens(String(user._id), user.roles, user.tokenVersion);

  return {
    user: { id: String(user._id), name: user.name, email: user.email, roles: user.roles },
    accessToken,
    refreshToken,
    cookieMaxAge: COOKIE_MAX_AGE,
  };
};

/** Authenticates credentials and returns the user and a fresh token pair. */
export const login = async ({ email, password }: LoginInput): Promise<AuthResult> => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new AppError(401, 'auth.errors.invalidCredentials');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError(401, 'auth.errors.invalidCredentials');

  const { accessToken, refreshToken } = signTokens(String(user._id), user.roles, user.tokenVersion);

  return {
    user: { id: String(user._id), name: user.name, email: user.email, roles: user.roles },
    accessToken,
    refreshToken,
    cookieMaxAge: COOKIE_MAX_AGE,
  };
};

/** Validates a refresh token and issues a new token pair (rotation); rejects if revoked. */
export const refresh = async (refreshToken: string): Promise<AuthResult> => {
  let payload: RefreshPayload;
  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as RefreshPayload;
  } catch {
    throw new AppError(401, 'auth.errors.invalidRefreshToken');
  }

  const user = await User.findById(payload.id);
  if (!user || user.tokenVersion !== payload.version) {
    throw new AppError(401, 'auth.errors.refreshRevoked');
  }

  const { accessToken, refreshToken: newRefreshToken } = signTokens(
    String(user._id),
    user.roles,
    user.tokenVersion
  );

  return {
    user: { id: String(user._id), name: user.name, email: user.email, roles: user.roles },
    accessToken,
    refreshToken: newRefreshToken,
    cookieMaxAge: COOKIE_MAX_AGE,
  };
};

/** Revokes all refresh tokens for the user by bumping their tokenVersion. */
export const logout = async (refreshToken?: string): Promise<void> => {
  if (!refreshToken) return;
  try {
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as RefreshPayload;
    await User.findByIdAndUpdate(payload.id, { $inc: { tokenVersion: 1 } });
  } catch {
    // Invalid token
  }
};

/** Creates a reset token, emails the link, and returns the raw token (undefined if no user). */
export const forgotPassword = async (email: string): Promise<string | undefined> => {
  const user = await User.findOne({ email });
  if (!user) return;

  const rawToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = hashResetToken(rawToken);
  user.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_TTL);
  await user.save();

  const resetLink = `${env.CLIENT_URL}/reset-password?token=${rawToken}`;
  await sendPasswordResetEmail(user.email, resetLink);
  return rawToken;
};

/** Sets a new password from a valid reset token and revokes existing sessions. */
export const resetPassword = async ({ token, password }: ResetPasswordInput): Promise<void> => {
  const user = await User.findOne({
    passwordResetToken: hashResetToken(token),
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) throw new AppError(400, 'auth.errors.invalidResetToken');

  user.password = await bcrypt.hash(password, 12);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.tokenVersion += 1;
  await user.save();
};
