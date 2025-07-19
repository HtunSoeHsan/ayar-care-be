import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { enhancedDetectDisease, batchAnalysis } from '../controllers/enhanced-detection.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Enhanced multer configuration with validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `plant-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter for images only
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files for batch processing
  }
});

// Enhanced single image detection endpoint
router.post('/enhanced-detect', authenticateToken, upload.single('image') as any, enhancedDetectDisease);

// Batch analysis endpoint
router.post('/batch-analysis', authenticateToken, upload.array('images', 10) as any, batchAnalysis);

// Get confidence threshold settings
router.get('/confidence-settings', authenticateToken, (req, res) => {
  res.json({
    status: 'success',
    data: {
      thresholds: {
        HIGH: { confidence: 0.9, validationScore: 85 },
        MEDIUM: { confidence: 0.7, validationScore: 70 },
        LOW: { confidence: 0.0, validationScore: 0 }
      },
      recommendations: {
        HIGH: 'Proceed with treatment recommendations',
        MEDIUM: 'Consider secondary validation',
        LOW: 'Manual verification required'
      }
    }
  });
});

// Model performance endpoint
router.get('/model-performance', authenticateToken, (req, res) => {
  res.json({
    status: 'success',
    data: {
      modelInfo: {
        version: '1.0.0',
        trainedOn: 'PlantVillage Dataset + Custom Data',
        classes: 38,
        accuracy: '94.2%',
        lastUpdated: '2024-06-01'
      },
      enhancementFeatures: [
        'Ensemble prediction with multiple models',
        'Image augmentation for robustness',
        'Multi-scale preprocessing',
        'Confidence validation scoring',
        'Alternative prediction suggestions'
      ],
      supportedPlants: [
        'Tomato', 'Potato', 'Apple', 'Corn', 'Grape', 
        'Peach', 'Pepper', 'Strawberry', 'Squash', 'Soybean'
      ]
    }
  });
});

export default router;
