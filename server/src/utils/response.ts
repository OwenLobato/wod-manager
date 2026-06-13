import type { Response } from 'express';

/** Sends a standardized success response: { success, message, data }. */
export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
): void => {
  res.status(statusCode).json({ success: true, message, data: data ?? null });
};

/** Sends a standardized error response: { success, message, errors }. */
export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: Record<string, string[]>
): void => {
  res.status(statusCode).json({ success: false, message, errors: errors ?? null });
};
