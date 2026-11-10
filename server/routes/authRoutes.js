import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, me } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import requireDb from '../middleware/requireDb.js';

const router = Router();

// Slows down password-guessing: 20 attempts per 15 minutes per IP.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { message: 'Too many attempts. Please wait a few minutes and try again.' },
});

router.post('/register', authLimiter, requireDb, register);
router.post('/login', authLimiter, requireDb, login);
router.get('/me', protect, me);

export default router;
