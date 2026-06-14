import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../utils/AppError.ts';
import { sendError } from '../utils/response.ts';
import { translate } from '../config/i18n.ts';

/**
 * Central error handler: maps AppError and Mongoose errors to JSON responses, localizing
 * messages with the request language. AppError carries a translation key as its message.
 */
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const lang = req.language;

  if (err instanceof AppError) {
    sendError(res, err.statusCode, translate(err.message, lang, err.messageParams), err.errors);
    return;
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const errors: Record<string, string[]> = {};
    for (const [field, detail] of Object.entries(err.errors)) {
      errors[field] = [detail.message];
    }
    sendError(res, 422, translate('validation.failed', lang), errors);
    return;
  }

  // MongoDB duplicate key (code 11000)
  const mongoErr = err as { code?: number; keyValue?: Record<string, unknown> };
  if (mongoErr.code === 11000) {
    const field = Object.keys(mongoErr.keyValue ?? {})[0] ?? 'field';
    sendError(res, 409, translate('common.duplicateField', lang, { field }));
    return;
  }

  // Mongoose cast error (bad ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    sendError(res, 400, translate('common.invalidValue', lang, { path: err.path }));
    return;
  }

  console.error('[Unhandled error]', err);
  sendError(res, 500, translate('common.internalError', lang));
};
