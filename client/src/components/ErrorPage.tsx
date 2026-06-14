import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui';
import { env } from '@/config/env';

interface ErrorPageProps {
  error?: unknown;
}

const formatError = (error: unknown): string => {
  return error instanceof Error ? `${error.message}\n\n${error.stack ?? ''}` : String(error);
};

/** Friendly error screen. In dev it also shows the real error so you can see exactly what failed. */
export const ErrorPage = ({ error }: ErrorPageProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background p-6 text-center text-foreground">
      <p className="text-lg font-medium">{t('errors.generic')}</p>

      {env.ENVIRONMENT != 'production' && error ? (
        <pre className="max-w-full overflow-auto rounded-md border border-border bg-muted p-4 text-left text-xs whitespace-pre-wrap text-destructive">
          {formatError(error)}
        </pre>
      ) : null}

      <Button onClick={() => window.location.reload()}>{t('errors.retry')}</Button>
    </div>
  );
};
