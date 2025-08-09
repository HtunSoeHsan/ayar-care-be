import express from 'express';
import { getWeatherAlerts } from '../controllers/weather.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/alerts', authenticateToken, getWeatherAlerts);

export default router; 