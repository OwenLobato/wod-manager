import { type ReactNode, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './hooks.ts';
import { useAuth } from '@/hooks/useAuth.ts';
import { useProfile } from '@/features/users/user.queries.ts';
import { hydratePreferences } from '@/features/preferences/preferences.slice.ts';
import i18n from '@/locales/i18n.ts';

/**
 * Bridges the preferences slice to its UI side effects:
 * - reflects the theme on the <html> element,
 * - drives the active i18n language,
 * - hydrates preferences from the server once the authenticated profile loads.
 */
export const PreferencesSync = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const theme = useAppSelector((state) => state.preferences.theme);
  const language = useAppSelector((state) => state.preferences.language);
  const { data: profile } = useProfile(isAuthenticated);
  const hydratedFor = useRef<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (i18n.language !== language) void i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    if (profile && hydratedFor.current !== profile.id) {
      hydratedFor.current = profile.id;
      dispatch(hydratePreferences(profile.preferences));
    }
  }, [profile, dispatch]);

  return <>{children}</>;
};
