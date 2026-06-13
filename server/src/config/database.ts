import mongoose from 'mongoose';
import { env } from './env.ts';

/** Opens the Mongoose connection using the configured MongoDB URI. */
export const dbConnection = async (): Promise<void> => {
  await mongoose.connect(env.MONGO_URI);
  console.log('MongoDB connected');
};
