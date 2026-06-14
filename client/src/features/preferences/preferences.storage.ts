import { userPreferencesSchema, type UserPreferences } from '@/types/preferences.ts';

const STORAGE_KEY = 'wod:preferences';

/** Defaults used for guests and as a fallback when nothing is stored yet. */
export const defaultPreferences: UserPreferences = {
  theme: 'light',
  language: 'es',
  unit: 'lb',
  percentRange: 10,
};

/** Reads guest/cached preferences from localStorage, falling back to defaults. */
export const loadStoredPreferences = (): UserPreferences => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPreferences;
    const parsed = userPreferencesSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : defaultPreferences;
  } catch {
    return defaultPreferences;
  }
};

/** Persists preferences to localStorage (guest storage + a cache for logged-in users). */
export const saveStoredPreferences = (preferences: UserPreferences): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // ignore quota/availability errors.
  }
};
