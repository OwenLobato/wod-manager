import { useAppDispatch, useAppSelector } from '@/app/hooks.ts';
import { useAuth } from './useAuth.ts';
import {
  toggleTheme,
  setLanguage,
  setUnit,
  setPercentRange,
} from '@/features/preferences/preferences.slice.ts';
import { useUpdatePreferences } from '@/features/preferences/preferences.queries.ts';
import type { Language, Unit, UserPreferences } from '@/types/preferences.ts';

/**
 * UI preferences hook: returns the current values (theme, language, unit, percentRange) plus
 * setters that update Redux immediately and, for authenticated users, persist to the server.
 * Guests keep their preferences in localStorage only.
 */
export const usePreferences = () => {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const { isAuthenticated } = useAuth();
  const { mutate: persist } = useUpdatePreferences();

  const persistIfAuthenticated = (patch: Partial<UserPreferences>) => {
    if (isAuthenticated) persist(patch);
  };

  return {
    ...preferences,
    toggleTheme: () => {
      const next = preferences.theme === 'light' ? 'dark' : 'light';
      dispatch(toggleTheme());
      persistIfAuthenticated({ theme: next });
    },
    setLanguage: (language: Language) => {
      dispatch(setLanguage(language));
      persistIfAuthenticated({ language });
    },
    setUnit: (unit: Unit) => {
      dispatch(setUnit(unit));
      persistIfAuthenticated({ unit });
    },
    setPercentRange: (percentRange: number) => {
      dispatch(setPercentRange(percentRange));
      persistIfAuthenticated({ percentRange });
    },
  };
};
