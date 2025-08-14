'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users } from 'lucide-react';

interface HeatmapData {
  hour: number;
  day: string;
  intensity: number;
  viewers: number;
}

interface AudienceHeatmapProps {
  data: HeatmapData[];
  title: string;
}

export function AudienceHeatmap({ data, title }: AudienceHeatmapProps) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const getIntensityForTime = (day: string, hour: number) => {
    const point = data.find(d => d.day === day && d.hour === hour);
    return point ? point.intensity : 0;
  };

  const getViewersForTime = (day: string, hour: number) => {
    const point = data.find(d => d.day === day && d.hour === hour);
    return point ? point.viewers : 0;
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 80) return 'bg-red-500';
    if (intensity >= 60) return 'bg-orange-500';
    if (intensity >= 40) return 'bg-yellow-500';
    if (intensity >= 20) return 'bg-green-500';
    if (intensity > 0) return 'bg-blue-500';
    return 'bg-slate-700';
  };

  const getIntensityOpacity = (intensity: number) => {
    return Math.max(intensity / 100, 0.3);
  };

  const peakData = data.reduce((max, current) => 
    current.intensity > max.intensity ? current : max
  );

  return (
    <Card className="bg-slate-800/60 border-slate-600/50 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
          <Clock className="w-5 h-5 text-blue-400" />
          {title}
        </h3>
        <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
          Peak: {peakData.day} {peakData.hour}:00
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-25 gap-1 text-xs text-slate-400">
          <div></div>
          {hours.map(hour => (
            <div key={hour} className="text-center">
              {hour % 6 === 0 ? `${hour}h` : ''}
            </div>
          ))}
        </div>

        {days.map(day => (
          <div key={day} className="grid grid-cols-25 gap-1">
            <div className="text-xs text-slate-300 flex items-center font-medium">{day}</div>
            {hours.map(hour => {
              const intensity = getIntensityForTime(day, hour);
              const viewers = getViewersForTime(day, hour);
              return (
                <div
                  key={`${day}-${hour}`}
                  className={`h-6 w-6 rounded-sm ${getIntensityColor(intensity)} relative group cursor-pointer transition-all duration-200 hover:scale-110`}
                  style={{ opacity: getIntensityOpacity(intensity) }}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 border border-slate-600/50 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-10 shadow-xl backdrop-blur-sm">
                    <div className="font-semibold text-white">{day} {hour}:00</div>
                    <div className="text-blue-400">{viewers.toLocaleString()} viewers</div>
                    <div className="text-slate-300">{intensity}% intensity</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-600/50">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span>Low</span>
          <div className="flex gap-1">
            {[0, 20, 40, 60, 80].map(intensity => (
              <div
                key={intensity}
                className={`w-4 h-4 rounded-sm ${getIntensityColor(intensity)} border border-slate-600/30`}
                style={{ opacity: getIntensityOpacity(Math.max(intensity, 30)) }}
              />
            ))}
          </div>
          <span>High</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300">
              Total: {data.reduce((sum, d) => sum + d.viewers, 0).toLocaleString()} viewers
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600/30">
          <div className="text-sm font-medium text-blue-400">Peak Hour</div>
          <div className="text-lg font-bold text-white">{peakData.hour}:00</div>
          <div className="text-xs text-slate-400">{peakData.viewers.toLocaleString()} viewers</div>
        </div>
        
        <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600/30">
          <div className="text-sm font-medium text-green-400">Best Day</div>
          <div className="text-lg font-bold text-white">{peakData.day}</div>
          <div className="text-xs text-slate-400">{peakData.intensity}% intensity</div>
        </div>
        
        <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600/30">
          <div className="text-sm font-medium text-purple-400">Avg. Daily</div>
          <div className="text-lg font-bold text-white">
            {Math.round(data.reduce((sum, d) => sum + d.viewers, 0) / 7).toLocaleString()}
          </div>
          <div className="text-xs text-slate-400">viewers per day</div>
        </div>
      </div>
    </Card>
  );
}
