import mongoose from 'mongoose';
import { config } from './env.js';
import { seedIfEmpty } from '../services/seedService.js';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Fail fast instead of queueing queries forever when MongoDB is down.
mongoose.set('bufferCommands', false);

export async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 15000 });
    console.log('MongoDB connected');
    await seedIfEmpty();
  } catch (err) {
    // The API keeps running so the UI can show a friendly message.
    console.error('MongoDB connection failed. Is MongoDB running locally?', err.message);
  }
}

export const isDbReady = () => mongoose.connection.readyState === 1;
