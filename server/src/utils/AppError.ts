/** Optional details for an AppError. */
interface AppErrorOptions {
  /** Field-level errors keyed by field name (e.g. Zod validation output). */
  errors?: Record<string, string[]>;
  /** Interpolation values for the message key's `{{placeholders}}` (resolved at the error middleware). */
  messageParams?: Record<string, string | number>;
}

/**
 * Operational error carrying an HTTP status code and a translation **key** as its message.
 * The error middleware localizes the key — interpolating `messageParams` — before responding.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors?: Record<string, string[]>;
  public readonly messageParams?: Record<string, string | number>;

  constructor(statusCode: number, message: string, options: AppErrorOptions = {}) {
    super(message);
    this.statusCode = statusCode;
    this.errors = options.errors;
    this.messageParams = options.messageParams;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}
