import { z } from 'zod';

export const themeSchema = z.enum(['light', 'dark']);
export const languageSchema = z.enum(['es', 'en']);
export const unitSchema = z.enum(['lb', 'kg']);

export const userPreferencesSchema = z.object({
  theme: themeSchema,
  language: languageSchema,
  unit: unitSchema,
  percentRange: z.number(),
});

export type Theme = z.infer<typeof themeSchema>;
export type Language = z.infer<typeof languageSchema>;
export type Unit = z.infer<typeof unitSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
