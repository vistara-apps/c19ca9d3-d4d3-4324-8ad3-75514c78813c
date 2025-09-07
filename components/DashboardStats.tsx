'use client';

import { Card } from './Card';
import { TrendingUp, Target, Zap, Award } from 'lucide-react';

interface StatsData {
  caloriesConsumed: number;
  caloriesTarget: number;
  proteinConsumed: number;
  proteinTarget: number;
  mealsLogged: number;
  streakDays: number;
}

interface DashboardStatsProps {
  stats: StatsData;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const calorieProgress = (stats.caloriesConsumed / stats.caloriesTarget) * 100;
  const proteinProgress = (stats.proteinConsumed / stats.proteinTarget) * 100;

  const statCards = [
    {
      title: 'Daily Calories',
      value: stats.caloriesConsumed,
      target: stats.caloriesTarget,
      unit: 'cal',
      progress: calorieProgress,
      icon: Zap,
      color: 'text-accent'
    },
    {
      title: 'Protein Intake',
      value: stats.proteinConsumed,
      target: stats.proteinTarget,
      unit: 'g',
      progress: proteinProgress,
      icon: TrendingUp,
      color: 'text-primary'
    },
    {
      title: 'Meals Logged',
      value: stats.mealsLogged,
      target: 3,
      unit: '',
      progress: (stats.mealsLogged / 3) * 100,
      icon: Target,
      color: 'text-green-400'
    },
    {
      title: 'Streak Days',
      value: stats.streakDays,
      target: null,
      unit: 'days',
      progress: 100,
      icon: Award,
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-text-secondary">{stat.title}</p>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-text-primary">
                  {stat.value}
                </span>
                <span className="text-sm text-text-secondary">{stat.unit}</span>
                {stat.target && (
                  <>
                    <span className="text-text-secondary">/</span>
                    <span className="text-sm text-text-secondary">
                      {stat.target}{stat.unit}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className={`p-3 rounded-lg bg-surface/60 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>

          {stat.target && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-text-secondary">
                <span>Progress</span>
                <span>{Math.round(stat.progress)}%</span>
              </div>
              <div className="w-full bg-surface/60 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    stat.progress >= 100 
                      ? 'bg-green-400' 
                      : stat.progress >= 75 
                        ? 'bg-accent' 
                        : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(stat.progress, 100)}%` }}
                />
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
