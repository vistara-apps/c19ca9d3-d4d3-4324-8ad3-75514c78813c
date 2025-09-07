'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { AppShell } from '@/components/AppShell';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { DashboardStats } from '@/components/DashboardStats';
import { MealCard } from '@/components/MealCard';
import { NutritionChart } from '@/components/NutritionChart';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { UserPreferences, MealSuggestion } from '@/lib/types';
import { generateMealSuggestions, generateNutritionInsight } from '@/lib/ai';
import { Sparkles, RefreshCw, Calendar, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [mealSuggestions, setMealSuggestions] = useState<MealSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nutritionInsight, setNutritionInsight] = useState<string>('');

  // Mock stats data
  const [stats] = useState({
    caloriesConsumed: 1240,
    caloriesTarget: 2000,
    proteinConsumed: 85,
    proteinTarget: 120,
    mealsLogged: 2,
    streakDays: 7
  });

  // Mock nutrition data for charts
  const nutritionData = [
    { name: 'Protein', current: 85, target: 120, unit: 'g' },
    { name: 'Carbs', current: 150, target: 200, unit: 'g' },
    { name: 'Fat', current: 45, target: 65, unit: 'g' },
    { name: 'Fiber', current: 18, target: 25, unit: 'g' }
  ];

  const macroData = [
    { name: 'Protein', current: 85 },
    { name: 'Carbs', current: 150 },
    { name: 'Fat', current: 45 }
  ];

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  useEffect(() => {
    // Check if user has completed onboarding
    const savedPreferences = localStorage.getItem('nutrigenius-preferences');
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      setUserPreferences(preferences);
      setIsOnboarded(true);
      loadMealSuggestions(preferences);
    }
  }, []);

  const handleOnboardingComplete = async (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    setIsOnboarded(true);
    localStorage.setItem('nutrigenius-preferences', JSON.stringify(preferences));
    await loadMealSuggestions(preferences);
  };

  const loadMealSuggestions = async (preferences: UserPreferences) => {
    setIsLoading(true);
    try {
      const suggestions = await generateMealSuggestions(preferences);
      setMealSuggestions(suggestions);
      
      // Generate nutrition insight
      const insight = await generateNutritionInsight(
        { calories: stats.caloriesConsumed, protein: stats.proteinConsumed },
        { calories: stats.caloriesTarget, protein: stats.proteinTarget }
      );
      setNutritionInsight(insight);
    } catch (error) {
      console.error('Error loading meal suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshMeals = async () => {
    if (userPreferences) {
      await loadMealSuggestions(userPreferences);
    }
  };

  const handleMealFeedback = (mealId: string, feedback: 'like' | 'dislike') => {
    console.log(`Meal ${mealId} feedback: ${feedback}`);
    // Here you would typically save the feedback to your backend
  };

  const handleMakeMeal = (mealId: string) => {
    console.log(`User wants to make meal: ${mealId}`);
    // Here you would typically log the meal or add it to their plan
  };

  if (!isOnboarded) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Welcome to NutriGenius
            </h1>
            <p className="text-xl text-text-secondary">
              Your personalized daily food guide for health & goals
            </p>
          </div>
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-text-primary">
            Good morning! Ready for another healthy day?
          </h1>
          <p className="text-text-secondary">
            Here are your personalized meal recommendations for today
          </p>
        </div>

        {/* Stats Dashboard */}
        <DashboardStats stats={stats} />

        {/* AI Insight */}
        {nutritionInsight && (
          <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-2">AI Nutrition Insight</h3>
                <p className="text-text-secondary leading-relaxed">{nutritionInsight}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Meal Suggestions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text-primary flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-accent" />
              <span>Today's Meal Plan</span>
            </h2>
            <Button
              variant="secondary"
              onClick={handleRefreshMeals}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="space-y-4">
                    <div className="h-6 bg-surface/60 rounded w-3/4"></div>
                    <div className="h-4 bg-surface/60 rounded w-full"></div>
                    <div className="h-4 bg-surface/60 rounded w-2/3"></div>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="h-12 bg-surface/60 rounded"></div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mealSuggestions.map((meal) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onLike={(id) => handleMealFeedback(id, 'like')}
                  onDislike={(id) => handleMealFeedback(id, 'dislike')}
                  onMakeMeal={handleMakeMeal}
                />
              ))}
            </div>
          )}
        </div>

        {/* Nutrition Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NutritionChart
            data={nutritionData}
            type="bar"
            title="Daily Nutrition Progress"
          />
          <NutritionChart
            data={macroData}
            type="pie"
            title="Macronutrient Breakdown"
          />
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Ready to level up your nutrition?
              </h3>
              <p className="text-text-secondary">
                Get premium features like advanced meal planning and detailed nutrient tracking
              </p>
            </div>
            <Button variant="primary" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Upgrade to Pro</span>
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
