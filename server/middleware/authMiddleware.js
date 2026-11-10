import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import requireDb from './requireDb.js';

// AUTHENTICATION: who are you? Verifies the Bearer token and attaches req.user.
export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new AppError('Please log in to continue.', 401);

  let payload;
  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch {
    throw new AppError('Your session has expired. Please log in again.', 401);
  }

  await new Promise((resolve, reject) => requireDb(req, res, (e) => (e ? reject(e) : resolve())));
  const user = await User.findById(payload.id);
  if (!user) throw new AppError('This account no longer exists.', 401);

  req.user = user;
  next();
});

// AUTHORIZATION: what may you do? Use after protect, e.g. authorize('admin').
export const authorize = (...roles) => (req, res, next) =>
  roles.includes(req.user.role)
    ? next()
    : next(new AppError('You do not have permission to do that.', 403));
