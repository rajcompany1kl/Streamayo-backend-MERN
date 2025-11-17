import mongoose from 'mongoose';
import { env } from './env.js';
import logger from '../utils/logger.js';


export async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_URI, {
      maxPoolSize: 20,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      autoIndex: env.NODE_ENV !== 'production',
    });

    logger.info('✅ MongoDB connected successfully');
  } catch (err) {
    logger.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}
