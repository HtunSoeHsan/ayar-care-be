import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import path from 'path';

// Import routes
import authRoutes from './routes/auth.routes';
import enhancedDetectionRoutes from './routes/detection.routes';
import forumRoutes from './routes/forum.routes';
import weatherRoutes from './routes/weather.routes';
import debugRoutes from './routes/debug.routes';

// Import passport (you must have this file)
import './config/passport'; // Initializes Passport strategies
import passport from 'passport';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4000',
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Session middleware (required for Passport OAuth flow)
app.use(
  require('express-session')({
    secret: process.env.SESSION_SECRET || 'your-session-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session()); // Optional: only needed if you keep sessions

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/detections', enhancedDetectionRoutes);
app.use('/api/debug', debugRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌍 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔐 API: http://localhost:${PORT}/api/auth/login`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('❌ HTTP server closed');
  });
  await prisma.$disconnect();
  console.log('🔌 Prisma disconnected');
  process.exit(0);
});

export { app, prisma };