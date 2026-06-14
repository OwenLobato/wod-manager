import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/app/hooks.ts';
import { setAccessToken } from '@/api/session.ts';
import { setUser, clearAuth } from './auth.slice.ts';
import {
  loginRequest,
  registerRequest,
  logoutRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
  type ResetPasswordPayload,
} from './auth.api.ts';
import type { LoginValues, RegisterValues } from './auth.schemas.ts';
import type { AuthData } from './auth.types.ts';

/** Persists the new token + user in the session (memory) and Redux. */
const useAuthSuccess = () => {
  const dispatch = useAppDispatch();
  return (data: AuthData) => {
    setAccessToken(data.accessToken);
    dispatch(setUser(data.user));
  };
};

/** Mutation hook for logging in. */
export const useLogin = () => {
  return useMutation({
    mutationFn: (values: LoginValues) => loginRequest(values),
    onSuccess: useAuthSuccess(),
  });
};

/** Mutation hook for registering a new account. */
export const useRegister = () => {
  return useMutation({
    mutationFn: (values: RegisterValues) => registerRequest(values),
    onSuccess: useAuthSuccess(),
  });
};

/** Mutation hook for requesting a password-reset email. */
export const useForgotPassword = () =>
  useMutation({ mutationFn: (email: string) => forgotPasswordRequest(email) });

/** Mutation hook for setting a new password from a reset token. */
export const useResetPassword = () =>
  useMutation({ mutationFn: (payload: ResetPasswordPayload) => resetPasswordRequest(payload) });

/** Mutation hook for logging out; clears the session and cached queries. */
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      setAccessToken(null);
      dispatch(clearAuth());
      queryClient.clear();
    },
  });
};
