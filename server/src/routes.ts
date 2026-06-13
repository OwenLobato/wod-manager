import { Router } from 'express';
import { authRouter } from './modules/auth/auth.routes.ts';
import { userRouter } from './modules/users/user.routes.ts';

/** Mounts every feature router under /api/v1. */
export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
