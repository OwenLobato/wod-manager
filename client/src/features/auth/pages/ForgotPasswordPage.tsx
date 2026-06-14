import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/components/ui';
import { useForgotPassword } from '../auth.queries.ts';
import { forgotPasswordSchema, type ForgotPasswordValues } from '../auth.schemas.ts';

export const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const forgot = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit((values) => forgot.mutate(values.email));

  return (
    <>
      <CardHeader>
        <CardTitle>{t('auth.forgotTitle')}</CardTitle>
        <CardDescription>{t('auth.forgotSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {forgot.isSuccess ? (
          <p className="text-sm text-muted-foreground">{t('auth.resetLinkSent')}</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input id="email" type="email" autoComplete="email" {...register('email')} />
              {errors.email ? (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              ) : null}
            </div>
            <Button type="submit" className="w-full" disabled={forgot.isPending}>
              {forgot.isPending ? t('common.loading') : t('auth.sendResetLink')}
            </Button>
          </form>
        )}

        <p className="text-center text-sm">
          <Link className="text-primary hover:underline" to="/login">
            {t('auth.backToLogin')}
          </Link>
        </p>
      </CardContent>
    </>
  );
};
