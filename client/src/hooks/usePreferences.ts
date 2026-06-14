import { useAppSelector } from '@/app/hooks.ts';

/** Returns the user's UI preferences (theme, language, unit). */
export const usePreferences = () => useAppSelector((state) => state.preferences);
