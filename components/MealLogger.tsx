'use client';

import { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Plus, Minus, Save, Search } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealLoggerProps {
  userId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  onSave: (mealType: string, nutrition: any) => void;
  initialFoods?: FoodItem[];
}

export function MealLogger({ 
  userId, 
  date, 
  mealType, 
  onSave, 
  initialFoods = [] 
}: MealLoggerProps) {
  const [foods, setFoods] = useState<FoodItem[]>(initialFoods);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const addFood = (food: Partial<FoodItem>) => {
    const newFood: FoodItem = {
      id: Date.now().toString(),
      name: food.name || '',
      quantity: food.quantity || 1,
      unit: food.unit || 'serving',
      calories: food.calories || 0,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0,
    };
    setFoods([...foods, newFood]);
  };

  const updateFood = (id: string, updates: Partial<FoodItem>) => {
    setFoods(foods.map(food => 
      food.id === id ? { ...food, ...updates } : food
    ));
  };

  const removeFood = (id: string) => {
    setFoods(foods.filter(food => food.id !== id));
  };

  const calculateTotalNutrition = () => {
    return foods.reduce(
      (totals, food) => ({
        calories: totals.calories + (food.calories * food.quantity),
        protein: totals.protein + (food.protein * food.quantity),
        carbs: totals.carbs + (food.carbs * food.quantity),
        fat: totals.fat + (food.fat * food.quantity),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const totalNutrition = calculateTotalNutrition();
      await apiClient.logNutrition(userId, date, mealType, foods, totalNutrition);
      onSave(mealType, totalNutrition);
    } catch (error) {
      console.error('Error saving meal log:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const searchFoods = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // This would typically call a food database API
      // For now, we'll use mock data
      const mockResults = [
        { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: '100g' },
        { name: 'Brown Rice', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, unit: '100g' },
        { name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, unit: '100g' },
      ].filter(food => 
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error searching foods:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const totalNutrition = calculateTotalNutrition();

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary capitalize">
          {mealType} Log
        </h3>
        <Button
          onClick={handleSave}
          disabled={isSaving || foods.length === 0}
          className="flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save'}</span>
        </Button>
      </div>

      {/* Food Search */}
      <div className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Search for foods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchFoods()}
            className="flex-1"
          />
          <Button
            onClick={searchFoods}
            disabled={isSearching}
            variant="secondary"
            className="flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>{isSearching ? 'Searching...' : 'Search'}</span>
          </Button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-text-secondary">Search Results</h4>
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-surface/50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-text-primary">{result.name}</p>
                  <p className="text-sm text-text-secondary">
                    {result.calories} cal, {result.protein}g protein per {result.unit}
                  </p>
                </div>
                <Button
                  onClick={() => addFood(result)}
                  variant="secondary"
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Added Foods */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-text-secondary">Added Foods</h4>
        {foods.length === 0 ? (
          <p className="text-text-secondary text-center py-8">
            No foods added yet. Search and add foods to log your meal.
          </p>
        ) : (
          <div className="space-y-3">
            {foods.map((food) => (
              <div
                key={food.id}
                className="flex items-center space-x-3 p-3 bg-surface/30 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-text-primary">{food.name}</p>
                  <p className="text-sm text-text-secondary">
                    {(food.calories * food.quantity).toFixed(0)} cal, 
                    {(food.protein * food.quantity).toFixed(1)}g protein
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => updateFood(food.id, { quantity: Math.max(0.1, food.quantity - 0.5) })}
                    variant="secondary"
                    size="sm"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="text-sm font-medium min-w-[3rem] text-center">
                    {food.quantity} {food.unit}
                  </span>
                  <Button
                    onClick={() => updateFood(food.id, { quantity: food.quantity + 0.5 })}
                    variant="secondary"
                    size="sm"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => removeFood(food.id)}
                    variant="secondary"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    ×
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nutrition Summary */}
      {foods.length > 0 && (
        <div className="pt-4 border-t border-surface/50">
          <h4 className="text-sm font-medium text-text-secondary mb-3">Nutrition Summary</h4>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-text-primary">
                {totalNutrition.calories.toFixed(0)}
              </p>
              <p className="text-xs text-text-secondary">Calories</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-text-primary">
                {totalNutrition.protein.toFixed(1)}g
              </p>
              <p className="text-xs text-text-secondary">Protein</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-text-primary">
                {totalNutrition.carbs.toFixed(1)}g
              </p>
              <p className="text-xs text-text-secondary">Carbs</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-text-primary">
                {totalNutrition.fat.toFixed(1)}g
              </p>
              <p className="text-xs text-text-secondary">Fat</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
