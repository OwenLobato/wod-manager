import { z } from 'zod';
import { userPreferencesSchema } from './preferences.ts';

/** Core authenticated user — shared across features (auth, users…). */
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  roles: z.array(z.string()),
});

/** Full profile (GET /users/me): the user plus their preferences. */
export const profileSchema = userSchema.extend({
  preferences: userPreferencesSchema,
});

export type User = z.infer<typeof userSchema>;
export type Profile = z.infer<typeof profileSchema>;
