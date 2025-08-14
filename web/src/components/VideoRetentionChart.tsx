'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users,
  Target
} from 'lucide-react';

interface RetentionData {
  timePoint: number;
  retention: number;
  viewers: number;
}

interface VideoRetentionChartProps {
  data: RetentionData[];
  title?: string;
}

export function VideoRetentionChart({ data, title = "Video Retention Analysis" }: VideoRetentionChartProps) {
  const maxRetention = Math.max(...data.map(d => d.retention));
  
  const avgRetention = data.reduce((sum, d) => sum + d.retention, 0) / data.length;
  const totalViewers = data[0]?.viewers || 0;

  return (
    <Card className="bg-slate-800/60 border-slate-600/50 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          <p className="text-slate-400 text-sm">Viewer retention over time</p>
        </div>
        <Badge className="bg-blue-500/10 border border-blue-500/30 text-blue-400">
          <TrendingUp className="w-3 h-3 mr-1" />
          {avgRetention.toFixed(1)}% avg
        </Badge>
      </div>

      {/* Chart */}
      <div className="relative h-48 mb-6 px-4 py-2">
        {/* Grid lines */}
        <div className="absolute inset-4">
          {[0, 25, 50, 75, 100].map((line) => (
            <div
              key={line}
              className="absolute w-full border-slate-600/40"
              style={{ 
                top: `${100 - line}%`,
                borderTopWidth: line === 50 ? '1px' : '0.5px'
              }}
            />
          ))}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-slate-400 font-medium text-xs">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>

        {/* Chart line */}
        <svg className="absolute inset-4 w-auto h-auto" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d={data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - (point.retention / maxRetention) * 100;
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            stroke="url(#retentionGradient)"
            strokeWidth="2"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="retentionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (point.retention / maxRetention) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill="#3b82f6"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {/* Time markers */}
        <div className="absolute bottom-2 left-4 right-4 flex justify-between text-slate-300 font-medium text-xs">
          <span>0s</span>
          <span>30s</span>
          <span>1m</span>
          <span>2m</span>
          <span>5m</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-700/50 rounded-lg border border-slate-600/30 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-white font-medium">Avg Retention</span>
          </div>
          <p className="text-slate-400 text-sm">{avgRetention.toFixed(1)}%</p>
        </div>
        
        <div className="bg-slate-700/50 rounded-lg border border-slate-600/30 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-green-400" />
            <span className="text-white font-medium">Total Viewers</span>
          </div>
          <p className="text-slate-400 text-sm">{totalViewers.toLocaleString()}</p>
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-3">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-white font-medium">Major Drop-off Points</span>
          </div>
          <p className="text-slate-400 text-sm">30s and 2m marks show significant viewer loss</p>
        </div>
        
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-white font-medium">Engagement Spikes</span>
          </div>
          <p className="text-slate-400 text-sm">Strong retention between 1-2 minute mark</p>
        </div>
        
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-medium">Optimization Suggestions</span>
          </div>
          <p className="text-slate-400 text-sm">Add hooks at 30s and 2m to maintain engagement</p>
        </div>
      </div>
    </Card>
  );
}
