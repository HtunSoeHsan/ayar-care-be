import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import path from 'path';

// Import routes
import authRoutes from './routes/auth.routes';
import enhancedDetectionRoutes from './routes/enhanced-detection.routes';
import detectionRoutes from './routes/detection.routes';
import forumRoutes from './routes/forum.routes';
import weatherRoutes from './routes/weather.routes';
import debugRoutes from './routes/debug.routes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/diseases', diseaseRoutes);
app.use('/api/detections', detectionRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/enhanced-detection', enhancedDetectionRoutes);
app.use('/api/debug', debugRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, prisma }; 