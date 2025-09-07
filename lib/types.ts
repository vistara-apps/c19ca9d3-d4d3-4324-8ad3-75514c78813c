export interface User {
  userId: string;
  healthGoals: string[];
  dietaryRestrictions: string[];
  preferences: string[];
  onchainAddress?: string;
  calorieTarget?: number;
  macroTargets?: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface DailyLog {
  logId: string;
  userId: string;
  date: string;
  mealsConsumed: MealItem[];
  nutrientsTracked: NutrientInfo;
  feedback?: string;
}

export interface FoodItem {
  foodId: string;
  name: string;
  nutritionalInfo: NutrientInfo;
  dietaryTags: string[];
  category: string;
  description?: string;
}

export interface NutrientInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface MealItem {
  foodItem: FoodItem;
  quantity: number;
  unit: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface MealSuggestion {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  nutritionalInfo: NutrientInfo;
  dietaryTags: string[];
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface UserPreferences {
  healthGoals: string[];
  dietaryRestrictions: string[];
  allergies: string[];
  cuisinePreferences: string[];
  cookingSkill: 'beginner' | 'intermediate' | 'advanced';
  timeAvailable: number; // minutes per meal prep
  budgetLevel: 'low' | 'medium' | 'high';
}
