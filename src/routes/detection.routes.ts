import express from 'express';
import multer from 'multer';
import { detectDisease, getDetectionHistory } from '../controllers/detection.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Routes
router.post('/detect', authenticateToken, upload.single('image') as any, detectDisease);
router.get('/history', authenticateToken, getDetectionHistory);

export default router; 