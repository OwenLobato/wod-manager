import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { getApiError } from '@/api/errors.ts';
import { useProfile } from '../user.queries.ts';

export const ProfilePage = () => {
  const { t } = useTranslation();
  const { data, isPending, isError, error } = useProfile();

  return (
    <main className="min-h-dvh bg-background p-6 text-foreground">
      <div className="mx-auto max-w-xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">{t('profile.title')}</h1>
          <Button asChild variant="outline" size="sm">
            <Link to="/">{t('profile.back')}</Link>
          </Button>
        </div>

        {isPending ? (
          <p className="text-muted-foreground">{t('common.loading')}</p>
        ) : isError ? (
          <p className="text-destructive">{getApiError(error).message}</p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{data.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">{t('profile.email')}: </span>
                {data.email}
              </p>
              <p>
                <span className="text-muted-foreground">{t('profile.roles')}: </span>
                {data.roles.join(', ')}
              </p>
              <p>
                <span className="text-muted-foreground">{t('profile.unit')}: </span>
                {data.preferences.unit}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};
