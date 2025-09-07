import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateNutritionInsight } from '@/lib/ai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, date, mealType, foodItems, totalNutrition } = await request.json();

    if (!userId || !date || !mealType || !foodItems) {
      return NextResponse.json(
        { error: 'User ID, date, meal type, and food items are required' },
        { status: 400 }
      );
    }

    // Check if log entry already exists for this user, date, and meal type
    const { data: existingLog, error: fetchError } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .eq('meal_type', mealType)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    const logData = {
      user_id: userId,
      date,
      meal_type: mealType,
      food_items: foodItems,
      total_nutrition: totalNutrition,
      logged_at: new Date().toISOString(),
    };

    if (existingLog) {
      // Update existing log
      const { data, error } = await supabase
        .from('daily_logs')
        .update({
          ...logData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingLog.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data,
        message: 'Nutrition log updated successfully',
      });
    } else {
      // Create new log
      const { data, error } = await supabase
        .from('daily_logs')
        .insert(logData)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data,
        message: 'Nutrition log saved successfully',
      });
    }
  } catch (error) {
    console.error('Error saving nutrition log:', error);
    return NextResponse.json(
      { error: 'Failed to save nutrition log' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', userId);

    if (date) {
      query = query.eq('date', date);
    } else if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    } else {
      // Default to last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query = query.gte('date', sevenDaysAgo.toISOString().split('T')[0]);
    }

    const { data: logs, error } = await query.order('date', { ascending: false });

    if (error) throw error;

    // Calculate daily totals
    const dailyTotals = logs.reduce((acc: any, log: any) => {
      const date = log.date;
      if (!acc[date]) {
        acc[date] = {
          date,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          meals: [],
        };
      }

      const nutrition = log.total_nutrition || {};
      acc[date].calories += nutrition.calories || 0;
      acc[date].protein += nutrition.protein || 0;
      acc[date].carbs += nutrition.carbs || 0;
      acc[date].fat += nutrition.fat || 0;
      acc[date].fiber += nutrition.fiber || 0;
      acc[date].meals.push(log);

      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        logs,
        dailyTotals: Object.values(dailyTotals),
      },
    });
  } catch (error) {
    console.error('Error fetching nutrition logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nutrition logs' },
      { status: 500 }
    );
  }
}
