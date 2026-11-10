import { Router } from 'express';
import { isDbReady } from '../config/db.js';
import { pingOllama } from '../services/aiService.js';
import { config } from '../config/env.js';

const router = Router();

router.get('/', async (req, res) => {
  res.json({
    status: 'ok', service: 'interviewx-api',
    database: isDbReady() ? 'connected' : 'unavailable',
    ai: (await pingOllama()) ? 'connected' : 'unavailable',
    modelConfigured: !!config.ollamaModel,
  });
});

export default router;
