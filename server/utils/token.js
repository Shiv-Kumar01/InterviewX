import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

// The payload holds only the user id. Anything else is looked up fresh from MongoDB.
export const signToken = (userId) =>
  jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
