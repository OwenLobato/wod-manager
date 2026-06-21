import { z } from 'zod';
import { userPreferencesSchema } from './preferences.ts';

/** Core authenticated user — shared across features (auth, users…). */
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  roles: z.array(z.string()),
});

/** Full profile (GET /users/me): the user plus their preferences and profile fields. */
export const profileSchema = userSchema.extend({
  preferences: userPreferencesSchema,
  box: z.string().nullable().optional(),
  gender: z.enum(['male', 'female']).optional(),
  birthDate: z.string().optional(),
  isPublic: z.boolean(),
  avatarUrl: z.string().optional(),
  bio: z.string().optional(),
  organizerStatus: z.enum(['none', 'pending', 'approved', 'rejected']),
  plan: z.enum(['free', 'pro', 'elite']),
});

export type User = z.infer<typeof userSchema>;
export type Profile = z.infer<typeof profileSchema>;
