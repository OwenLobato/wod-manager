import { Router } from 'express';
import * as userController from './user.controller.ts';
import { authenticate } from '../../middlewares/index.ts';

export const userRouter = Router();

userRouter.get('/me', authenticate, userController.getProfile);
