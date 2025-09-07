import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateNutritionInsight } from '@/lib/ai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, currentNutrition, targetNutrition, timeframe } = await request.json();

    if (!userId || !currentNutrition || !targetNutrition) {
      return NextResponse.json(
        { error: 'User ID, current nutrition, and target nutrition are required' },
        { status: 400 }
      );
    }

    // Generate AI insight
    const insight = await generateNutritionInsight(currentNutrition, targetNutrition);

    // Save insight to database
    const { data, error } = await supabase
      .from('nutrition_insights')
      .insert({
        user_id: userId,
        insight_text: insight,
        current_nutrition: currentNutrition,
        target_nutrition: targetNutrition,
        timeframe: timeframe || 'daily',
        generated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: {
        insight,
        id: data.id,
      },
    });
  } catch (error) {
    console.error('Error generating nutrition insight:', error);
    return NextResponse.json(
      { error: 'Failed to generate nutrition insight' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data: insights, error } = await supabase
      .from('nutrition_insights')
      .select('*')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error('Error fetching nutrition insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nutrition insights' },
      { status: 500 }
    );
  }
}
