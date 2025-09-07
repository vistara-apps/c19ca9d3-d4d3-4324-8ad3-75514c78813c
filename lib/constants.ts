export const HEALTH_GOALS = [
  'Weight Loss',
  'Weight Gain',
  'Muscle Building',
  'Maintenance',
  'Athletic Performance',
  'Heart Health',
  'Diabetes Management',
  'General Wellness'
];

export const DIETARY_RESTRICTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Paleo',
  'Mediterranean',
  'Low-Carb',
  'Low-Fat',
  'High-Protein'
];

export const COMMON_ALLERGIES = [
  'Nuts',
  'Shellfish',
  'Eggs',
  'Dairy',
  'Soy',
  'Wheat',
  'Fish',
  'Sesame'
];

export const CUISINE_TYPES = [
  'American',
  'Italian',
  'Mexican',
  'Asian',
  'Mediterranean',
  'Indian',
  'Middle Eastern',
  'French',
  'Thai',
  'Japanese'
];

export const MEAL_TYPES = [
  'breakfast',
  'lunch', 
  'dinner',
  'snack'
] as const;

export const DIFFICULTY_LEVELS = [
  'easy',
  'medium',
  'hard'
] as const;

export const DEFAULT_MACRO_RATIOS = {
  'Weight Loss': { protein: 30, carbs: 35, fat: 35 },
  'Weight Gain': { protein: 25, carbs: 45, fat: 30 },
  'Muscle Building': { protein: 35, carbs: 40, fat: 25 },
  'Maintenance': { protein: 25, carbs: 45, fat: 30 },
  'Athletic Performance': { protein: 20, carbs: 55, fat: 25 },
  'Heart Health': { protein: 20, carbs: 50, fat: 30 },
  'Diabetes Management': { protein: 25, carbs: 40, fat: 35 },
  'General Wellness': { protein: 20, carbs: 50, fat: 30 }
};
