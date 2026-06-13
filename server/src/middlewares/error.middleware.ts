import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../utils/AppError.ts';
import { sendError } from '../utils/response.ts';

/** Central error handler: maps AppError and Mongoose errors to JSON responses. */
export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message, err.errors);
    return;
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const errors: Record<string, string[]> = {};
    for (const [field, detail] of Object.entries(err.errors)) {
      errors[field] = [detail.message];
    }
    sendError(res, 422, 'Validation failed', errors);
    return;
  }

  // MongoDB duplicate key (code 11000)
  const mongoErr = err as { code?: number; keyValue?: Record<string, unknown> };
  if (mongoErr.code === 11000) {
    const field = Object.keys(mongoErr.keyValue ?? {})[0] ?? 'field';
    sendError(res, 409, `${field} already exists`);
    return;
  }

  // Mongoose cast error (bad ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    sendError(res, 400, `Invalid value for ${err.path}`);
    return;
  }

  console.error('[Unhandled error]', err);
  sendError(res, 500, 'Internal server error');
};
