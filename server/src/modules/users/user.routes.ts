import { Router } from 'express';
import * as userController from './user.controller.ts';
import { authenticate, validate } from '../../middlewares/index.ts';
import { updatePreferencesSchema } from './user.validator.ts';

export const userRouter = Router();

userRouter.get('/me', authenticate, userController.getProfile);

userRouter.patch(
  '/me/preferences',
  authenticate,
  validate(updatePreferencesSchema),
  userController.updatePreferences
);
