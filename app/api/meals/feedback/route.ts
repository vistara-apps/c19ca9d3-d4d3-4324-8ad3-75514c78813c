import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, mealId, feedback, rating, notes } = await request.json();

    if (!userId || !mealId || !feedback) {
      return NextResponse.json(
        { error: 'User ID, meal ID, and feedback are required' },
        { status: 400 }
      );
    }

    // Check if feedback already exists
    const { data: existingFeedback, error: fetchError } = await supabase
      .from('meal_feedback')
      .select('id')
      .eq('user_id', userId)
      .eq('meal_id', mealId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    const feedbackData = {
      user_id: userId,
      meal_id: mealId,
      feedback_type: feedback, // 'like', 'dislike', 'made', 'skipped'
      rating: rating || null,
      notes: notes || null,
      created_at: new Date().toISOString(),
    };

    if (existingFeedback) {
      // Update existing feedback
      const { data, error } = await supabase
        .from('meal_feedback')
        .update({
          ...feedbackData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingFeedback.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data,
        message: 'Feedback updated successfully',
      });
    } else {
      // Create new feedback
      const { data, error } = await supabase
        .from('meal_feedback')
        .insert(feedbackData)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data,
        message: 'Feedback saved successfully',
      });
    }
  } catch (error) {
    console.error('Error saving meal feedback:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const mealId = searchParams.get('mealId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('meal_feedback')
      .select('*')
      .eq('user_id', userId);

    if (mealId) {
      query = query.eq('meal_id', mealId);
    }

    const { data: feedback, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error('Error fetching meal feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}
