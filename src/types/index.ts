interface DiseaseTreatment {
  name: string;
  description: string;
  steps: string[];
}

export interface PlantDisease {
  classIndex: number;
  name: string;
  description: string;
  symptoms: string[];
  plantType: string;
  treatments: DiseaseTreatment[];
  prevention?: string[];
  recommendations?: string[];
  detection?: DiseaseDetection;
  preventionTips?: string[];
}

interface DiseaseDetection {
  confidence: string; // e.g. 0.92 for 92%
  imageUrl?: string;  // Optional image used for detection
  detectedAt?: Date;  // Optional timestamp of detection
}
