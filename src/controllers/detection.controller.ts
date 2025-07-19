import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as tf from '@tensorflow/tfjs-node';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { getDiseaseByClassIndex } from '../config/disease-mapping';

const prisma = new PrismaClient();

// Load the model
let model: tf.LayersModel | null = null;

// Use absolute path to project directory
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const MODEL_DIR = path.join(PROJECT_ROOT, 'models');
const MODEL_PATH = path.join(MODEL_DIR, 'plant_disease_model');

// Ensure model directory exists
if (!fs.existsSync(MODEL_DIR)) {
  fs.mkdirSync(MODEL_DIR, { recursive: true });
}

const loadModel = async () => {
  if (!model) {
    try {
      // Check if model files exist
      const modelJsonPath = path.join(MODEL_PATH, 'model.json');
      if (!fs.existsSync(modelJsonPath)) {
        throw new Error(`Model not found at ${modelJsonPath}. Please train the model first.`);
      }
      
      model = await tf.loadLayersModel(`file://${modelJsonPath}`);
      console.log('Model loaded successfully from:', modelJsonPath);
    } catch (error) {
      console.error('Error loading model:', error);
      throw new Error('Failed to load the disease detection model. Please ensure the model is trained and available.');
    }
  }
  return model;
};

const preprocessImage = async (imagePath: string) => {
  // Resize and normalize image
  const imageBuffer = await sharp(imagePath)
    .resize(224, 224) // Standard input size for many CNN models
    .toBuffer();

  // Convert to tensor and normalize
  const tensor = tf.node.decodeImage(imageBuffer)
    .expandDims(0)
    .div(255.0);

  return tensor;
};

export const detectDisease = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file provided'
      });
    }

    const userId = (req as any).user.userId;
    const imagePath = req.file.path;

    // Preprocess image
    const tensor = await preprocessImage(imagePath);

    try {
      // Load model and make prediction
      const model = await loadModel();
      const prediction = await model.predict(tensor) as tf.Tensor;
      const probabilities = await prediction.data();
      console.log("probabilities", probabilities);

      // Get the class with highest probability
      const maxIndex = probabilities.indexOf(Math.max(...probabilities));
      console.log("maxIndex", maxIndex);
      const confidence = probabilities[maxIndex];
      console.log("confidence", confidence);

      // Get disease information from mapping
      const diseaseInfo = getDiseaseByClassIndex(maxIndex);

      if (!diseaseInfo) {
        // If disease not found in mapping, create a record with unknown disease
        const unknownDisease = await prisma.plantDisease.create({
          data: {
            name: `Unknown Disease (Class ${maxIndex})`,
            description: 'Disease class detected but not yet identified in the database.',
            symptoms: ['Unknown symptoms'],
            plantType: 'Unknown',
            treatments: {
              create: {
                name: 'General Treatment',
                description: 'Please consult with a plant expert for proper diagnosis and treatment.',
                steps: ['Monitor plant health', 'Isolate affected plant', 'Consult with plant expert']
              }
            }
          },
          include: {
            treatments: true
          }
        });

        // Save detection record with unknown disease
        const detection = await prisma.detection.create({
          data: {
            userId,
            diseaseId: unknownDisease.id,
            imageUrl: path.basename(imagePath),
            confidence: confidence
          }
        });

        return res.json({
          status: 'success',
          data: {
            detection,
            disease: unknownDisease,
            confidence,
            note: 'This disease class is not yet identified in our database. Please consult with a plant expert.'
          }
        });
      }

      // Find or create disease in database
      let disease = await prisma.plantDisease.findFirst({
        where: { name: diseaseInfo.name },
        include: { treatments: true }
      });

      if (!disease) {
        // Create disease if it doesn't exist
        disease = await prisma.plantDisease.create({
          data: {
            name: diseaseInfo.name,
            description: diseaseInfo.description,
            symptoms: diseaseInfo.symptoms,
            plantType: diseaseInfo.plantType,
            treatments: {
              create: diseaseInfo.treatments
            }
          },
          include: {
            treatments: true
          }
        });
      }

      // Save detection record
      const detection = await prisma.detection.create({
        data: {
          userId,
          diseaseId: disease.id,
          imageUrl: path.basename(imagePath),
          confidence: confidence
        }
      });

      res.json({
        status: 'success',
        data: {
          detection,
          disease,
          confidence
        }
      });
    } catch (error) {
      console.error('Model prediction error:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Error processing image'
      });
    } finally {
      // Clean up tensor
      tensor.dispose();
    }
  } catch (error) {
    console.error('Detection error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error processing image'
    });
  }
};

export const getDetectionHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const detections = await prisma.detection.findMany({
      where: { userId },
      include: {
        disease: {
          include: {
            treatments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      status: 'success',
      data: { detections }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching detection history'
    });
  }
}; 