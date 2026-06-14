import type { Request, Response, NextFunction } from 'express';
import { z, type ZodType } from 'zod';
import { AppError } from '../utils/AppError.ts';

type RequestSource = 'body' | 'query' | 'params';

/** Validates and parse a request section (body/query/params) against a Zod schema; 422 on failure. */
export const validate =
  (schema: ZodType, source: RequestSource = 'body') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = z.flattenError(result.error).fieldErrors as Record<string, string[]>;
      return next(new AppError(422, 'validation.failed', { errors }));
    }

    if (source === 'query') {
      Object.defineProperty(req, 'query', {
        value: result.data,
        writable: true,
        configurable: true,
      });
    } else {
      req[source] = result.data;
    }

    next();
  };
