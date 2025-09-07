import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NutrientInfo, UserPreferences } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateCalorieNeeds(
  age: number,
  gender: 'male' | 'female',
  weight: number, // kg
  height: number, // cm
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
  goal: string
): number {
  // Mifflin-St Jeor Equation
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  const tdee = bmr * activityMultipliers[activityLevel];

  // Adjust for goals
  switch (goal) {
    case 'Weight Loss':
      return Math.round(tdee * 0.8); // 20% deficit
    case 'Weight Gain':
      return Math.round(tdee * 1.15); // 15% surplus
    case 'Muscle Building':
      return Math.round(tdee * 1.1); // 10% surplus
    default:
      return Math.round(tdee);
  }
}

export function calculateMacros(calories: number, goal: string) {
  const ratios = {
    'Weight Loss': { protein: 0.3, carbs: 0.35, fat: 0.35 },
    'Weight Gain': { protein: 0.25, carbs: 0.45, fat: 0.3 },
    'Muscle Building': { protein: 0.35, carbs: 0.4, fat: 0.25 },
    'Maintenance': { protein: 0.25, carbs: 0.45, fat: 0.3 },
    'Athletic Performance': { protein: 0.2, carbs: 0.55, fat: 0.25 },
    'Heart Health': { protein: 0.2, carbs: 0.5, fat: 0.3 },
    'Diabetes Management': { protein: 0.25, carbs: 0.4, fat: 0.35 },
    'General Wellness': { protein: 0.2, carbs: 0.5, fat: 0.3 }
  };

  const ratio = ratios[goal as keyof typeof ratios] || ratios['General Wellness'];

  return {
    protein: Math.round((calories * ratio.protein) / 4), // 4 cal/g
    carbs: Math.round((calories * ratio.carbs) / 4), // 4 cal/g
    fat: Math.round((calories * ratio.fat) / 9) // 9 cal/g
  };
}

export function formatNutrientInfo(nutrients: NutrientInfo): string {
  return `${nutrients.calories} cal | ${nutrients.protein}g protein | ${nutrients.carbs}g carbs | ${nutrients.fat}g fat`;
}

export function checkDietaryCompatibility(
  foodTags: string[],
  restrictions: string[]
): { compatible: boolean; violations: string[] } {
  const violations: string[] = [];
  
  restrictions.forEach(restriction => {
    switch (restriction.toLowerCase()) {
      case 'vegetarian':
        if (foodTags.some(tag => ['meat', 'poultry', 'fish', 'seafood'].includes(tag.toLowerCase()))) {
          violations.push('Contains meat/fish');
        }
        break;
      case 'vegan':
        if (foodTags.some(tag => ['meat', 'poultry', 'fish', 'seafood', 'dairy', 'eggs'].includes(tag.toLowerCase()))) {
          violations.push('Contains animal products');
        }
        break;
      case 'gluten-free':
        if (foodTags.some(tag => ['wheat', 'gluten', 'barley', 'rye'].includes(tag.toLowerCase()))) {
          violations.push('Contains gluten');
        }
        break;
      case 'dairy-free':
        if (foodTags.some(tag => ['dairy', 'milk', 'cheese', 'yogurt'].includes(tag.toLowerCase()))) {
          violations.push('Contains dairy');
        }
        break;
      case 'keto':
        // Simplified keto check - would need actual carb content
        if (foodTags.some(tag => ['high-carb', 'sugar', 'grains'].includes(tag.toLowerCase()))) {
          violations.push('High in carbs');
        }
        break;
    }
  });

  return {
    compatible: violations.length === 0,
    violations
  };
}

export function generateMealPlanPrompt(preferences: UserPreferences, mealType: string): string {
  return `Generate a personalized ${mealType} meal suggestion for someone with the following preferences:

Health Goals: ${preferences.healthGoals.join(', ')}
Dietary Restrictions: ${preferences.dietaryRestrictions.join(', ')}
Allergies: ${preferences.allergies.join(', ')}
Cuisine Preferences: ${preferences.cuisinePreferences.join(', ')}
Cooking Skill: ${preferences.cookingSkill}
Time Available: ${preferences.timeAvailable} minutes
Budget Level: ${preferences.budgetLevel}

Please provide:
1. Meal name
2. Brief description
3. Ingredients list
4. Simple cooking instructions
5. Estimated nutritional information (calories, protein, carbs, fat)
6. Prep time
7. Difficulty level

Format the response as JSON with the following structure:
{
  "name": "Meal Name",
  "description": "Brief description",
  "ingredients": ["ingredient1", "ingredient2"],
  "instructions": ["step1", "step2"],
  "nutritionalInfo": {
    "calories": 400,
    "protein": 25,
    "carbs": 30,
    "fat": 15
  },
  "prepTime": 20,
  "difficulty": "easy",
  "dietaryTags": ["vegetarian", "gluten-free"]
}`;
}

export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return 'text-green-400';
    case 'medium':
      return 'text-yellow-400';
    case 'hard':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
}

export function getMealTypeIcon(mealType: string): string {
  switch (mealType) {
    case 'breakfast':
      return '🌅';
    case 'lunch':
      return '☀️';
    case 'dinner':
      return '🌙';
    case 'snack':
      return '🍎';
    default:
      return '🍽️';
  }
}
