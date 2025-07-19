import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as tf from '@tensorflow/tfjs-node';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { getDiseaseByClassIndex } from '../config/disease-mapping';
import { TreatmentRecommendationService } from '../services/treatment-recommendation.service';
import { ModelInspector } from '../utils/model-inspector';

const prisma = new PrismaClient();

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
const ensemblePrediction = async (tensors: tf.Tensor[]): Promise<EnhancedDetectionResult> => {
  const models = await loadModels();
  const allPredictions: number[][] = [];

  // Get predictions from all models and all image variations
  for (const model of models) {
    for (const tensor of tensors) {
      const prediction = await model.predict(tensor) as tf.Tensor;
      const probabilities = Array.from(await prediction.data());
      allPredictions.push(probabilities);
      
      // Debug: Log prediction results
      console.log('Raw probabilities:', probabilities.slice(0, 10)); // Show first 10 values
      console.log('Max probability:', Math.max(...probabilities));
      console.log('Max probability index:', probabilities.indexOf(Math.max(...probabilities)));
      
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

  // Debug: Log top predictions
  console.log('Top 5 predictions:');
  topPredictions.forEach((pred, idx) => {
    const diseaseInfo = getDiseaseByClassIndex(pred.classIndex);
    console.log(`${idx + 1}. Class ${pred.classIndex}: ${diseaseInfo?.name || 'Unknown'} (${(pred.confidence * 100).toFixed(2)}%)`);
  });

  // Calculate validation metrics
  const validationScore = calculateValidationScore(allPredictions, topPredictions[0].classIndex);
  const reliability = determineReliability(topPredictions[0].confidence, validationScore);
  const recommendations = generateRecommendations(topPredictions, reliability);

  return {
    primaryResult: {
      classIndex: topPredictions[0].classIndex,
      confidence: topPredictions[0].confidence,
      className: getDiseaseByClassIndex(topPredictions[0].classIndex)?.name || 'Unknown'
    },
    secondaryResults: topPredictions.slice(1, 4).map(pred => ({
      classIndex: pred.classIndex,
      confidence: pred.confidence,
      className: getDiseaseByClassIndex(pred.classIndex)?.name || 'Unknown'
    })),
    confidence: topPredictions[0].confidence,
    reliability,
    validationScore,
    recommendations
  };
};

// Calculate validation score based on prediction consistency
const calculateValidationScore = (allPredictions: number[][], topClassIndex: number): number => {
  let consistentPredictions = 0;
  
  for (const prediction of allPredictions) {
    const predictedClass = prediction.indexOf(Math.max(...prediction));
    if (predictedClass === topClassIndex) {
      consistentPredictions++;
    }
  }
  
  return (consistentPredictions / allPredictions.length) * 100;
};

// Determine reliability based on confidence and validation score
const determineReliability = (confidence: number, validationScore: number): 'HIGH' | 'MEDIUM' | 'LOW' => {
  if (confidence > 0.9 && validationScore > 85) return 'HIGH';
  if (confidence > 0.7 && validationScore > 70) return 'MEDIUM';
  return 'LOW';
};

// Generate recommendations based on prediction results
const generateRecommendations = (predictions: any[], reliability: string): string[] => {
  const recommendations: string[] = [];
  
  if (reliability === 'HIGH') {
    recommendations.push('High confidence detection - proceed with recommended treatment');
    recommendations.push('Monitor plant regularly for changes');
  } else if (reliability === 'MEDIUM') {
    recommendations.push('Medium confidence - consider secondary analysis');
    recommendations.push('Compare with visual symptoms described in disease information');
    recommendations.push('Consult with local agricultural extension service if unsure');
  } else {
    recommendations.push('Low confidence detection - manual verification strongly recommended');
    recommendations.push('Take additional photos from different angles');
    recommendations.push('Consult with plant pathologist or agricultural expert');
    recommendations.push('Consider laboratory testing for definitive diagnosis');
  }
  
  // Add specific recommendations based on top predictions
  if (predictions.length > 1) {
    const topTwo = predictions.slice(0, 2);
    const confidenceDiff = topTwo[0].confidence - topTwo[1].confidence;
    
    if (confidenceDiff < 0.1) {
      recommendations.push(`Also consider possibility of ${topTwo[1].className} (${(topTwo[1].confidence * 100).toFixed(1)}% confidence)`);
    }
  }
  
  return recommendations;
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
    const enhancedResult = await ensemblePrediction(preprocessedTensors);
    
    // Get disease information
    const diseaseInfo = getDiseaseByClassIndex(enhancedResult.primaryResult.classIndex);
    
    if (!diseaseInfo) {
      return res.status(404).json({
        status: 'error',
        message: 'Disease not found in database',
        result: enhancedResult
      });
    }

    // Find or create disease in database
    let disease = await prisma.plantDisease.findFirst({
      where: { name: diseaseInfo.name },
      include: { treatments: true }
    });

    if (!disease) {
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

    // Save enhanced detection record
    const detection = await prisma.detection.create({
      data: {
        userId,
        diseaseId: disease.id,
        imageUrl: path.basename(imagePath),
        confidence: enhancedResult.confidence,
        // Store additional metadata in a JSON field if your schema supports it
        // metadata: JSON.stringify({
        //   reliability: enhancedResult.reliability,
        //   validationScore: enhancedResult.validationScore,
        //   secondaryResults: enhancedResult.secondaryResults
        // })
      }
    });

    // Response with enhanced information
    res.json({
      status: 'success',
      data: {
        detection,
        disease,
        enhancedResult: {
          primaryPrediction: enhancedResult.primaryResult,
          alternativePredictions: enhancedResult.secondaryResults,
          confidence: `${(enhancedResult.confidence * 100).toFixed(2)}%`,
          reliability: enhancedResult.reliability,
          validationScore: `${enhancedResult.validationScore.toFixed(1)}%`,
          recommendations: enhancedResult.recommendations
        },
        treatmentPlan: {
          immediate: disease.treatments[0] || null,
          preventive: generatePreventiveMeasures(disease.plantType),
          monitoring: generateMonitoringPlan(diseaseInfo.name)
        }
      }
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

// Generate preventive measures based on plant type
const generatePreventiveMeasures = (plantType: string): string[] => {
  const commonMeasures = [
    'Maintain proper plant spacing for air circulation',
    'Water at the base of plants to avoid wetting leaves',
    'Remove dead or diseased plant material promptly',
    'Practice crop rotation',
    'Use disease-resistant varieties when available'
  ];

  const specificMeasures: { [key: string]: string[] } = {
    'Tomato': [
      'Stake plants for better air circulation',
      'Mulch around plants to prevent soil splash',
      'Avoid overhead watering'
    ],
    'Potato': [
      'Use certified seed potatoes',
      'Hill soil around plants',
      'Harvest in dry weather'
    ],
    'Apple': [
      'Prune for open canopy',
      'Clean up fallen leaves and fruit',
      'Apply dormant oil in early spring'
    ]
  };

  return [...commonMeasures, ...(specificMeasures[plantType] || [])];
};

// Generate monitoring plan
const generateMonitoringPlan = (diseaseName: string): string[] => {
  return [
    'Check plants daily for new symptoms',
    'Monitor weather conditions that favor disease development',
    'Document any changes with photos',
    'Track treatment effectiveness',
    'Record environmental conditions (humidity, temperature)',
    'Schedule follow-up inspections every 3-5 days'
  ];
};

// Batch analysis for multiple images
export const batchAnalysis = async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({
        status: 'error',
        message: 'No image files provided'
      });
    }

    const userId = (req as any).user.userId;
    const files = req.files as Express.Multer.File[];
    const results = [];

    for (const file of files) {
      const tensors = await preprocessImageMultiple(file.path);
      const enhancedResult = await ensemblePrediction(tensors);
      
      results.push({
        filename: file.filename,
        result: enhancedResult,
        diseaseInfo: getDiseaseByClassIndex(enhancedResult.primaryResult.classIndex)
      });

      // Clean up tensors
      tensors.forEach(tensor => tensor.dispose());
    }

    res.json({
      status: 'success',
      data: {
        totalImages: files.length,
        results: results,
        summary: generateBatchSummary(results)
      }
    });

  } catch (error) {
    console.error('Batch analysis error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error processing batch analysis'
    });
  }
};

// Generate summary for batch analysis
const generateBatchSummary = (results: any[]) => {
  const diseaseCount: { [key: string]: number } = {};
  const reliabilityCount: { [key: string]: number } = {};
  
  results.forEach(result => {
    const disease = result.diseaseInfo?.name || 'Unknown';
    const reliability = result.result.reliability;
    
    diseaseCount[disease] = (diseaseCount[disease] || 0) + 1;
    reliabilityCount[reliability] = (reliabilityCount[reliability] || 0) + 1;
  });

  return {
    diseasesDetected: diseaseCount,
    reliabilityDistribution: reliabilityCount,
    averageConfidence: results.reduce((sum, r) => sum + r.result.confidence, 0) / results.length,
    highConfidenceCount: results.filter(r => r.result.reliability === 'HIGH').length
  };
};
