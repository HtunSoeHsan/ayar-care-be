import { PlantDisease } from "../types";

interface DiseaseMapping {
  classIndex: number;
  name: string;
  description: string;
  symptoms: string[];
  plantType: string;
  treatments: {
    name: string;
    description: string;
    steps: string[];
  }[];
}

// This mapping matches your actual training data structure
// Based on the folders found in /home/hsh/Documents/ME/ayar-care-be/training_data
export const diseaseMapping: PlantDisease[] = [
  {
    classIndex: 0,
    name: 'Apple Scab',
    description: 'A fungal disease that affects apple trees, causing scabby lesions on leaves and fruit.',
    symptoms: ['Dark spots on leaves', 'Cracked fruit', 'Premature leaf drop'],
    plantType: 'Apple',
    treatments: [
      {
        name: 'Cultural Control',
        description: 'Implement cultural practices to manage apple scab',
        steps: [
          'Rake and remove fallen leaves',
          'Prune for better air circulation',
          'Apply fungicide in spring',
          'Use resistant varieties'
        ]
      }
    ]
  },
  {
    classIndex: 1,
    name: 'Apple Black Rot',
    description: 'A fungal disease that causes black rot on apple fruit and leaves.',
    symptoms: ['Black rot on fruit', 'Leaf spots', 'Cankers on branches'],
    plantType: 'Apple',
    treatments: [
      {
        name: 'Fungicide Application',
        description: 'Apply fungicide to control black rot',
        steps: [
          'Remove infected fruit and leaves',
          'Apply fungicide',
          'Prune infected branches',
          'Improve air circulation'
        ]
      }
    ]
  },
  {
    classIndex: 2,
    name: 'Apple Cedar Rust',
    description: 'A fungal disease that affects apple trees, causing orange spots on leaves.',
    symptoms: ['Orange spots on leaves', 'Fruit distortion', 'Premature leaf drop'],
    plantType: 'Apple',
    treatments: [
      {
        name: 'Rust Management',
        description: 'Manage cedar rust through cultural and chemical controls',
        steps: [
          'Remove nearby cedar trees',
          'Apply fungicide in spring',
          'Use resistant varieties',
          'Improve air circulation'
        ]
      }
    ]
  },
  {
    classIndex: 3,
    name: 'Apple Healthy',
    description: 'A healthy apple tree showing no signs of disease.',
    symptoms: ['No symptoms'],
    plantType: 'Apple',
    treatments: [
      {
        name: 'Preventive Care',
        description: 'Maintain tree health through proper care',
        steps: [
          'Regular pruning',
          'Proper fertilization',
          'Adequate irrigation',
          'Pest monitoring'
        ]
      }
    ]
  },
  {
    classIndex: 4,
    name: 'Background Without Leaves',
    description: 'Image contains no plant material - background only.',
    symptoms: ['No plant visible'],
    plantType: 'None',
    treatments: [
      {
        name: 'No Treatment Required',
        description: 'This is not a plant disease - retake photo focusing on plant leaves',
        steps: [
          'Retake photo with plant leaves visible',
          'Ensure good lighting',
          'Focus on affected plant parts',
          'Try a different angle'
        ]
      }
    ]
  },
  {
    classIndex: 5,
    name: 'Blueberry Healthy',
    description: 'A healthy blueberry plant showing no signs of disease.',
    symptoms: ['No symptoms'],
    plantType: 'Blueberry',
    treatments: [
      {
        name: 'Preventive Care',
        description: 'Maintain plant health through proper care',
        steps: [
          'Maintain acidic soil (pH 4.5-5.5)',
          'Provide adequate water',
          'Mulch around plants',
          'Regular pruning'
        ]
      }
    ]
  },
  {
    classIndex: 6,
    name: 'Cherry Healthy',
    description: 'A healthy cherry tree showing no signs of disease.',
    symptoms: ['No symptoms'],
    plantType: 'Cherry',
    treatments: [
      {
        name: 'Preventive Care',
        description: 'Maintain tree health through proper care',
        steps: [
          'Regular pruning',
          'Proper fertilization',
          'Adequate irrigation',
          'Pest monitoring'
        ]
      }
    ]
  },
  {
    classIndex: 7,
    name: 'Corn Common Rust',
    description: 'A fungal disease that causes rust-colored pustules on corn leaves.',
    symptoms: ['Rust-colored pustules', 'Leaf yellowing', 'Reduced yield'],
    plantType: 'Corn',
    treatments: [
      {
        name: 'Rust Control',
        description: 'Control common rust through cultural and chemical means',
        steps: [
          'Use resistant varieties',
          'Apply fungicide',
          'Practice crop rotation',
          'Control plant density'
        ]
      }
    ]
  },
  {
    classIndex: 8,
    name: 'Corn Healthy',
    description: 'A healthy corn plant showing no signs of disease.',
    symptoms: ['No symptoms'],
    plantType: 'Corn',
    treatments: [
      {
        name: 'Preventive Care',
        description: 'Maintain plant health through proper care',
        steps: [
          'Proper fertilization',
          'Adequate irrigation',
          'Pest monitoring',
          'Weed control'
        ]
      }
    ]
  },
  {
    classIndex: 9,
    name: 'Corn Northern Leaf Blight',
    description: 'A fungal disease that causes long, gray-green lesions on corn leaves.',
    symptoms: ['Long gray-green lesions', 'Leaf death', 'Reduced yield'],
    plantType: 'Corn',
    treatments: [
      {
        name: 'Blight Management',
        description: 'Manage northern leaf blight through cultural and chemical controls',
        steps: [
          'Use resistant varieties',
          'Apply fungicide',
          'Practice crop rotation',
          'Control plant density'
        ]
      }
    ]
  },
  {
    classIndex: 10,
    name: 'Grape Black Rot',
    description: 'A fungal disease that affects grape vines, causing black rot on fruit and leaves.',
    symptoms: ['Black rot on fruit', 'Leaf spots', 'Cankers on stems'],
    plantType: 'Grape',
    treatments: [
      {
        name: 'Fungicide Application',
        description: 'Apply fungicide to control black rot',
        steps: [
          'Remove infected fruit and leaves',
          'Apply fungicide',
          'Prune infected canes',
          'Improve air circulation'
        ]
      }
    ]
  },
  {
    classIndex: 11,
    name: 'Grape Esca (Black Measles)',
    description: 'A fungal disease that causes wood decay in grape vines.',
    symptoms: ['Wood decay', 'Leaf yellowing', 'Reduced vigor', 'Black spots on leaves'],
    plantType: 'Grape',
    treatments: [
      {
        name: 'Cultural Control',
        description: 'Implement cultural practices to manage esca',
        steps: [
          'Prune infected wood',
          'Apply fungicide to pruning wounds',
          'Improve air circulation',
          'Control irrigation'
        ]
      }
    ]
  },
  {
    classIndex: 12,
    name: 'Grape Healthy',
    description: 'A healthy grape vine showing no signs of disease.',
    symptoms: ['No symptoms'],
    plantType: 'Grape',
    treatments: [
      {
        name: 'Preventive Care',
        description: 'Maintain vine health through proper care',
        steps: [
          'Regular pruning',
          'Proper fertilization',
          'Adequate irrigation',
          'Pest monitoring'
        ]
      }
    ]
  },
  {
    classIndex: 13,
    name: 'Grape Leaf Blight (Isariopsis Leaf Spot)',
    description: 'A fungal disease that causes blight on grape leaves.',
    symptoms: ['Leaf spots', 'Leaf death', 'Reduced vigor', 'Brown lesions'],
    plantType: 'Grape',
    treatments: [
      {
        name: 'Blight Control',
        description: 'Control leaf blight through cultural and chemical means',
        steps: [
          'Remove infected leaves',
          'Apply fungicide',
          'Improve air circulation',
          'Control irrigation'
        ]
      }
    ]
  }
];

// Helper function to get disease info by class index
export function getDiseaseByClassIndex(classIndex: number): PlantDisease | undefined {
  return diseaseMapping.find(disease => disease.classIndex === classIndex);
}
