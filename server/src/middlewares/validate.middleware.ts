import type { Request, Response, NextFunction } from 'express';
import { z, type ZodType } from 'zod';
import { AppError } from '../utils/AppError.ts';

type RequestSource = 'body' | 'query' | 'params';

/** Validates and parses a request section (body/query/params) against a Zod schema; 422 on failure. */
export const validate =
  (schema: ZodType, source: RequestSource = 'body') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      // z.flattenError splits issues into two bucket:
      // - fieldErrors: keyed by field, e.g. { email: ['Invalid email'] }.
      // - formErrors:  top-level issues NOT tied to a field
      const { fieldErrors, formErrors } = z.flattenError(result.error);
      const errors: Record<string, string[]> = { ...(fieldErrors as Record<string, string[]>) };
      if (formErrors.length > 0) errors._form = formErrors;

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
