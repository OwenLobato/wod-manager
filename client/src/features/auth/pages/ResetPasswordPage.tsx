import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
import { applyApiError } from '@/lib/forms.ts';
import { useResetPassword } from '../auth.queries.ts';
import { resetPasswordSchema, type ResetPasswordValues } from '../auth.schemas.ts';

export const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token');
  const reset = useResetPassword();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '' },
  });

  const backToLogin = (
    <p className="text-center text-sm">
      <Link className="text-primary hover:underline" to="/login">
        {t('auth.backToLogin')}
      </Link>
    </p>
  );

  if (!token) {
    return (
      <>
        <CardHeader>
          <CardTitle>{t('auth.resetTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-destructive">{t('auth.missingToken')}</p>
          {backToLogin}
        </CardContent>
      </>
    );
  }

  const onSubmit = handleSubmit((values) => {
    reset.mutate(
      { token, password: values.password },
      {
        onSuccess: () => navigate('/login'),
        onError: (err) => applyApiError(err, setError),
      }
    );
  });

  return (
    <>
      <CardHeader>
        <CardTitle>{t('auth.resetTitle')}</CardTitle>
        <CardDescription>{t('auth.resetSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.newPassword')}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register('password')}
            />
            {errors.password ? (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            ) : null}
          </div>
          {errors.root ? <p className="text-sm text-destructive">{errors.root.message}</p> : null}
          <Button type="submit" className="w-full" disabled={reset.isPending}>
            {reset.isPending ? t('common.loading') : t('auth.updatePassword')}
          </Button>
        </form>
        {backToLogin}
      </CardContent>
    </>
  );
};
