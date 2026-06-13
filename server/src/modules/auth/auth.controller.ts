import type { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service.ts';
import { env } from '../../config/env.ts';
import { AppError } from '../../utils/AppError.ts';
import { sendSuccess } from '../../utils/response.ts';

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

/** POST /auth/register - creates an account, sets the refresh cookie, returns the access token. */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user, accessToken, refreshToken, cookieMaxAge } = await authService.register(req.body);
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: cookieMaxAge });
    sendSuccess(res, 201, 'Account created successfully', { user, accessToken });
  } catch (err) {
    next(err);
  }
};

/** POST /auth/login - authenticates, sets the refresh cookie, returns the access token. */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user, accessToken, refreshToken, cookieMaxAge } = await authService.login(req.body);
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: cookieMaxAge });
    sendSuccess(res, 200, 'Login successful', { user, accessToken });
  } catch (err) {
    next(err);
  }
};

/** POST /auth/refresh - rotates the token pair using the refresh cookie. */
export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken as string | undefined;
    if (!token) throw new AppError(401, 'No refresh token provided');

    const { user, accessToken, refreshToken, cookieMaxAge } = await authService.refresh(token);
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: cookieMaxAge });
    sendSuccess(res, 200, 'Token refreshed', { user, accessToken });
  } catch (err) {
    next(err);
  }
};

/** POST /auth/logout - clears the refresh cookie and revokes the session. */
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await authService.logout(req.cookies?.refreshToken as string | undefined);
    res.clearCookie('refreshToken', cookieOptions);
    sendSuccess(res, 200, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

/** POST /auth/forgot-password - triggers the reset email; always 200 to avoid email enumeration. */
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resetToken = await authService.forgotPassword(req.body.email);
    const data = env.NODE_ENV === 'production' ? undefined : { resetToken }; // exposed only outside production
    sendSuccess(res, 200, 'If that email exists, a reset link has been sent', data);
  } catch (err) {
    next(err);
  }
};

/** POST /auth/reset-password - sets a new password from a valid reset token. */
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await authService.resetPassword(req.body);
    sendSuccess(res, 200, 'Password updated successfully');
  } catch (err) {
    next(err);
  }
};
