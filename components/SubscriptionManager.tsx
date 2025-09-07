'use client';

import { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Crown, Check, Zap, TrendingUp, Star } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface SubscriptionManagerProps {
  userId: string;
  walletAddress?: string;
  currentPlan?: string;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  stripePriceId: string;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    stripePriceId: '',
    features: [
      'Basic meal suggestions',
      'Simple nutrition tracking',
      '3 AI-generated meals per day',
      'Basic dietary restriction filtering',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    interval: 'month',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || '',
    popular: true,
    features: [
      'Unlimited AI meal suggestions',
      'Advanced nutrition analysis',
      'Personalized meal planning',
      'Detailed macro tracking',
      'Recipe customization',
      'Progress insights & trends',
      'Priority customer support',
    ],
  },
  {
    id: 'pro-yearly',
    name: 'Pro Annual',
    price: 99.99,
    interval: 'year',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || '',
    features: [
      'Everything in Pro',
      '2 months free (save 17%)',
      'Advanced AI recipe adaptation',
      'Meal prep optimization',
      'Shopping list generation',
      'Integration with fitness apps',
      'Early access to new features',
    ],
  },
];

export function SubscriptionManager({ 
  userId, 
  walletAddress, 
  currentPlan = 'free' 
}: SubscriptionManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptionStatus();
  }, [userId]);

  const loadSubscriptionStatus = async () => {
    try {
      const response = await apiClient.getSubscriptionStatus(userId);
      setSubscriptionStatus(response.data);
    } catch (error) {
      console.error('Error loading subscription status:', error);
    }
  };

  const handleUpgrade = async (plan: PricingPlan) => {
    if (plan.id === 'free' || !plan.stripePriceId) return;

    setLoadingPlan(plan.id);
    try {
      const response = await apiClient.createSubscription(
        userId,
        plan.stripePriceId,
        walletAddress
      );

      if (response.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
    } finally {
      setLoadingPlan(null);
    }
  };

  const isCurrentPlan = (planId: string) => {
    if (planId === 'free') {
      return !subscriptionStatus?.hasActiveSubscription;
    }
    return subscriptionStatus?.hasActiveSubscription && 
           subscriptionStatus?.subscriptions?.some((sub: any) => 
             sub.items.data[0].price.id === PRICING_PLANS.find(p => p.id === planId)?.stripePriceId
           );
  };

  const getPlanButtonText = (plan: PricingPlan) => {
    if (isCurrentPlan(plan.id)) {
      return 'Current Plan';
    }
    if (plan.id === 'free') {
      return 'Downgrade';
    }
    return loadingPlan === plan.id ? 'Processing...' : 'Upgrade';
  };

  const getPlanButtonVariant = (plan: PricingPlan) => {
    if (isCurrentPlan(plan.id)) {
      return 'secondary';
    }
    return plan.popular ? 'primary' : 'secondary';
  };

  return (
    <div className="space-y-8">
      {/* Current Status */}
      {subscriptionStatus?.hasActiveSubscription && (
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Crown className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Pro Subscriber</h3>
              <p className="text-text-secondary">
                You have access to all premium features
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Pricing Plans */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Choose Your Plan
          </h2>
          <p className="text-text-secondary">
            Unlock the full potential of your nutrition journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular
                  ? 'border-primary/50 bg-gradient-to-b from-primary/5 to-transparent'
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Plan Header */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-text-primary">
                    {plan.name}
                  </h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-text-primary">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-text-secondary">
                        /{plan.interval}
                      </span>
                    )}
                  </div>
                  {plan.interval === 'year' && (
                    <p className="text-sm text-accent mt-1">
                      Save 17% vs monthly
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-text-secondary">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleUpgrade(plan)}
                  disabled={
                    isCurrentPlan(plan.id) || 
                    loadingPlan === plan.id ||
                    (plan.id === 'free' && !subscriptionStatus?.hasActiveSubscription)
                  }
                  variant={getPlanButtonVariant(plan)}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  {plan.popular && !isCurrentPlan(plan.id) && (
                    <Zap className="w-4 h-4" />
                  )}
                  <span>{getPlanButtonText(plan)}</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">
              Why Upgrade to Pro?
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-text-primary">🧠 Smarter AI</h4>
              <p className="text-sm text-text-secondary">
                Advanced AI learns your preferences and creates perfectly tailored meal plans
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-text-primary">📊 Deep Analytics</h4>
              <p className="text-sm text-text-secondary">
                Comprehensive nutrition tracking with trends and insights
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-text-primary">🎯 Goal Optimization</h4>
              <p className="text-sm text-text-secondary">
                Meal plans automatically adjust to help you reach your health goals faster
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-text-primary">⚡ Priority Support</h4>
              <p className="text-sm text-text-secondary">
                Get help when you need it with priority customer support
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Money Back Guarantee */}
      <div className="text-center text-sm text-text-secondary">
        <p>
          💰 30-day money-back guarantee • 🔒 Secure payments via Stripe • 
          ❌ Cancel anytime
        </p>
      </div>
    </div>
  );
}
