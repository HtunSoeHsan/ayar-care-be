import { PlantDisease, PlantCareGuide, MultilingualUtils } from '../models/flexibleMultilingualModels';

export class MultilingualService {
  
  // Create plant disease with flexible input
  static async createPlantDisease(data: any) {
    try {
      // The model automatically handles both string and object inputs
      const disease = new PlantDisease({
        classIndex: data.classIndex,
        name: data.name,                    // Can be "Early Blight" or { en: "Early Blight", mm: "..." }
        description: data.description,      // Can be string or object
        symptoms: data.symptoms,            // Array of strings or objects
        plantType: data.plantType,          // Can be string or object
        treatments: data.treatments,        // Array of strings or objects
        severity: data.severity || 'medium'
      });

      await disease.save();
      return disease;
    } catch (error) {
      throw new Error(`Failed to create plant disease: ${error.message}`);
    }
  }

  // Create plant care guide with mixed input
  static async createPlantCareGuide(data: any) {
    try {
      const guide = new PlantCareGuide({
        plantName: data.plantName,          // Flexible input
        scientificName: data.scientificName,
        plantType: data.plantType,          // Flexible input
        description: data.description,      // Flexible input
        images: data.images || [],
        careInstructions: {
          watering: {
            frequency: data.careInstructions?.watering?.frequency || "Daily",
            amount: data.careInstructions?.watering?.amount || "Moderate",
            tips: data.careInstructions?.watering?.tips || []
          },
          sunlight: {
            requirement: data.careInstructions?.sunlight?.requirement || "Full sun",
            hours: data.careInstructions?.sunlight?.hours || "6-8 hours",
            tips: data.careInstructions?.sunlight?.tips || []
          },
          soil: {
            type: data.careInstructions?.soil?.type || "Well-draining",
            pH: data.careInstructions?.soil?.pH || "6.0-7.0",
            drainage: data.careInstructions?.soil?.drainage || "Good drainage",
            tips: data.careInstructions?.soil?.tips || []
          },
          fertilizing: {
            frequency: data.careInstructions?.fertilizing?.frequency || "Monthly",
            type: data.careInstructions?.fertilizing?.type || "Balanced fertilizer",
            tips: data.careInstructions?.fertilizing?.tips || []
          }
        },
        difficulty: data.difficulty || 'beginner',
        tags: data.tags || [],
        createdBy: data.createdBy,
        featured: data.featured || false
      });

      await guide.save();
      return guide;
    } catch (error) {
      throw new Error(`Failed to create plant care guide: ${error.message}`);
    }
  }

  // Get localized content based on user's preferred language
  static getLocalizedContent(document: any, language: 'en' | 'mm' = 'en') {
    const localized = JSON.parse(JSON.stringify(document));
    
    // Recursively process multilingual fields
    const processField = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(item => processField(item));
      }
      
      if (obj && typeof obj === 'object') {
        // If it's a multilingual object, extract the requested language
        if (obj.en && obj.mm) {
          return MultilingualUtils.getText(obj, language);
        }
        
        // Otherwise, process nested objects
        const processed: any = {};
        for (const [key, value] of Object.entries(obj)) {
          processed[key] = processField(value);
        }
        return processed;
      }
      
      return obj;
    };
    
    return processField(localized);
  }

  // Search diseases in multiple languages
  static async searchDiseases(query: string, language: 'en' | 'mm' = 'en') {
    try {
      const searchFields = [
        { [`name.${language}`]: new RegExp(query, 'i') },
        { [`description.${language}`]: new RegExp(query, 'i') },
        { [`symptoms.${language}`]: new RegExp(query, 'i') }
      ];

      // Also search in the other language as fallback
      const fallbackLang = language === 'en' ? 'mm' : 'en';
      searchFields.push(
        { [`name.${fallbackLang}`]: new RegExp(query, 'i') },
        { [`description.${fallbackLang}`]: new RegExp(query, 'i') }
      );

      const diseases = await PlantDisease.find({
        $or: searchFields,
        isActive: true
      }).limit(20);

      return diseases;
    } catch (error) {
      throw new Error(`Failed to search diseases: ${error.message}`);
    }
  }

  // Search plant care guides with multilingual support
  static async searchPlantGuides(query: string, language: 'en' | 'mm' = 'en', filters: any = {}) {
    try {
      const searchConditions: any = {
        $or: [
          { [`plantName.${language}`]: new RegExp(query, 'i') },
          { [`description.${language}`]: new RegExp(query, 'i') },
          { [`plantType.${language}`]: new RegExp(query, 'i') }
        ],
        isActive: true
      };

      // Add filters
      if (filters.difficulty) {
        searchConditions.difficulty = filters.difficulty;
      }
      if (filters.featured !== undefined) {
        searchConditions.featured = filters.featured;
      }
      if (filters.plantType) {
        searchConditions.$or.push(
          { [`plantType.${language}`]: new RegExp(filters.plantType, 'i') }
        );
      }

      const guides = await PlantCareGuide.find(searchConditions)
        .sort({ views: -1, 'ratings.average': -1 })
        .limit(20);

      return guides;
    } catch (error) {
      throw new Error(`Failed to search plant guides: ${error.message}`);
    }
  }

  // Update existing data to add translations
  static async addTranslation(
    model: 'PlantDisease' | 'PlantCareGuide',
    id: string,
    field: string,
    translations: { en?: string; mm?: string }
  ) {
    try {
      const Model = model === 'PlantDisease' ? PlantDisease : PlantCareGuide;
      const document = await Model.findById(id);
      
      if (!document) {
        throw new Error('Document not found');
      }

      // Update the specific field with new translations
      const currentValue = document[field];
      const updatedValue = {
        en: translations.en || (typeof currentValue === 'string' ? currentValue : currentValue?.en),
        mm: translations.mm || (typeof currentValue === 'string' ? currentValue : currentValue?.mm)
      };

      document[field] = updatedValue;
      await document.save();

      return document;
    } catch (error) {
      throw new Error(`Failed to add translation: ${error.message}`);
    }
  }

  // Batch update multiple documents with translations
  static async batchAddTranslations(
    model: 'PlantDisease' | 'PlantCareGuide',
    updates: Array<{
      id: string;
      translations: { [field: string]: { en?: string; mm?: string } }
    }>
  ) {
    try {
      const Model = model === 'PlantDisease' ? PlantDisease : PlantCareGuide;
      const results = [];

      for (const update of updates) {
        const document = await Model.findById(update.id);
        if (document) {
          // Update multiple fields at once
          for (const [field, translations] of Object.entries(update.translations)) {
            const currentValue = document[field];
            document[field] = {
              en: translations.en || (typeof currentValue === 'string' ? currentValue : currentValue?.en),
              mm: translations.mm || (typeof currentValue === 'string' ? currentValue : currentValue?.mm)
            };
          }
          
          await document.save();
          results.push(document);
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Failed to batch add translations: ${error.message}`);
    }
  }

  // Validate multilingual input data
  static validateMultilingualData(data: any, requiredFields: string[]) {
    const errors: string[] = [];
    
    for (const field of requiredFields) {
      const value = data[field];
      
      if (!value) {
        errors.push(`${field} is required`);
        continue;
      }

      // Check if it's a valid string or multilingual object
      if (typeof value === 'string') {
        if (value.trim().length === 0) {
          errors.push(`${field} cannot be empty`);
        }
      } else if (typeof value === 'object' && value !== null) {
        if (!value.en || typeof value.en !== 'string' || value.en.trim().length === 0) {
          errors.push(`${field}.en is required and cannot be empty`);
        }
        if (!value.mm || typeof value.mm !== 'string' || value.mm.trim().length === 0) {
          errors.push(`${field}.mm is required and cannot be empty`);
        }
      } else {
        errors.push(`${field} must be a string or object with en and mm properties`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get statistics about multilingual content
  static async getMultilingualStats(model: 'PlantDisease' | 'PlantCareGuide') {
    try {
      const Model = model === 'PlantDisease' ? PlantDisease : PlantCareGuide;
      const total = await Model.countDocuments({ isActive: true });
      
      // Count documents where Myanmar translation exists and is different from English
      const fullyTranslated = await Model.countDocuments({
        isActive: true,
        'name.en': { $exists: true, $ne: null },
        'name.mm': { $exists: true, $ne: null },
        $expr: { $ne: ['$name.en', '$name.mm'] }
      });

      const translationPercentage = total > 0 ? (fullyTranslated / total * 100).toFixed(2) : 0;

      return {
        total,
        fullyTranslated,
        needsTranslation: total - fullyTranslated,
        translationPercentage: `${translationPercentage}%`
      };
    } catch (error) {
      throw new Error(`Failed to get multilingual stats: ${error.message}`);
    }
  }
}

// Export utility functions for direct use
export {
  MultilingualUtils,
  normalizeMultilingualText,
  getLocalizedText
} from '../models/flexibleMultilingualModels';
