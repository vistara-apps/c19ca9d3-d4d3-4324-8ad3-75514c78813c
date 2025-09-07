'use client';

import { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Tag } from './Tag';
import { UserPreferences } from '@/lib/types';
import { HEALTH_GOALS, DIETARY_RESTRICTIONS, COMMON_ALLERGIES, CUISINE_TYPES } from '@/lib/constants';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (preferences: UserPreferences) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    healthGoals: [],
    dietaryRestrictions: [],
    allergies: [],
    cuisinePreferences: [],
    cookingSkill: 'beginner',
    timeAvailable: 30,
    budgetLevel: 'medium'
  });

  const steps = [
    {
      title: 'What are your health goals?',
      subtitle: 'Select all that apply to personalize your meal recommendations',
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {HEALTH_GOALS.map((goal) => (
              <button
                key={goal}
                onClick={() => toggleSelection('healthGoals', goal)}
                className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                  preferences.healthGoals.includes(goal)
                    ? 'border-accent bg-accent/20 text-accent'
                    : 'border-white/10 bg-surface/40 text-text-secondary hover:border-accent/50'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Any dietary restrictions?',
      subtitle: 'Help us filter out foods that don\'t match your lifestyle',
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {DIETARY_RESTRICTIONS.map((restriction) => (
              <button
                key={restriction}
                onClick={() => toggleSelection('dietaryRestrictions', restriction)}
                className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                  preferences.dietaryRestrictions.includes(restriction)
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-white/10 bg-surface/40 text-text-secondary hover:border-primary/50'
                }`}
              >
                {restriction}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Do you have any allergies?',
      subtitle: 'We\'ll make sure to avoid these ingredients completely',
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {COMMON_ALLERGIES.map((allergy) => (
              <button
                key={allergy}
                onClick={() => toggleSelection('allergies', allergy)}
                className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                  preferences.allergies.includes(allergy)
                    ? 'border-red-400 bg-red-400/20 text-red-400'
                    : 'border-white/10 bg-surface/40 text-text-secondary hover:border-red-400/50'
                }`}
              >
                {allergy}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Favorite cuisines?',
      subtitle: 'We\'ll prioritize these flavors in your meal suggestions',
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {CUISINE_TYPES.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => toggleSelection('cuisinePreferences', cuisine)}
                className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                  preferences.cuisinePreferences.includes(cuisine)
                    ? 'border-accent bg-accent/20 text-accent'
                    : 'border-white/10 bg-surface/40 text-text-secondary hover:border-accent/50'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Tell us about your cooking',
      subtitle: 'This helps us suggest meals that match your skill and time',
      component: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Cooking skill level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['beginner', 'intermediate', 'advanced'].map((skill) => (
                <button
                  key={skill}
                  onClick={() => setPreferences(prev => ({ ...prev, cookingSkill: skill as any }))}
                  className={`p-3 rounded-lg border transition-all duration-200 capitalize ${
                    preferences.cookingSkill === skill
                      ? 'border-primary bg-primary/20 text-primary'
                      : 'border-white/10 bg-surface/40 text-text-secondary hover:border-primary/50'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Time available for meal prep (minutes)
            </label>
            <Input
              value={preferences.timeAvailable.toString()}
              onChange={(e) => setPreferences(prev => ({ 
                ...prev, 
                timeAvailable: parseInt(e.target.value) || 30 
              }))}
              placeholder="30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Budget level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['low', 'medium', 'high'].map((budget) => (
                <button
                  key={budget}
                  onClick={() => setPreferences(prev => ({ ...prev, budgetLevel: budget as any }))}
                  className={`p-3 rounded-lg border transition-all duration-200 capitalize ${
                    preferences.budgetLevel === budget
                      ? 'border-accent bg-accent/20 text-accent'
                      : 'border-white/10 bg-surface/40 text-text-secondary hover:border-accent/50'
                  }`}
                >
                  {budget}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];

  const toggleSelection = (key: keyof UserPreferences, value: string) => {
    setPreferences(prev => {
      const currentArray = prev[key] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return { ...prev, [key]: newArray };
    });
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return preferences.healthGoals.length > 0;
      case 1:
      case 2:
      case 3:
        return true; // These steps are optional
      case 4:
        return true; // Final step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(preferences);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-text-secondary">
            <span>Step {step + 1} of {steps.length}</span>
            <span>{Math.round(((step + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-surface/60 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-accent to-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-text-primary">
              {steps[step].title}
            </h2>
            <p className="text-text-secondary">
              {steps[step].subtitle}
            </p>
          </div>

          {steps[step].component}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t border-white/10">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={step === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center space-x-2"
          >
            <span>{step === steps.length - 1 ? 'Complete Setup' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
