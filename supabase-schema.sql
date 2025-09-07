-- NutriGenius Database Schema for Supabase
-- This file contains all the necessary tables and functions for the NutriGenius app

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    onchain_address TEXT UNIQUE,
    email TEXT,
    health_goals TEXT[] DEFAULT '{}',
    dietary_restrictions TEXT[] DEFAULT '{}',
    allergies TEXT[] DEFAULT '{}',
    cuisine_preferences TEXT[] DEFAULT '{}',
    cooking_skill TEXT CHECK (cooking_skill IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    time_available INTEGER DEFAULT 30, -- minutes per meal prep
    budget_level TEXT CHECK (budget_level IN ('low', 'medium', 'high')) DEFAULT 'medium',
    calorie_target INTEGER,
    macro_targets JSONB DEFAULT '{}',
    stripe_customer_id TEXT,
    subscription_status TEXT DEFAULT 'free',
    subscription_id TEXT,
    subscription_current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ DEFAULT NOW()
);

-- Daily logs table
CREATE TABLE IF NOT EXISTS daily_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    food_items JSONB DEFAULT '[]',
    total_nutrition JSONB DEFAULT '{}',
    logged_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date, meal_type)
);

-- Meal suggestions table
CREATE TABLE IF NOT EXISTS meal_suggestions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    meal_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    ingredients TEXT[] DEFAULT '{}',
    instructions TEXT[] DEFAULT '{}',
    nutritional_info JSONB DEFAULT '{}',
    dietary_tags TEXT[] DEFAULT '{}',
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    prep_time INTEGER DEFAULT 30,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
    date DATE NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meal feedback table
CREATE TABLE IF NOT EXISTS meal_feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    meal_id TEXT NOT NULL,
    feedback_type TEXT CHECK (feedback_type IN ('like', 'dislike', 'made', 'skipped')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, meal_id)
);

-- Nutrition insights table
CREATE TABLE IF NOT EXISTS nutrition_insights (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    insight_text TEXT NOT NULL,
    current_nutrition JSONB DEFAULT '{}',
    target_nutrition JSONB DEFAULT '{}',
    timeframe TEXT DEFAULT 'daily',
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment logs table
CREATE TABLE IF NOT EXISTS payment_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stripe_invoice_id TEXT,
    amount INTEGER, -- in cents
    currency TEXT DEFAULT 'usd',
    status TEXT CHECK (status IN ('succeeded', 'failed', 'pending')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Food items table (for future food database)
CREATE TABLE IF NOT EXISTS food_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    food_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    nutritional_info JSONB DEFAULT '{}',
    dietary_tags TEXT[] DEFAULT '{}',
    category TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_onchain_address ON users(onchain_address);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON daily_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_meal_suggestions_user_date ON meal_suggestions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_meal_feedback_user_meal ON meal_feedback(user_id, meal_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_insights_user ON nutrition_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_user ON payment_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_food_items_food_id ON food_items(food_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_logs_updated_at BEFORE UPDATE ON daily_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_feedback_updated_at BEFORE UPDATE ON meal_feedback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_food_items_updated_at BEFORE UPDATE ON food_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text OR onchain_address = auth.jwt() ->> 'wallet_address');

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text OR onchain_address = auth.jwt() ->> 'wallet_address');

-- Daily logs policies
CREATE POLICY "Users can view own daily logs" ON daily_logs
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own daily logs" ON daily_logs
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own daily logs" ON daily_logs
    FOR UPDATE USING (user_id = auth.uid());

-- Meal suggestions policies
CREATE POLICY "Users can view own meal suggestions" ON meal_suggestions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own meal suggestions" ON meal_suggestions
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Meal feedback policies
CREATE POLICY "Users can view own meal feedback" ON meal_feedback
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own meal feedback" ON meal_feedback
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own meal feedback" ON meal_feedback
    FOR UPDATE USING (user_id = auth.uid());

-- Nutrition insights policies
CREATE POLICY "Users can view own nutrition insights" ON nutrition_insights
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own nutrition insights" ON nutrition_insights
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Payment logs policies
CREATE POLICY "Users can view own payment logs" ON payment_logs
    FOR SELECT USING (user_id = auth.uid());

-- Food items are public (read-only for users)
CREATE POLICY "Anyone can view food items" ON food_items
    FOR SELECT USING (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
