import { es } from '../locales/es.ts';
import { en } from '../locales/en.ts';

export type SupportedLanguage = 'es' | 'en';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['es', 'en'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'es';

const resources = { es, en };

/** Resolves a supported language from an Accept-Language header (falls back to the default). */
export const resolveLanguage = (header?: string): SupportedLanguage => {
  const requested = header?.toLowerCase().split(',')[0]?.trim().slice(0, 2);
  return SUPPORTED_LANGUAGES.includes(requested as SupportedLanguage)
    ? (requested as SupportedLanguage)
    : DEFAULT_LANGUAGE;
};

/**
 * Translates a dot-path key (e.g. `auth.errors.invalidCredentials`) for the given language,
 * interpolating the message's `{{placeholders}}`. Returns the key itself when no translation is found.
 */
export const translate = (
  key: string,
  language: SupportedLanguage = DEFAULT_LANGUAGE,
  messageParams?: Record<string, string | number>
): string => {
  const dictionary = resources[language] ?? resources[DEFAULT_LANGUAGE];
  const value = key
    .split('.')
    .reduce<unknown>(
      (node, segment) => (node as Record<string, unknown> | undefined)?.[segment],
      dictionary
    );

  if (typeof value !== 'string') return key;
  if (!messageParams) return value;
  return value.replace(/\{\{(\w+)\}\}/g, (_match, name: string) =>
    String(messageParams[name] ?? '')
  );
};
