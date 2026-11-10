import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/authRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.clientOrigin }));
app.use(express.json({ limit: '1mb' }));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api', (req, res) => res.status(404).json({ message: 'Route not found' }));

app.use(errorHandler); // must be last

connectDB();
app.listen(config.port, () => console.log(`InterviewX API running on http://localhost:${config.port}`));
