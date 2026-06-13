import express, { type Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { env } from './config/env.ts';
import { apiRouter } from './routes.ts';
import { apiLimiter, errorMiddleware } from './middlewares/index.ts';
import { sendError } from './utils/response.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '../public');

/** Builds and configures the Express application (without starting the server). */
export const createApp = (): Application => {
  const app = express();

  // Security & parsing
  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  // Public
  app.use(express.static(publicPath));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ success: true, message: 'ok' });
  });

  // API routes
  app.use('/api/v1', apiLimiter, apiRouter);

  // 404 for unmatched API routes
  app.use('/api/*splat', (_req, res) => {
    sendError(res, 404, 'API route not found');
  });

  // Serve index.html for any other route (SPA support)
  app.use((_req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });

  // Centralized error handler
  app.use(errorMiddleware);

  return app;
};
