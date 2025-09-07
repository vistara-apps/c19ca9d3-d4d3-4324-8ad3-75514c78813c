import { UserPreferences, MealSuggestion, ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}/api${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Authentication
  async authenticateUser(walletAddress: string, userData?: any) {
    return this.request<any>('/auth', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, userData }),
    });
  }

  async getUser(walletAddress: string) {
    return this.request<any>(`/auth?address=${encodeURIComponent(walletAddress)}`);
  }

  // Meal Generation
  async generateMeals(
    userPreferences: UserPreferences,
    userId?: string,
    mealTypes?: string[]
  ) {
    return this.request<MealSuggestion[]>('/meals/generate', {
      method: 'POST',
      body: JSON.stringify({ userPreferences, userId, mealTypes }),
    });
  }

  async getMealSuggestions(userId: string, date?: string) {
    const params = new URLSearchParams({ userId });
    if (date) params.append('date', date);
    
    return this.request<MealSuggestion[]>(`/meals/generate?${params}`);
  }

  // Meal Feedback
  async submitMealFeedback(
    userId: string,
    mealId: string,
    feedback: 'like' | 'dislike' | 'made' | 'skipped',
    rating?: number,
    notes?: string
  ) {
    return this.request<any>('/meals/feedback', {
      method: 'POST',
      body: JSON.stringify({ userId, mealId, feedback, rating, notes }),
    });
  }

  async getMealFeedback(userId: string, mealId?: string) {
    const params = new URLSearchParams({ userId });
    if (mealId) params.append('mealId', mealId);
    
    return this.request<any[]>(`/meals/feedback?${params}`);
  }

  // Nutrition Logging
  async logNutrition(
    userId: string,
    date: string,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    foodItems: any[],
    totalNutrition: any
  ) {
    return this.request<any>('/nutrition/log', {
      method: 'POST',
      body: JSON.stringify({ userId, date, mealType, foodItems, totalNutrition }),
    });
  }

  async getNutritionLogs(
    userId: string,
    date?: string,
    startDate?: string,
    endDate?: string
  ) {
    const params = new URLSearchParams({ userId });
    if (date) params.append('date', date);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    return this.request<any>(`/nutrition/log?${params}`);
  }

  // Nutrition Insights
  async generateNutritionInsight(
    userId: string,
    currentNutrition: any,
    targetNutrition: any,
    timeframe?: string
  ) {
    return this.request<{ insight: string; id: string }>('/nutrition/insights', {
      method: 'POST',
      body: JSON.stringify({ userId, currentNutrition, targetNutrition, timeframe }),
    });
  }

  async getNutritionInsights(userId: string, limit?: number) {
    const params = new URLSearchParams({ userId });
    if (limit) params.append('limit', limit.toString());
    
    return this.request<any[]>(`/nutrition/insights?${params}`);
  }

  // Subscription Management
  async createSubscription(userId: string, priceId: string, walletAddress?: string) {
    return this.request<{ sessionId: string; url: string }>('/subscription/create', {
      method: 'POST',
      body: JSON.stringify({ userId, priceId, walletAddress }),
    });
  }

  async getSubscriptionStatus(userId: string) {
    return this.request<{ subscriptions: any[]; hasActiveSubscription: boolean }>(
      `/subscription/create?userId=${encodeURIComponent(userId)}`
    );
  }
}

export const apiClient = new ApiClient();

// Utility functions for common operations
export const nutritionUtils = {
  calculateDailyTotals: (logs: any[]) => {
    return logs.reduce(
      (totals, log) => {
        const nutrition = log.total_nutrition || {};
        return {
          calories: totals.calories + (nutrition.calories || 0),
          protein: totals.protein + (nutrition.protein || 0),
          carbs: totals.carbs + (nutrition.carbs || 0),
          fat: totals.fat + (nutrition.fat || 0),
          fiber: totals.fiber + (nutrition.fiber || 0),
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  },

  calculateProgress: (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  },

  getMacroPercentages: (nutrition: any) => {
    const { protein, carbs, fat } = nutrition;
    const proteinCals = protein * 4;
    const carbsCals = carbs * 4;
    const fatCals = fat * 9;
    const totalCals = proteinCals + carbsCals + fatCals;

    if (totalCals === 0) return { protein: 0, carbs: 0, fat: 0 };

    return {
      protein: Math.round((proteinCals / totalCals) * 100),
      carbs: Math.round((carbsCals / totalCals) * 100),
      fat: Math.round((fatCals / totalCals) * 100),
    };
  },
};

// Error handling utilities
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any) => {
  if (error instanceof ApiError) {
    return error;
  }
  
  if (error.response) {
    return new ApiError(
      error.response.data?.message || 'API request failed',
      error.response.status,
      error.response.data?.code
    );
  }
  
  return new ApiError(error.message || 'Unknown error occurred');
};
