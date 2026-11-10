import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { protect } from '../middleware/authMiddleware.js';
import * as iv from '../controllers/interviewController.js';
import * as misc from '../controllers/miscControllers.js';

const router = Router();
router.use(protect); // everything below requires a valid JWT

const aiLimiter = rateLimit({ windowMs: 60 * 1000, limit: 30, message: { message: 'You are going too fast. Wait a moment and try again.' } });

router.post('/interviews', iv.createInterview);
router.get('/interviews', iv.listInterviews);
router.get('/interviews/:id', iv.getInterview);
router.post('/interviews/:id/answer', aiLimiter, iv.submitAnswer);
router.post('/interviews/:id/finish', aiLimiter, iv.finishInterview);

router.get('/questions', misc.listQuestions);
router.post('/questions', misc.createQuestion);
router.post('/code/run', aiLimiter, misc.runCode);

router.get('/analytics', misc.analytics);
router.get('/skills', misc.skills);
router.get('/roadmap', misc.latestRoadmap);

export default router;
