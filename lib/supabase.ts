import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          onchain_address: string | null;
          email: string | null;
          health_goals: string[];
          dietary_restrictions: string[];
          allergies: string[];
          cuisine_preferences: string[];
          cooking_skill: 'beginner' | 'intermediate' | 'advanced';
          time_available: number;
          budget_level: 'low' | 'medium' | 'high';
          calorie_target: number | null;
          macro_targets: any;
          stripe_customer_id: string | null;
          subscription_status: string;
          subscription_id: string | null;
          subscription_current_period_end: string | null;
          created_at: string;
          updated_at: string;
          last_login: string;
        };
        Insert: {
          id?: string;
          onchain_address?: string | null;
          email?: string | null;
          health_goals?: string[];
          dietary_restrictions?: string[];
          allergies?: string[];
          cuisine_preferences?: string[];
          cooking_skill?: 'beginner' | 'intermediate' | 'advanced';
          time_available?: number;
          budget_level?: 'low' | 'medium' | 'high';
          calorie_target?: number | null;
          macro_targets?: any;
          stripe_customer_id?: string | null;
          subscription_status?: string;
          subscription_id?: string | null;
          subscription_current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
          last_login?: string;
        };
        Update: {
          id?: string;
          onchain_address?: string | null;
          email?: string | null;
          health_goals?: string[];
          dietary_restrictions?: string[];
          allergies?: string[];
          cuisine_preferences?: string[];
          cooking_skill?: 'beginner' | 'intermediate' | 'advanced';
          time_available?: number;
          budget_level?: 'low' | 'medium' | 'high';
          calorie_target?: number | null;
          macro_targets?: any;
          stripe_customer_id?: string | null;
          subscription_status?: string;
          subscription_id?: string | null;
          subscription_current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
          last_login?: string;
        };
      };
      daily_logs: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          food_items: any[];
          total_nutrition: any;
          logged_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          food_items?: any[];
          total_nutrition?: any;
          logged_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          food_items?: any[];
          total_nutrition?: any;
          logged_at?: string;
          updated_at?: string;
        };
      };
      meal_suggestions: {
        Row: {
          id: string;
          user_id: string;
          meal_id: string;
          name: string;
          description: string | null;
          ingredients: string[];
          instructions: string[];
          nutritional_info: any;
          dietary_tags: string[];
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          prep_time: number;
          difficulty: 'easy' | 'medium' | 'hard';
          date: string;
          generated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          meal_id: string;
          name: string;
          description?: string | null;
          ingredients?: string[];
          instructions?: string[];
          nutritional_info?: any;
          dietary_tags?: string[];
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          prep_time?: number;
          difficulty?: 'easy' | 'medium' | 'hard';
          date: string;
          generated_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          meal_id?: string;
          name?: string;
          description?: string | null;
          ingredients?: string[];
          instructions?: string[];
          nutritional_info?: any;
          dietary_tags?: string[];
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          prep_time?: number;
          difficulty?: 'easy' | 'medium' | 'hard';
          date?: string;
          generated_at?: string;
          created_at?: string;
        };
      };
      meal_feedback: {
        Row: {
          id: string;
          user_id: string;
          meal_id: string;
          feedback_type: 'like' | 'dislike' | 'made' | 'skipped';
          rating: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          meal_id: string;
          feedback_type: 'like' | 'dislike' | 'made' | 'skipped';
          rating?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          meal_id?: string;
          feedback_type?: 'like' | 'dislike' | 'made' | 'skipped';
          rating?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      nutrition_insights: {
        Row: {
          id: string;
          user_id: string;
          insight_text: string;
          current_nutrition: any;
          target_nutrition: any;
          timeframe: string;
          generated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          insight_text: string;
          current_nutrition?: any;
          target_nutrition?: any;
          timeframe?: string;
          generated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          insight_text?: string;
          current_nutrition?: any;
          target_nutrition?: any;
          timeframe?: string;
          generated_at?: string;
        };
      };
      payment_logs: {
        Row: {
          id: string;
          user_id: string;
          stripe_invoice_id: string | null;
          amount: number;
          currency: string;
          status: 'succeeded' | 'failed' | 'pending';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_invoice_id?: string | null;
          amount: number;
          currency?: string;
          status: 'succeeded' | 'failed' | 'pending';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_invoice_id?: string | null;
          amount?: number;
          currency?: string;
          status?: 'succeeded' | 'failed' | 'pending';
          created_at?: string;
        };
      };
      food_items: {
        Row: {
          id: string;
          food_id: string;
          name: string;
          nutritional_info: any;
          dietary_tags: string[];
          category: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          food_id: string;
          name: string;
          nutritional_info?: any;
          dietary_tags?: string[];
          category?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          food_id?: string;
          name?: string;
          nutritional_info?: any;
          dietary_tags?: string[];
          category?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
