import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.ts';
import { AppError } from '../utils/AppError.ts';

interface AccessTokenPayload {
  id: string;
  roles: string[];
}

/** Verifies the Bearer access token and attaches { id, roles } to req.user. */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError(401, 'auth.errors.required'));
  }

  const token = authHeader.slice(7); // drop the "Bearer " prefix

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
    req.user = { id: payload.id, roles: payload.roles };
    next();
  } catch {
    next(new AppError(401, 'auth.errors.invalidToken'));
  }
};

/** Allows the request only if req.user holds one of the given roles. */
export const requireRole =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new AppError(401, 'auth.errors.required'));
    const allowed = roles.some((role) => req.user!.roles.includes(role));
    if (!allowed) return next(new AppError(403, 'auth.errors.insufficientPermissions'));
    next();
  };
