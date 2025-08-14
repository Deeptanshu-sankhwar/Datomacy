'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Zap, 
  Crown, 
  Rocket, 
  BarChart3, 
  Users, 
  TrendingUp,
  Star,
  Sparkles
} from 'lucide-react';

interface PricingTier {
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  icon: any;
  gradient: string;
  buttonText: string;
}

export function CreatorPricing() {
  const tiers: PricingTier[] = [
    {
      name: 'Starter',
      price: 99,
      description: 'Perfect for new creators looking to understand their audience',
      features: [
        'Basic audience demographics',
        'Weekly engagement reports',
        'Up to 100K monthly views',
        'Email support',
        '7-day data retention',
        'Standard analytics dashboard'
      ],
      icon: BarChart3,
      gradient: 'from-blue-500 to-cyan-500',
      buttonText: 'Start Free Trial'
    },
    {
      name: 'Pro',
      price: 299,
      description: 'Advanced insights for growing creators and small teams',
      features: [
        'Advanced audience segmentation',
        'Real-time engagement tracking',
        'Up to 1M monthly views',
        'Retention & drop-off analysis',
        'Custom video optimization tips',
        'Priority support',
        '30-day data retention',
        'API access',
        'White-label reports'
      ],
      popular: true,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-500',
      buttonText: 'Choose Pro'
    },
    {
      name: 'Enterprise',
      price: 899,
      description: 'Complete solution for large creators and media companies',
      features: [
        'Unlimited views & channels',
        'AI-powered content optimization',
        'Multi-channel analytics',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced A/B testing',
        'Unlimited data retention',
        'Custom dashboard branding',
        'Team collaboration tools',
        'Revenue optimization insights',
        'Priority feature requests',
        'SLA guarantee'
      ],
      icon: Crown,
      gradient: 'from-yellow-500 to-orange-500',
      buttonText: 'Contact Sales'
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">Creator Studio Pricing</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Unlock Deep
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              YouTube Insights
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Get unprecedented access to your audience's real engagement data. 
            Make data-driven decisions that actually boost your revenue and growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Real Viewer Data</h3>
            <p className="text-slate-400 text-sm">
              Access actual user interaction data, not just platform metrics
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">AI Optimization</h3>
            <p className="text-slate-400 text-sm">
              Get AI-powered recommendations to boost engagement and revenue
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Privacy-First</h3>
            <p className="text-slate-400 text-sm">
              Users consent to share their data, ensuring ethical and valuable insights
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <Card 
                key={tier.name}
                className={`relative bg-slate-800/60 border-slate-600/50 p-8 backdrop-blur-sm ${
                  tier.popular ? 'border-purple-500 scale-105 shadow-2xl shadow-purple-500/20' : ''
                } hover:border-slate-500 transition-all duration-300`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${tier.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2 text-white">{tier.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{tier.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-5xl font-black text-white">${tier.price}</span>
                    <span className="text-slate-400">/month</span>
                  </div>
                  
                  <Button 
                    className={`w-full ${
                      tier.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                        : 'bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 border border-slate-500'
                    } text-white font-semibold py-3 shadow-lg`}
                  >
                    {tier.buttonText}
                  </Button>
                </div>

                <div className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-12 backdrop-blur-sm">
          <Rocket className="w-16 h-16 text-purple-400 mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-4 text-white">Ready to Transform Your Content Strategy?</h3>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using TubeDAO's deep engagement insights 
            to grow their channels and maximize their revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 shadow-lg"
            >
              Start 14-Day Free Trial
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 px-8 py-3"
            >
              Schedule Demo
            </Button>
          </div>
          
          <p className="text-xs text-slate-500 mt-6">
            No credit card required • Cancel anytime • Full access during trial
          </p>
        </div>
      </div>
    </div>
  );
}
