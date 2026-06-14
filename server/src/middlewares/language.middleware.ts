import type { Request, Response, NextFunction } from 'express';
import { resolveLanguage, translate } from '../config/i18n.ts';

/**
 * Resolves the request language from the Accept-Language header and attaches:
 * - `req.language`: the resolved language code.
 * - `req.t`: a bound translator so controllers can localize response messages.
 *
 * Registered first so every downstream handler (including the error middleware) has them.
 */
export const language = (req: Request, _res: Response, next: NextFunction): void => {
  const lang = resolveLanguage(req.headers['accept-language']);
  req.language = lang;
  req.t = (key, messageParams) => translate(key, lang, messageParams);
  next();
};
