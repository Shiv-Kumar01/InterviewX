import { isDbReady } from '../config/db.js';
import AppError from '../utils/AppError.js';

export default function requireDb(req, res, next) {
  if (!isDbReady()) {
    return next(new AppError('Database unavailable. Make sure MongoDB is running locally.', 503));
  }
  next();
}
