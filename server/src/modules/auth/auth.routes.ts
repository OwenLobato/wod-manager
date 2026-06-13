import { Router } from 'express';
import * as authController from './auth.controller.ts';
import { validate, authLimiter } from '../../middlewares/index.ts';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validator.ts';

export const authRouter = Router();

authRouter.post('/register', authLimiter, validate(registerSchema), authController.register);

authRouter.post('/login', authLimiter, validate(loginSchema), authController.login);

authRouter.post('/refresh', authController.refresh);

authRouter.post('/logout', authController.logout);

authRouter.post(
  '/forgot-password',
  authLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

authRouter.post(
  '/reset-password',
  authLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword
);
