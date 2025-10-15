'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DataPoint {
  date: string;
  views: number;
  engagement: number;
  revenue: number;
}

interface EngagementChartProps {
  data: DataPoint[];
  title: string;
  metric: 'views' | 'engagement' | 'revenue';
}

export function EngagementChart({ data, title, metric }: EngagementChartProps) {
  const maxValue = Math.max(...data.map(d => d[metric]));
  const minValue = Math.min(...data.map(d => d[metric]));
  const trend = data[data.length - 1][metric] > data[0][metric] ? 'up' : 'down';
  const trendPercentage = Math.abs(
    ((data[data.length - 1][metric] - data[0][metric]) / data[0][metric]) * 100
  );

  const getColor = (metric: string) => {
    switch (metric) {
      case 'views': return 'text-blue-400';
      case 'engagement': return 'text-green-400';
      case 'revenue': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getGradient = (metric: string) => {
    switch (metric) {
      case 'views': return 'from-blue-500/30 to-cyan-500/10';
      case 'engagement': return 'from-green-500/30 to-emerald-500/10';
      case 'revenue': return 'from-yellow-500/30 to-orange-500/10';
      default: return 'from-slate-500/30 to-slate-500/10';
    }
  };

  return (
    <Card className="bg-slate-800/60 border-slate-600/50 p-6 backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <Badge className={`${trend === 'up' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-primary/20 text-primary border border-primary/30'}`}>
          {trend === 'up' ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          {trendPercentage.toFixed(1)}%
        </Badge>
      </div>

      <div className="relative h-48">
        <div className="absolute inset-0 flex items-end justify-between gap-1">
          {data.map((point, index) => {
            const height = ((point[metric] - minValue) / (maxValue - minValue)) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full bg-gradient-to-t ${getGradient(metric)} rounded-t-sm transition-all duration-300 hover:opacity-80 group relative`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 border border-slate-600/50 text-white text-xs rounded px-3 py-2 whitespace-nowrap shadow-xl backdrop-blur-sm">
                    <div className={getColor(metric)}>{point[metric].toLocaleString()}</div>
                    <div className="text-slate-300">{point.date}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-2 transform -rotate-45 origin-left">
                  {point.date}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-600/50">
        <div className="text-center">
          <div className={`text-xl font-bold ${getColor(metric)}`}>
            {data[data.length - 1][metric].toLocaleString()}
          </div>
          <div className="text-xs text-slate-400">Current</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-white">
            {Math.round(data.reduce((sum, d) => sum + d[metric], 0) / data.length).toLocaleString()}
          </div>
          <div className="text-xs text-slate-400">Average</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-white">
            {maxValue.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400">Peak</div>
        </div>
      </div>
    </Card>
  );
}
