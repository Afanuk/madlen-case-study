// Initialize OpenTelemetry tracing FIRST (before any other imports)
import './tracing';

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Madlen Backend API is running' });
});

// API Routes
app.use('/api', chatRoutes);

// Error handling middleware - should be the last middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  console.log(`📝 API endpoints available at http://localhost:${PORT}/api`);
});
