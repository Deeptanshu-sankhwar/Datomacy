'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { EngagementChart } from '@/components/EngagementChart';
import { AudienceHeatmap } from '@/components/AudienceHeatmap';
import { VideoRetentionChart } from '@/components/VideoRetentionChart';
import { CreatorPricing } from '@/components/CreatorPricing';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  Clock, 
  Target,
  DollarSign,
  BarChart3,
  Award,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Bell
} from 'lucide-react';

interface EngagementMetrics {
  totalViews: number;
  avgWatchTime: number;
  engagementRate: number;
  clickThroughRate: number;
  retentionRate: number;
  audienceGrowth: number;
}

interface AudienceInsight {
  demographic: string;
  percentage: number;
  engagement: number;
  trend: 'up' | 'down' | 'stable';
}

interface VideoAnalytics {
  title: string;
  views: number;
  engagement: number;
  revenue: number;
  watchTime: number;
  dropOffPoints: number[];
}

export default function CreatorDashboard() {
  const [metrics] = useState<EngagementMetrics>({
    totalViews: 2847392,
    avgWatchTime: 4.2,
    engagementRate: 8.7,
    clickThroughRate: 12.3,
    retentionRate: 67.8,
    audienceGrowth: 23.4
  });

  // Sample data for charts
  const engagementData = [
    { date: 'Jan', views: 2450000, engagement: 8.2, revenue: 7840 },
    { date: 'Feb', views: 2680000, engagement: 8.7, revenue: 8320 },
    { date: 'Mar', views: 2847392, engagement: 8.9, revenue: 8742 },
    { date: 'Apr', views: 3120000, engagement: 9.1, revenue: 9560 },
    { date: 'May', views: 3350000, engagement: 9.4, revenue: 10200 },
    { date: 'Jun', views: 3580000, engagement: 9.6, revenue: 11080 },
  ];

  const heatmapData = [
    { hour: 9, day: 'Mon', intensity: 45, viewers: 12000 },
    { hour: 14, day: 'Mon', intensity: 67, viewers: 18500 },
    { hour: 19, day: 'Mon', intensity: 89, viewers: 24000 },
    { hour: 21, day: 'Mon', intensity: 92, viewers: 28500 },
    { hour: 10, day: 'Tue', intensity: 38, viewers: 9800 },
    { hour: 15, day: 'Tue', intensity: 72, viewers: 21000 },
    { hour: 20, day: 'Tue', intensity: 85, viewers: 26000 },
    { hour: 11, day: 'Wed', intensity: 55, viewers: 15000 },
    { hour: 16, day: 'Wed', intensity: 78, viewers: 23500 },
    { hour: 19, day: 'Wed', intensity: 94, viewers: 31000 },
    { hour: 21, day: 'Wed', intensity: 96, viewers: 34000 },
    { hour: 12, day: 'Thu', intensity: 48, viewers: 13500 },
    { hour: 17, day: 'Thu', intensity: 74, viewers: 22000 },
    { hour: 20, day: 'Thu', intensity: 88, viewers: 27500 },
    { hour: 13, day: 'Fri', intensity: 62, viewers: 17800 },
    { hour: 18, day: 'Fri', intensity: 81, viewers: 25500 },
    { hour: 22, day: 'Fri', intensity: 91, viewers: 29000 },
    { hour: 14, day: 'Sat', intensity: 58, viewers: 16500 },
    { hour: 19, day: 'Sat', intensity: 76, viewers: 24500 },
    { hour: 15, day: 'Sun', intensity: 52, viewers: 14200 },
    { hour: 20, day: 'Sun', intensity: 73, viewers: 21800 },
  ];

  const retentionData = [
    { timePoint: 0, retention: 100, viewers: 50000 },
    { timePoint: 30, retention: 87, viewers: 43500 },
    { timePoint: 60, retention: 78, viewers: 39000 },
    { timePoint: 90, retention: 72, viewers: 36000 },
    { timePoint: 120, retention: 68, viewers: 34000 },
    { timePoint: 150, retention: 61, viewers: 30500 },
    { timePoint: 180, retention: 55, viewers: 27500 },
    { timePoint: 210, retention: 52, viewers: 26000 },
    { timePoint: 240, retention: 48, viewers: 24000 },
    { timePoint: 270, retention: 44, viewers: 22000 },
    { timePoint: 300, retention: 41, viewers: 20500 },
    { timePoint: 330, retention: 38, viewers: 19000 },
    { timePoint: 360, retention: 35, viewers: 17500 },
    { timePoint: 390, retention: 32, viewers: 16000 },
    { timePoint: 420, retention: 28, viewers: 14000 },
  ];

  const [audienceInsights] = useState<AudienceInsight[]>([
    { demographic: '18-24 Tech Enthusiasts', percentage: 32, engagement: 9.2, trend: 'up' },
    { demographic: '25-34 Professionals', percentage: 28, engagement: 7.8, trend: 'up' },
    { demographic: '35-44 Entrepreneurs', percentage: 24, engagement: 8.5, trend: 'stable' },
    { demographic: '45+ Investors', percentage: 16, engagement: 6.9, trend: 'down' }
  ]);

  const [topVideos] = useState<VideoAnalytics[]>([
    {
      title: 'Web3 Development Tutorial: Building Your First DApp',
      views: 456789,
      engagement: 9.4,
      revenue: 2840,
      watchTime: 6.8,
      dropOffPoints: [0.15, 0.42, 0.73]
    },
    {
      title: 'Blockchain Explained: From Basics to Advanced',
      views: 387492,
      engagement: 8.9,
      revenue: 2156,
      watchTime: 5.9,
      dropOffPoints: [0.22, 0.55, 0.81]
    },
    {
      title: 'NFT Market Analysis: What Creators Need to Know',
      views: 298574,
      engagement: 10.2,
      revenue: 1876,
      watchTime: 4.7,
      dropOffPoints: [0.08, 0.38, 0.69]
    }
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">TubeDAO Creator Studio</h1>
                  <p className="text-sm text-muted-foreground">Deep YouTube Analytics & Audience Insights</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="text-foreground border-border hover:bg-muted/50 hover:border-border">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 shadow-lg">
                <Bell className="w-4 h-4 mr-2" />
                Get Alerts
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="container mx-auto px-6 py-8">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card className="bg-background/60 border-border/50 p-6 hover:bg-background/80 transition-all duration-200 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-5 h-5 text-blue-400" />
              <Badge className="bg-green-500/20 text-green-400 text-xs">+23%</Badge>
            </div>
            <div className="text-2xl font-bold mb-1 text-foreground">{(metrics.totalViews / 1000000).toFixed(1)}M</div>
            <div className="text-xs text-muted-foreground">Total Views</div>
          </Card>

          <Card className="bg-background/60 border-border/50 p-6 hover:bg-background/80 transition-all duration-200 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-accent" />
              <Badge className="bg-green-500/20 text-green-400 text-xs">+15%</Badge>
            </div>
            <div className="text-2xl font-bold mb-1 text-foreground">{metrics.avgWatchTime}m</div>
            <div className="text-xs text-muted-foreground">Avg Watch Time</div>
          </Card>

          <Card className="bg-background/60 border-border/50 p-6 hover:bg-background/80 transition-all duration-200 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-5 h-5 text-primary" />
              <Badge className="bg-green-500/20 text-green-400 text-xs border border-green-500/30">+8%</Badge>
            </div>
            <div className="text-2xl font-bold mb-1 text-foreground">{metrics.engagementRate}%</div>
            <div className="text-xs text-muted-foreground">Engagement Rate</div>
          </Card>

          <Card className="bg-background/60 border-border/50 p-6 hover:bg-background/80 transition-all duration-200 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-orange-400" />
              <Badge className="bg-green-500/20 text-green-400 text-xs border border-green-500/30">+12%</Badge>
            </div>
            <div className="text-2xl font-bold mb-1 text-foreground">{metrics.clickThroughRate}%</div>
            <div className="text-xs text-muted-foreground">Click-Through Rate</div>
          </Card>

          <Card className="bg-background/60 border-border/50 p-6 hover:bg-background/80 transition-all duration-200 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-5 h-5 text-green-400" />
              <Badge className="bg-green-500/20 text-green-400 text-xs border border-green-500/30">+5%</Badge>
            </div>
            <div className="text-2xl font-bold mb-1 text-foreground">{metrics.retentionRate}%</div>
            <div className="text-xs text-muted-foreground">Retention Rate</div>
          </Card>

          <Card className="bg-background/60 border-border/50 p-6 hover:bg-background/80 transition-all duration-200 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <Badge className="bg-green-500/20 text-green-400 text-xs border border-green-500/30">+23%</Badge>
            </div>
            <div className="text-2xl font-bold mb-1 text-foreground">{metrics.audienceGrowth}%</div>
            <div className="text-xs text-muted-foreground">Audience Growth</div>
          </Card>
        </div>

        {/* Detailed Analytics Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="bg-background/50 border border-border/50 backdrop-blur-sm">
            <TabsTrigger value="audience" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-all">
              <Users className="w-4 h-4 mr-2" />
              Audience Insights
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-all">
              <TrendingUp className="w-4 h-4 mr-2" />
              Video Performance
            </TabsTrigger>
            <TabsTrigger value="monetization" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-all">
              <DollarSign className="w-4 h-4 mr-2" />
              Monetization
            </TabsTrigger>

          </TabsList>

          {/* Audience Insights Tab */}
          <TabsContent value="audience" className="space-y-6">
            {/* Engagement Overview Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <EngagementChart 
                data={engagementData} 
                title="Views Trend" 
                metric="views" 
              />
              <EngagementChart 
                data={engagementData} 
                title="Engagement Rate" 
                metric="engagement" 
              />
              <EngagementChart 
                data={engagementData} 
                title="Revenue Growth" 
                metric="revenue" 
              />
            </div>

            {/* Audience Heatmap */}
            <AudienceHeatmap 
              data={heatmapData} 
              title="Audience Activity Heatmap" 
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-background/60 border-border/50 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                  <Users className="w-5 h-5 text-blue-400" />
                  Audience Demographics
                </h3>
                <div className="space-y-4">
                  {audienceInsights.map((insight, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{insight.demographic}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{insight.percentage}%</span>
                          {insight.trend === 'up' ? (
                            <ArrowUpRight className="w-4 h-4 text-green-400" />
                          ) : insight.trend === 'down' ? (
                            <ArrowDownRight className="w-4 h-4 text-primary" />
                          ) : (
                            <div className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                      <Progress value={insight.percentage} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Engagement: {insight.engagement}/10
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-background/60 border-border/50 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                  <Clock className="w-5 h-5 text-accent" />
                  Viewing Patterns
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg border border-border/30">
                    <div className="text-sm font-medium mb-2 text-foreground">Peak Viewing Hours</div>
                    <div className="text-2xl font-bold text-accent">7-9 PM EST</div>
                    <div className="text-xs text-muted-foreground">67% of total engagement</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg border border-border/30">
                    <div className="text-sm font-medium mb-2 text-foreground">Average Session Duration</div>
                    <div className="text-2xl font-bold text-blue-400">8.3 minutes</div>
                    <div className="text-xs text-muted-foreground">+12% from last month</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg border border-border/30">
                    <div className="text-sm font-medium mb-2 text-foreground">Return Viewer Rate</div>
                    <div className="text-2xl font-bold text-green-400">74%</div>
                    <div className="text-xs text-muted-foreground">Highly engaged audience</div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Video Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            {/* Video Retention Analysis */}
            <VideoRetentionChart 
              data={retentionData}
              title="Video Retention Analysis"
            />

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-background/60 border-border/50 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Performance Metrics
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/30">
                    <div>
                      <div className="text-sm font-medium text-foreground">Click-Through Rate</div>
                      <div className="text-xs text-muted-foreground">How often viewers click after seeing thumbnail</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-400">12.3%</div>
                      <div className="text-xs text-green-400">+2.1%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/30">
                    <div>
                      <div className="text-sm font-medium text-foreground">Average View Duration</div>
                      <div className="text-xs text-muted-foreground">How long viewers watch on average</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-accent">4:12</div>
                      <div className="text-xs text-green-400">+18s</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/30">
                    <div>
                      <div className="text-sm font-medium text-foreground">Subscriber Conversion</div>
                      <div className="text-xs text-muted-foreground">New subscribers per 100 views</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-orange-400">3.4</div>
                      <div className="text-xs text-green-400">+0.8</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-background/60 border-border/50 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  Content Categories Performance
                </h3>
                <div className="space-y-4">
                  {[
                    { category: 'Tutorials', views: 890000, engagement: 9.2, color: 'text-blue-400' },
                    { category: 'Reviews', views: 650000, engagement: 7.8, color: 'text-green-400' },
                    { category: 'Vlogs', views: 420000, engagement: 8.5, color: 'text-accent' },
                    { category: 'Live Streams', views: 230000, engagement: 6.9, color: 'text-orange-400' }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{item.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{(item.views / 1000).toFixed(0)}K views</span>
                          <span className={`text-sm ${item.color}`}>{item.engagement}/10</span>
                        </div>
                      </div>
                      <Progress value={(item.views / 890000) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="bg-background/60 border-border/50 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Award className="w-5 h-5 text-yellow-400" />
                Top Performing Videos
              </h3>
              <div className="space-y-4">
                {topVideos.map((video, index) => (
                  <div key={index} className="p-4 bg-muted/50 rounded-lg border border-border/30">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1 text-foreground">{video.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{(video.views / 1000).toFixed(0)}K views</span>
                          <span>{video.engagement}/10 engagement</span>
                          <span>${video.revenue} revenue</span>
                        </div>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        #{index + 1}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Watch Time</div>
                        <div className="font-medium text-foreground">{video.watchTime}m avg</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Retention</div>
                        <div className="font-medium text-foreground">{(100 - video.dropOffPoints[2] * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Revenue/View</div>
                        <div className="font-medium text-foreground">${(video.revenue / video.views * 1000).toFixed(3)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">CTR</div>
                        <div className="font-medium text-foreground">{(Math.random() * 5 + 8).toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Monetization Tab */}
          <TabsContent value="monetization" className="space-y-6">
            {/* Revenue Overview Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <EngagementChart 
                data={engagementData} 
                title="Revenue Trend" 
                metric="revenue" 
              />
              <Card className="bg-background/60 border-border/50 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Revenue Breakdown
                </h3>
                <div className="space-y-4">
                  {[
                    { source: 'Ad Revenue', amount: 6850, percentage: 78, color: 'text-green-400' },
                    { source: 'Sponsorships', amount: 1500, percentage: 17, color: 'text-blue-400' },
                    { source: 'Merchandise', amount: 392, percentage: 5, color: 'text-accent' }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{item.source}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">${item.amount}</span>
                          <span className={`text-sm ${item.color}`}>{item.percentage}%</span>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="bg-background/60 border-border/50 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                  Key Metrics
                </h3>
                <div className="space-y-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg border border-border/30">
                    <div className="text-sm font-medium text-foreground mb-1">RPM</div>
                    <div className="text-2xl font-bold text-green-400">$3.07</div>
                    <div className="text-xs text-muted-foreground">+15% vs industry</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg border border-border/30">
                    <div className="text-sm font-medium text-foreground mb-1">CPM</div>
                    <div className="text-2xl font-bold text-blue-400">$4.52</div>
                    <div className="text-xs text-muted-foreground">Above average</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg border border-border/30">
                    <div className="text-sm font-medium text-foreground mb-1">Fill Rate</div>
                    <div className="text-2xl font-bold text-accent">94%</div>
                    <div className="text-xs text-muted-foreground">Excellent</div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-background/60 border-border/50 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Revenue Insights
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg border border-border/30">
                    <div className="text-sm font-medium mb-2 text-foreground">Monthly Revenue</div>
                    <div className="text-3xl font-bold text-green-400">$8,742</div>
                    <div className="text-xs text-muted-foreground">+18% from last month</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg border border-border/30">
                    <div className="text-sm font-medium mb-2 text-foreground">RPM (Revenue per Mille)</div>
                    <div className="text-3xl font-bold text-blue-400">$3.07</div>
                    <div className="text-xs text-muted-foreground">Above industry average</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg border border-border/30">
                    <div className="text-sm font-medium mb-2 text-foreground">Best Performing Ad Format</div>
                    <div className="text-xl font-bold text-accent">Mid-roll Video</div>
                    <div className="text-xs text-muted-foreground">$2.34 RPM</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-background/60 border-border/50 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                  <Target className="w-5 h-5 text-orange-400" />
                  Revenue Optimization
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="text-sm font-medium text-green-400">High Impact</div>
                    <div className="text-xs text-foreground">Add mid-roll ads at 3:30 mark</div>
                    <div className="text-xs text-muted-foreground">+$247 estimated monthly</div>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="text-sm font-medium text-blue-400">Medium Impact</div>
                    <div className="text-xs text-foreground">Optimize thumbnail for mobile</div>
                    <div className="text-xs text-muted-foreground">+12% CTR improvement</div>
                  </div>
                  <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                    <div className="text-sm font-medium text-accent">Long-term</div>
                    <div className="text-xs text-foreground">Create series content</div>
                    <div className="text-xs text-muted-foreground">+34% retention rate</div>
                  </div>
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="text-sm font-medium text-yellow-400">Quick Win</div>
                    <div className="text-xs text-foreground">Enable end screen elements</div>
                    <div className="text-xs text-muted-foreground">+8% watch time</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Revenue by Video Type */}
            <Card className="bg-background/60 border-border/50 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Revenue by Content Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { type: 'Tutorials', revenue: 3200, rpm: 3.45, color: 'bg-blue-500' },
                  { type: 'Reviews', revenue: 2800, rpm: 2.89, color: 'bg-green-500' },
                  { type: 'Vlogs', revenue: 1900, rpm: 2.12, color: 'bg-accent' },
                  { type: 'Live Streams', revenue: 842, rpm: 1.87, color: 'bg-orange-500' }
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-muted/50 rounded-lg border border-border/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm font-medium text-foreground">{item.type}</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-muted-foreground">Revenue</div>
                        <div className="text-lg font-bold text-foreground">${item.revenue}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">RPM</div>
                        <div className="text-sm font-medium text-foreground">${item.rpm}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>


        </Tabs>
      </div>

      {/* Pricing Section */}
      <CreatorPricing />
    </div>
  );
}
