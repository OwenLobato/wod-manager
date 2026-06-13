import { createApp } from './app.ts';
import { env } from './config/env.ts';
import { dbConnection } from './config/database.ts';

/** Connects to the database, then builds and starts the HTTP server. */
const start = async (): Promise<void> => {
  try {
    await dbConnection();
    const app = createApp();
    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (err) {
    console.error('Server could not start:', err);
    process.exit(1);
  }
};

void start();
