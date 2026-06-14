import { z } from 'zod';

/**
 * Partial update of the user's preferences. Every field is optional, but at least one
 * must be present so an empty PATCH is rejected. Weight is always stored in `lb`.
 */
export const updatePreferencesSchema = z
  .object({
    theme: z.enum(['light', 'dark']),
    language: z.enum(['es', 'en']),
    unit: z.enum(['lb', 'kg']),
    percentRange: z.number().int().min(1).max(20),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one preference must be provided',
  });

export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
