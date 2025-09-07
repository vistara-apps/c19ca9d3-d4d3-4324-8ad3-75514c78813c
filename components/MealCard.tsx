'use client';

import { MealSuggestion } from '@/lib/types';
import { Card } from './Card';
import { Tag } from './Tag';
import { Button } from './Button';
import { Clock, ChefHat, Heart, ThumbsUp, ThumbsDown } from 'lucide-react';
import { formatTime, getDifficultyColor, getMealTypeIcon } from '@/lib/utils';

interface MealCardProps {
  meal: MealSuggestion;
  onLike?: (mealId: string) => void;
  onDislike?: (mealId: string) => void;
  onMakeMeal?: (mealId: string) => void;
}

export function MealCard({ meal, onLike, onDislike, onMakeMeal }: MealCardProps) {
  return (
    <Card variant="interactive" className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getMealTypeIcon(meal.mealType)}</span>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{meal.name}</h3>
            <p className="text-sm text-text-secondary capitalize">{meal.mealType}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-text-secondary" />
          <span className="text-sm text-text-secondary">{formatTime(meal.prepTime)}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-text-secondary text-sm leading-relaxed">{meal.description}</p>

      {/* Nutrition Info */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-surface/40 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-semibold text-text-primary">{meal.nutritionalInfo.calories}</div>
          <div className="text-xs text-text-secondary">Calories</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-accent">{meal.nutritionalInfo.protein}g</div>
          <div className="text-xs text-text-secondary">Protein</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-primary">{meal.nutritionalInfo.carbs}g</div>
          <div className="text-xs text-text-secondary">Carbs</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-yellow-400">{meal.nutritionalInfo.fat}g</div>
          <div className="text-xs text-text-secondary">Fat</div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {meal.dietaryTags.map((tag, index) => (
          <Tag key={index} variant="dietary">
            {tag}
          </Tag>
        ))}
        <Tag variant="status">
          <ChefHat className="w-3 h-3 mr-1" />
          <span className={getDifficultyColor(meal.difficulty)}>{meal.difficulty}</span>
        </Tag>
      </div>

      {/* Ingredients Preview */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-text-primary">Key Ingredients:</h4>
        <div className="text-sm text-text-secondary">
          {meal.ingredients.slice(0, 3).join(', ')}
          {meal.ingredients.length > 3 && ` +${meal.ingredients.length - 3} more`}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <Button
            variant="iconOnly"
            onClick={() => onLike?.(meal.id)}
            className="text-green-400 hover:bg-green-400/20"
          >
            <ThumbsUp className="w-4 h-4" />
          </Button>
          <Button
            variant="iconOnly"
            onClick={() => onDislike?.(meal.id)}
            className="text-red-400 hover:bg-red-400/20"
          >
            <ThumbsDown className="w-4 h-4" />
          </Button>
        </div>
        <Button
          variant="primary"
          onClick={() => onMakeMeal?.(meal.id)}
          className="flex items-center space-x-2"
        >
          <Heart className="w-4 h-4" />
          <span>Make This</span>
        </Button>
      </div>
    </Card>
  );
}
