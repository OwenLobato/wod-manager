import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, LogOut, Languages } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth.ts';
import { usePreferences } from '@/hooks/usePreferences.ts';
import { useAppDispatch } from '@/app/hooks.ts';
import { toggleTheme, setLanguage } from '@/features/preferences/preferences.slice.ts';
import { useLogout } from '@/features/auth/auth.queries.ts';
import { Button } from '@/components/ui';
import i18n from '@/locales/i18n.ts';

export const DashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { theme, language } = usePreferences();
  const logout = useLogout();

  const onLogout = () => logout.mutate(undefined, { onSuccess: () => navigate('/login') });

  const switchLanguage = () => {
    const next = language === 'es' ? 'en' : 'es';
    dispatch(setLanguage(next));
    void i18n.changeLanguage(next);
  };

  return (
    <main className="min-h-dvh bg-background p-6 text-foreground">
      <header className="mx-auto flex max-w-3xl items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{t('app.name')}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => dispatch(toggleTheme())}
            aria-label="theme"
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={switchLanguage}>
            <Languages className="size-4" />
            {language.toUpperCase()}
          </Button>
          <Button variant="ghost" size="sm" onClick={onLogout} disabled={logout.isPending}>
            <LogOut className="size-4" />
            {t('auth.logout')}
          </Button>
        </div>
      </header>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <p className="text-lg">{t('dashboard.greeting', { name: user?.name ?? '' })}</p>
        <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
        <Button asChild variant="outline" size="sm">
          <Link to="/profile">{t('profile.view')}</Link>
        </Button>
      </section>
    </main>
  );
};
