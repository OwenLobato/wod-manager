import { z } from 'zod';
import { userSchema } from '@/types/user.ts';

/** Payload returned by login / register / refresh. */
export const authDataSchema = z.object({
  user: userSchema,
  accessToken: z.string(),
});

export type AuthData = z.infer<typeof authDataSchema>;
