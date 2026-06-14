import { z } from 'zod';

// On the client, env vars come from Vite (import.meta.env.VITE_*), not process.env.
const schema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_ENVIRONMENT: z.enum(['development', 'staging', 'production']),
});

const parsed = schema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('Invalid client environment variables:', z.flattenError(parsed.error).fieldErrors);
  throw new Error('Invalid client environment variables');
}

/** Validated, typed client environment. Import this instead of reading import.meta.env directly. */
export const env = {
  API_URL: parsed.data.VITE_API_URL,
  ENVIRONMENT: parsed.data.VITE_ENVIRONMENT,
};
