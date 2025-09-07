import { NextRequest, NextResponse } from 'next/server';
import { generateMealSuggestions } from '@/lib/ai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userPreferences, userId, mealTypes } = await request.json();

    if (!userPreferences) {
      return NextResponse.json(
        { error: 'User preferences are required' },
        { status: 400 }
      );
    }

    // Generate meal suggestions using AI
    const suggestions = await generateMealSuggestions(
      userPreferences,
      mealTypes || ['breakfast', 'lunch', 'dinner']
    );

    // Save suggestions to database if userId is provided
    if (userId && suggestions.length > 0) {
      const mealData = suggestions.map(suggestion => ({
        user_id: userId,
        meal_id: suggestion.id,
        name: suggestion.name,
        description: suggestion.description,
        ingredients: suggestion.ingredients,
        instructions: suggestion.instructions,
        nutritional_info: suggestion.nutritionalInfo,
        dietary_tags: suggestion.dietaryTags,
        meal_type: suggestion.mealType,
        prep_time: suggestion.prepTime,
        difficulty: suggestion.difficulty,
        generated_at: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0], // Today's date
      }));

      const { error: insertError } = await supabase
        .from('meal_suggestions')
        .insert(mealData);

      if (insertError) {
        console.error('Error saving meal suggestions:', insertError);
        // Don't fail the request if saving fails
      }
    }

    return NextResponse.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error('Error generating meals:', error);
    return NextResponse.json(
      { error: 'Failed to generate meal suggestions' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data: suggestions, error } = await supabase
      .from('meal_suggestions')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform database format back to MealSuggestion format
    const transformedSuggestions = suggestions.map(suggestion => ({
      id: suggestion.meal_id,
      name: suggestion.name,
      description: suggestion.description,
      ingredients: suggestion.ingredients,
      instructions: suggestion.instructions,
      nutritionalInfo: suggestion.nutritional_info,
      dietaryTags: suggestion.dietary_tags,
      mealType: suggestion.meal_type,
      prepTime: suggestion.prep_time,
      difficulty: suggestion.difficulty,
    }));

    return NextResponse.json({
      success: true,
      data: transformedSuggestions,
    });
  } catch (error) {
    console.error('Error fetching meal suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meal suggestions' },
      { status: 500 }
    );
  }
}
