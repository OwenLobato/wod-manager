import type { Request, Response, NextFunction } from 'express';
import * as userService from './user.service.ts';
import { sendSuccess } from '../../utils/response.ts';

/** GET /users/me - returns the authenticated user's profile. */
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await userService.getProfile(req.user!.id);
    sendSuccess(res, 200, req.t('users.profile.retrieved'), profile);
  } catch (err) {
    next(err);
  }
};
