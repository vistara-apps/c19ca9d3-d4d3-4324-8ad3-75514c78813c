import OpenAI from 'openai';
import { MealSuggestion, UserPreferences } from './types';
import { generateMealPlanPrompt } from './utils';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function generateMealSuggestions(
  preferences: UserPreferences,
  mealTypes: string[] = ['breakfast', 'lunch', 'dinner']
): Promise<MealSuggestion[]> {
  try {
    const suggestions: MealSuggestion[] = [];

    for (const mealType of mealTypes) {
      const prompt = generateMealPlanPrompt(preferences, mealType);
      
      const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: 'You are a professional nutritionist and chef. Generate healthy, practical meal suggestions that strictly adhere to the user\'s dietary restrictions and health goals. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        try {
          const mealData = JSON.parse(response);
          const suggestion: MealSuggestion = {
            id: `${mealType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: mealData.name,
            description: mealData.description,
            ingredients: mealData.ingredients || [],
            instructions: mealData.instructions || [],
            nutritionalInfo: mealData.nutritionalInfo || {
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0
            },
            dietaryTags: mealData.dietaryTags || [],
            mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
            prepTime: mealData.prepTime || 30,
            difficulty: mealData.difficulty || 'medium'
          };
          suggestions.push(suggestion);
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
          // Fallback suggestion
          suggestions.push(createFallbackSuggestion(mealType as any));
        }
      }
    }

    return suggestions;
  } catch (error) {
    console.error('Error generating meal suggestions:', error);
    // Return fallback suggestions
    return mealTypes.map(mealType => createFallbackSuggestion(mealType as any));
  }
}

function createFallbackSuggestion(mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'): MealSuggestion {
  const fallbacks = {
    breakfast: {
      name: 'Overnight Oats with Berries',
      description: 'Creamy overnight oats topped with fresh berries and nuts',
      ingredients: ['1/2 cup rolled oats', '1/2 cup milk', '1 tbsp chia seeds', '1/2 cup mixed berries', '1 tbsp honey'],
      instructions: ['Mix oats, milk, and chia seeds', 'Refrigerate overnight', 'Top with berries and honey'],
      nutritionalInfo: { calories: 320, protein: 12, carbs: 45, fat: 8 },
      prepTime: 5,
      difficulty: 'easy' as const
    },
    lunch: {
      name: 'Mediterranean Bowl',
      description: 'Fresh Mediterranean-inspired bowl with quinoa and vegetables',
      ingredients: ['1 cup cooked quinoa', '1/2 cup chickpeas', '1/4 cup feta cheese', 'Mixed greens', 'Olive oil'],
      instructions: ['Cook quinoa', 'Combine all ingredients', 'Drizzle with olive oil'],
      nutritionalInfo: { calories: 420, protein: 18, carbs: 52, fat: 14 },
      prepTime: 15,
      difficulty: 'easy' as const
    },
    dinner: {
      name: 'Grilled Chicken with Vegetables',
      description: 'Lean grilled chicken breast with roasted seasonal vegetables',
      ingredients: ['6oz chicken breast', '2 cups mixed vegetables', '1 tbsp olive oil', 'Herbs and spices'],
      instructions: ['Season and grill chicken', 'Roast vegetables with olive oil', 'Serve together'],
      nutritionalInfo: { calories: 380, protein: 35, carbs: 20, fat: 12 },
      prepTime: 25,
      difficulty: 'medium' as const
    },
    snack: {
      name: 'Greek Yogurt with Nuts',
      description: 'Protein-rich Greek yogurt topped with mixed nuts',
      ingredients: ['1 cup Greek yogurt', '1 oz mixed nuts', '1 tsp honey'],
      instructions: ['Top yogurt with nuts', 'Drizzle with honey'],
      nutritionalInfo: { calories: 220, protein: 15, carbs: 12, fat: 12 },
      prepTime: 2,
      difficulty: 'easy' as const
    }
  };

  const fallback = fallbacks[mealType];
  return {
    id: `fallback-${mealType}-${Date.now()}`,
    mealType,
    dietaryTags: [],
    ...fallback
  };
}

export async function generateNutritionInsight(
  currentNutrition: any,
  targetNutrition: any
): Promise<string> {
  try {
    const prompt = `Based on the following nutrition data, provide a brief insight and recommendation:

Current intake: ${JSON.stringify(currentNutrition)}
Target intake: ${JSON.stringify(targetNutrition)}

Provide a concise, encouraging insight about their progress and one specific recommendation for improvement.`;

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are a supportive nutritionist. Provide brief, actionable insights that motivate users.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return completion.choices[0]?.message?.content || 'Keep up the great work with your nutrition goals!';
  } catch (error) {
    console.error('Error generating nutrition insight:', error);
    return 'Keep tracking your nutrition to stay on track with your health goals!';
  }
}
