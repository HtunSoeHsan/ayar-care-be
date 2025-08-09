import { Request, Response } from 'express';
import * as tf from '@tensorflow/tfjs-node';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { getDiseaseByClassIndex } from '../config/disease-mapping';
import { TreatmentRecommendationService } from '../services/treatment-recommendation.service';
import { ModelInspector } from '../utils/model-inspector';
import { get } from 'http';
import { PlantDisease } from '../types';

interface DetectionResult {
  classIndex: number;
  confidence: number;
  className: string;
}

interface EnhancedDetectionResult {
  primaryResult: DetectionResult;
  secondaryResults: DetectionResult[];
  confidence: number;
  reliability: 'HIGH' | 'MEDIUM' | 'LOW';
  validationScore: number;
  recommendations: string[];
}

// Load multiple models for ensemble prediction
let models: tf.LayersModel[] = [];
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const MODEL_DIR = path.join(PROJECT_ROOT, 'models');

// Image preprocessing configurations - adjusted to match your model's requirements
const IMAGE_CONFIGS = [
  { size: 224, normalize: 255.0 } // Only use 224x224 since that's what your model expects
];

// Load multiple models for ensemble prediction
const loadModels = async () => {
  if (models.length === 0) {
    try {
      const modelPaths = [
        path.join(MODEL_DIR, 'plant_disease_model', 'model.json'),
        // Add more model paths here if you have multiple trained models
      ];

      for (const modelPath of modelPaths) {
        if (fs.existsSync(modelPath)) {
          const model = await tf.loadLayersModel(`file://${modelPath}`);
          models.push(model);
          console.log(`Model loaded successfully from: ${modelPath}`);
          
          // Inspect the model to understand its structure
          try {
            const modelInfo = await ModelInspector.inspectModel(modelPath);
            console.log(`Model has ${modelInfo.numClasses} output classes`);
          } catch (inspectionError) {
            console.warn('Could not inspect model:', inspectionError);
          }
        }
      }

      if (models.length === 0) {
        throw new Error('No models found. Please train at least one model first.');
      }
    } catch (error) {
      console.error('Error loading models:', error);
      throw new Error('Failed to load disease detection models.');
    }
  }
  return models;
};

// Enhanced image preprocessing with multiple techniques
const preprocessImageMultiple = async (imagePath: string): Promise<tf.Tensor[]> => {
  const tensors: tf.Tensor[] = [];
  
  // Use the first (and only) config - 224x224
  const config = IMAGE_CONFIGS[0];
  
  // Basic preprocessing
  const imageBuffer = await sharp(imagePath)
    .resize(config.size, config.size)
    .toBuffer();

  let tensor = tf.node.decodeImage(imageBuffer)
    .expandDims(0)
    .div(config.normalize);

  tensors.push(tensor);

  // Add augmented versions for more robust prediction
  const augmentedTensors = await createAugmentedImages(tensor);
  tensors.push(...augmentedTensors);

  return tensors;
};

// Create augmented images for better prediction
const createAugmentedImages = async (tensor: tf.Tensor): Promise<tf.Tensor[]> => {
  const augmentedTensors: tf.Tensor[] = [];

  try {
    // Horizontal flip
    const flipped = tf.image.flipLeftRight(tensor as tf.Tensor4D);
    augmentedTensors.push(flipped);

    // Brightness adjustment - simple manual implementation
    const brightened = tensor.add(0.1).clipByValue(0, 1);
    augmentedTensors.push(brightened);

    // Contrast adjustment - simple manual implementation
    const mean = tensor.mean();
    const contrasted = tensor.sub(mean).mul(1.1).add(mean).clipByValue(0, 1);
    augmentedTensors.push(contrasted);

    // Create a slightly darker version
    const darkened = tensor.mul(0.9).clipByValue(0, 1);
    augmentedTensors.push(darkened);

  } catch (error) {
    console.warn('Some augmentation failed, using original tensor:', error);
    // If augmentation fails, just return the original tensor
    augmentedTensors.push(tensor);
  }

  return augmentedTensors;
};

// Ensemble prediction with multiple models and image variations
const detectedResult = async (tensors: tf.Tensor[]): Promise<PlantDisease[]> => {
  const models = await loadModels();
  const allPredictions: number[][] = [];

  // Get predictions from all models and all image variations
  for (const model of models) {
    for (const tensor of tensors) {
      const prediction = await model.predict(tensor) as tf.Tensor;
      const probabilities = Array.from(await prediction.data());
      allPredictions.push(probabilities);
      prediction.dispose();
    }
  }

  // Calculate ensemble results
  const numClasses = allPredictions[0].length;
  const averageProbabilities = new Array(numClasses).fill(0);
  
  // Average all predictions
  for (const prediction of allPredictions) {
    for (let i = 0; i < numClasses; i++) {
      averageProbabilities[i] += prediction[i];
    }
  }
  
  for (let i = 0; i < numClasses; i++) {
    averageProbabilities[i] /= allPredictions.length;
  }

  // Get top predictions
  const topPredictions = averageProbabilities
    .map((prob, index) => ({ classIndex: index, confidence: prob }))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);

  const top5 = topPredictions.filter(pred => pred.confidence * 100 > 0.1); // Filter out low confidence predictions
  const top5Result: PlantDisease[] = top5.map((pred) => {
    const diseaseInfo = getDiseaseByClassIndex(pred.classIndex) || {
      name: 'Unknown',
      description: '',
      symptoms: [],
      plantType: '',
      treatments: [],
      detection: { confidence: 0 }
    };
    return {
      classIndex: pred.classIndex,
      ...diseaseInfo,
      detection: {
        confidence: `${(pred.confidence * 100).toFixed(2)}`, // Convert to percentage
        imageUrl: '', // You can add the image URL if needed
        detectedAt: new Date()
      }
    };
  });

  return top5Result;
};

// Enhanced disease detection endpoint
export const enhancedDetectDisease = async (req: Request, res: Response) => {
  const tensors: tf.Tensor[] = [];
  
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file provided'
      });
    }

    const userId = (req as any).user.userId;
    const imagePath = req.file.path;

    // Preprocess image with multiple techniques
    const preprocessedTensors = await preprocessImageMultiple(imagePath);
    tensors.push(...preprocessedTensors);

    // Perform ensemble prediction
    const results = await detectedResult(preprocessedTensors);
    
    res.json({
      status: 'success',
      data: results
    });

  } catch (error) {
    console.error('Enhanced detection error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error processing enhanced detection',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    // Clean up all tensors
    tensors.forEach(tensor => tensor.dispose());
  }
};
