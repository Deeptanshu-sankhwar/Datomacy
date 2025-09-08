/**
 * TubeDAO Earnings Calculator
 * Business Intelligence-driven reward system based on data quality and market value
 */

class EarningsCalculator {
  constructor() {
    this.dataCategories = {
      behavioral: {
        events: ['video_watch', 'subscribe', 'unsubscribe', 'channel_visit'],
        baseValue: 0.0008,
        description: 'Direct user behavior data'
      },
      engagement: {
        events: ['like', 'dislike', 'comment', 'seek_start', 'seek_end'],
        baseValue: 0.0004,
        description: 'User engagement patterns'
      },
      interaction: {
        events: ['play', 'pause', 'video_start', 'video_end', 'video_resume'],
        baseValue: 0.0002,
        description: 'Basic interaction data'
      },
      passive: {
        events: ['page_view', 'navigation', 'scroll', 'hover', 'click'],
        baseValue: 0.0001,
        description: 'Passive tracking data'
      },
      adBehavior: {
        events: ['ad_skip', 'ad_complete'],
        baseValue: 0.0006,
        description: 'Ad interaction and avoidance patterns'
      }
    };

    this.depthMultipliers = {
      videoEngagement: {
        short: 0.5,
        medium: 1.0,
        long: 1.3,
        extended: 1.6
      },
      searchComplexity: {
        simple: 0.7,
        moderate: 1.0,
        complex: 1.4
      },
      interactionDepth: {
        surface: 0.6,
        moderate: 1.0,
        deep: 1.5
      }
    };

    this.marketMultipliers = {
      timeDemand: {
        peak: 1.4,
        normal: 1.0,
        low: 0.6
      },
      dayDemand: {
        weekday: 1.2,
        weekend: 0.8
      },
      contentDemand: {
        tech: 1.3,
        finance: 1.4,
        education: 1.1,
        entertainment: 0.9,
        gaming: 0.8,
        default: 1.0
      }
    };

    this.freshnessMultipliers = {
      realTime: 1.5,
      recent: 1.2,
      current: 1.0,
      stale: 0.7,
      outdated: 0.3
    };

    this.qualityThresholds = {
      excellent: { min: 0.8, multiplier: 1.5 },
      good: { min: 0.6, multiplier: 1.2 },
      average: { min: 0.4, multiplier: 1.0 },
      poor: { min: 0.2, multiplier: 0.7 },
      veryPoor: { min: 0, multiplier: 0.4 }
    };
  }

  // Calculate total earnings with business intelligence framework
  calculateTotalEarnings(events) {
    if (!events || events.length === 0) {
      return { total: 0, breakdown: {}, qualityScore: 0 };
    }

    const breakdown = {};
    let total = 0;
    let totalQualityPoints = 0;
    let maxQualityPoints = 0;

    events.forEach(event => {
      const eventValue = this.calculateEventValue(event, events);
      const category = this.getEventCategory(event.event_type);
      
      if (!breakdown[category]) {
        breakdown[category] = {
          count: 0,
          totalEarnings: 0,
          events: []
        };
      }

      breakdown[category].count++;
      breakdown[category].totalEarnings += eventValue.earnings;
      breakdown[category].events.push({
        type: event.event_type,
        earnings: eventValue.earnings,
        qualityScore: eventValue.qualityScore
      });

      total += eventValue.earnings;
      totalQualityPoints += eventValue.qualityScore;
      maxQualityPoints += 10;
    });

    const overallQualityScore = maxQualityPoints > 0 ? totalQualityPoints / maxQualityPoints : 0;
    const qualityMultiplier = this.getQualityMultiplier(overallQualityScore);
    
    total *= qualityMultiplier;

    return {
      total: parseFloat(total.toFixed(6)),
      breakdown: breakdown,
      qualityScore: parseFloat(overallQualityScore.toFixed(3)),
      qualityMultiplier: qualityMultiplier
    };
  }

  // Calculate individual event value using business intelligence
  calculateEventValue(event, allEvents) {
    const category = this.getEventCategory(event.event_type);
    const baseValue = this.getBaseValue(event.event_type);
    const depthMultiplier = this.calculateDepthMultiplier(event, allEvents);
    const marketMultiplier = this.calculateMarketMultiplier(event);
    const freshnessMultiplier = this.calculateFreshnessMultiplier(event);
    const breadthScore = this.calculateBreadthScore(event, allEvents);
    const qualityScore = this.calculateQualityScore(
      depthMultiplier, 
      marketMultiplier, 
      freshnessMultiplier, 
      breadthScore
    );
    const earnings = baseValue * depthMultiplier * marketMultiplier * freshnessMultiplier * breadthScore;
    
    return {
      earnings: Math.max(0, earnings),
      qualityScore: qualityScore,
      breakdown: {
        baseValue,
        depthMultiplier,
        marketMultiplier,
        freshnessMultiplier,
        breadthScore,
        category
      }
    };
  }

  // Get event category for business intelligence classification
  getEventCategory(eventType) {
    for (const [category, config] of Object.entries(this.dataCategories)) {
      if (config.events.includes(eventType)) {
        return category;
      }
    }
    return 'passive';
  }

  // Get base monetary value for event type
  getBaseValue(eventType) {
    const category = this.getEventCategory(eventType);
    return this.dataCategories[category].baseValue;
  }

  // Calculate depth multiplier based on event context
  calculateDepthMultiplier(event, allEvents) {
    const eventType = event.event_type;
    
    if (['video_watch', 'video_start', 'video_end'].includes(eventType)) {
      const videoDuration = event.duration || 0;
      if (videoDuration > 900) return this.depthMultipliers.videoEngagement.extended;
      if (videoDuration > 300) return this.depthMultipliers.videoEngagement.long;
      if (videoDuration > 30) return this.depthMultipliers.videoEngagement.medium;
      return this.depthMultipliers.videoEngagement.short;
    }
    
    if (eventType === 'search') {
      const queryLength = event.query ? event.query.split(' ').length : 1;
      if (queryLength >= 6) return this.depthMultipliers.searchComplexity.complex;
      if (queryLength >= 3) return this.depthMultipliers.searchComplexity.moderate;
      return this.depthMultipliers.searchComplexity.simple;
    }
    
    const recentEvents = this.getRecentEvents(allEvents, event.timestamp, 300);
    const interactionCount = recentEvents.length;
    
    if (interactionCount > 20) return this.depthMultipliers.interactionDepth.deep;
    if (interactionCount > 5) return this.depthMultipliers.interactionDepth.moderate;
    return this.depthMultipliers.interactionDepth.surface;
  }

  // Calculate market demand multiplier based on timing and content
  calculateMarketMultiplier(event) {
    const eventTime = new Date(event.timestamp);
    const hour = eventTime.getHours();
    const dayOfWeek = eventTime.getDay();
    
    let timeMultiplier = this.marketMultipliers.timeDemand.normal;
    if ((hour >= 7 && hour <= 9) || (hour >= 12 && hour <= 14) || (hour >= 18 && hour <= 22)) {
      timeMultiplier = this.marketMultipliers.timeDemand.peak;
    } else if (hour >= 0 && hour <= 6) {
      timeMultiplier = this.marketMultipliers.timeDemand.low;
    }
    
    const dayMultiplier = (dayOfWeek >= 1 && dayOfWeek <= 5) 
      ? this.marketMultipliers.dayDemand.weekday 
      : this.marketMultipliers.dayDemand.weekend;
    
    const contentMultiplier = this.marketMultipliers.contentDemand.default;
    
    return timeMultiplier * dayMultiplier * contentMultiplier;
  }

  // Calculate data freshness multiplier
  calculateFreshnessMultiplier(event) {
    const now = Date.now();
    const eventTime = new Date(event.timestamp).getTime();
    const ageHours = (now - eventTime) / (1000 * 60 * 60);
    
    if (ageHours < 1) return this.freshnessMultipliers.realTime;
    if (ageHours < 24) return this.freshnessMultipliers.recent;
    if (ageHours < 168) return this.freshnessMultipliers.current;
    if (ageHours < 672) return this.freshnessMultipliers.stale;
    return this.freshnessMultipliers.outdated;
  }

  // Calculate breadth score based on event diversity and context
  calculateBreadthScore(event, allEvents) {
    const recentEvents = this.getRecentEvents(allEvents, event.timestamp, 3600);
    const uniqueEventTypes = new Set(recentEvents.map(e => e.event_type));
    const diversityScore = Math.min(uniqueEventTypes.size / 10, 1.0);
    const sessionLength = recentEvents.length;
    const sessionScore = Math.min(sessionLength / 50, 1.0);
    
    return 0.5 + (diversityScore * 0.3) + (sessionScore * 0.2);
  }

  // Calculate overall quality score (0-10)
  calculateQualityScore(depthMultiplier, marketMultiplier, freshnessMultiplier, breadthScore) {
    const depthScore = Math.min(depthMultiplier * 2.5, 3.0);
    const marketScore = Math.min(marketMultiplier * 2.0, 2.5);
    const freshnessScore = Math.min(freshnessMultiplier * 2.0, 2.5);
    const breadthScoreNormalized = breadthScore * 2.0;
    
    return Math.min(depthScore + marketScore + freshnessScore + breadthScoreNormalized, 10);
  }

  // Get quality multiplier based on overall score
  getQualityMultiplier(qualityScore) {
    for (const [tier, config] of Object.entries(this.qualityThresholds)) {
      if (qualityScore >= config.min) {
        return config.multiplier;
      }
    }
    return this.qualityThresholds.veryPoor.multiplier;
  }

  // Get events within a time window
  getRecentEvents(events, timestamp, seconds) {
    const referenceTime = new Date(timestamp);
    const windowStart = new Date(referenceTime.getTime() - (seconds * 1000));

    return events.filter(event => {
      const eventTime = new Date(event.timestamp);
      return eventTime >= windowStart && eventTime <= referenceTime;
    });
  }

  // Calculate today's earnings with business intelligence
  calculateTodayEarnings(events) {
    const today = new Date().toDateString();
    const todayEvents = events.filter(event => 
      new Date(event.timestamp).toDateString() === today
    );

    return this.calculateTotalEarnings(todayEvents);
  }

  // Get comprehensive earnings summary
  getEarningsSummary(events) {
    const totalEarnings = this.calculateTotalEarnings(events);
    const todayEarnings = this.calculateTodayEarnings(events);

    return {
      total: {
        amount: totalEarnings.total,
        formatted: `$${totalEarnings.total.toFixed(4)}`,
        breakdown: totalEarnings.breakdown,
        qualityScore: totalEarnings.qualityScore
      },
      today: {
        amount: todayEarnings.total,
        formatted: `$${todayEarnings.total.toFixed(4)}`,
        breakdown: todayEarnings.breakdown,
        qualityScore: todayEarnings.qualityScore
      },
      stats: {
        totalEvents: events.length,
        todayEvents: events.filter(event => 
          new Date(event.timestamp).toDateString() === new Date().toDateString()
        ).length,
        averagePerEvent: events.length > 0 ? totalEarnings.total / events.length : 0,
        overallQuality: totalEarnings.qualityScore
      }
    };
  }

  // Update base rates for dynamic pricing
  updateBaseRates(category, newBaseValue) {
    if (this.dataCategories[category]) {
      this.dataCategories[category].baseValue = newBaseValue;
    }
  }

  // Get current configuration
  getConfiguration() {
    return {
      dataCategories: this.dataCategories,
      depthMultipliers: this.depthMultipliers,
      marketMultipliers: this.marketMultipliers,
      freshnessMultipliers: this.freshnessMultipliers,
      qualityThresholds: this.qualityThresholds
    };
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EarningsCalculator;
} else if (typeof window !== 'undefined') {
  window.EarningsCalculator = EarningsCalculator;
}