import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { signToken } from '../utils/token.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const authResponse = (res, user, status = 200) =>
  res.status(status).json({ token: signToken(user._id), user });

export const register = asyncHandler(async (req, res) => {
  const name = String(req.body.name ?? '').trim();
  const email = String(req.body.email ?? '').trim().toLowerCase();
  const password = String(req.body.password ?? '');

  if (!name) throw new AppError('Please enter your name.', 400);
  if (!EMAIL_RE.test(email)) throw new AppError('Please enter a valid email address.', 400);
  if (password.length < 8) throw new AppError('Password must be at least 8 characters.', 400);

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, passwordHash }); // duplicate email -> code 11000 -> 409
  authResponse(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email ?? '').trim().toLowerCase();
  const password = String(req.body.password ?? '');
  if (!email || !password) throw new AppError('Enter your email and password.', 400);

  const user = await User.findOne({ email }).select('+passwordHash');
  // Same message for "no such user" and "wrong password" so emails can't be probed.
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }
  authResponse(res, user);
});

export const me = (req, res) => res.json({ user: req.user });
