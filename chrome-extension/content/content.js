// Content script for TubeDAO Chrome Extension
class TubeDAOMonitor {
  constructor() {
    this.consentEnabled = false;
    this.sessionId = this.generateSessionId();
    this.eventBuffer = [];
    this.lastVideoId = null;
    this.currentVideoData = null;
    this.adStartTime = null;
    this.lastProgressTime = 0;
    
    this.init();
  }

  async init() {
    console.log('TubeDAO Monitor initialized on YouTube');
    
    await this.loadConsentState();
    
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'CONSENT_CHANGED') {
        this.consentEnabled = message.enabled;
        if (this.consentEnabled) {
          this.startMonitoring();
        } else {
          this.stopMonitoring();
        }
      }
    });

    if (this.consentEnabled) {
      this.startMonitoring();
    }

    this.observePageChanges();
  }

  async loadConsentState() {
    const result = await chrome.storage.local.get(['consentEnabled']);
    this.consentEnabled = result.consentEnabled || false;
  }

  startMonitoring() {
    console.log('TubeDAO: Data collection enabled');
    this.setupVideoEventListeners();
    this.setupAdEventListeners();
    this.setupUIEventListeners();
    this.captureEvent('session_start', 'session', { session_id: this.sessionId });
  }

  stopMonitoring() {
    console.log('TubeDAO: Data collection disabled');
    this.captureEvent('session_end', 'session', { session_id: this.sessionId });
  }

  setupVideoEventListeners() {
    const checkForPlayer = () => {
      const video = document.querySelector('video');
      if (video && video !== this.currentVideo) {
        this.currentVideo = video;
        this.attachVideoListeners(video);
      }
    };

    setInterval(checkForPlayer, 2000);
    checkForPlayer();
  }

  attachVideoListeners(video) {
    if (video.dataset.tubeDAOAttached) {
      return;
    }

    video.dataset.tubeDAOAttached = 'true';

    video.addEventListener('play', () => this.handleVideoEvent('play'));
    video.addEventListener('pause', () => this.handleVideoEvent('pause'));
    video.addEventListener('ended', () => this.handleVideoEvent('ended'));
    video.addEventListener('seeking', () => this.handleVideoEvent('seek_start'));
    video.addEventListener('seeked', () => this.handleVideoEvent('seek_end'));
    video.addEventListener('ratechange', () => this.handleVideoEvent('speed_change', { playback_rate: video.playbackRate }));

    video.addEventListener('resize', () => {
      const quality = this.getVideoQuality(video);
      this.handleVideoEvent('quality_change', { quality });
    });

    video.addEventListener('timeupdate', () => {
      const currentTime = Math.floor(video.currentTime);
      if (currentTime > 0 && currentTime % 10 === 0 && currentTime !== this.lastProgressTime) {
        this.lastProgressTime = currentTime;
        this.handleVideoEvent('progress_checkpoint', { 
          progress_seconds: currentTime,
          progress_percentage: Math.round((currentTime / video.duration) * 100)
        });
      }
    });

    console.log('Video event listeners attached successfully');
  }

  handleVideoEvent(eventType, additionalData = {}) {
    if (!this.consentEnabled) return;

    const video = document.querySelector('video');
    const videoId = this.extractVideoId();
    
    const currentTime = video ? video.currentTime : 0;
    const duration = video ? video.duration : 0;
    
    const eventData = {
      video_id: videoId,
      current_time_seconds: currentTime ? Math.round(currentTime * 100) / 100 : 0, // Precise to 2 decimals
      current_time_formatted: this.formatVideoTime(currentTime),
      duration_seconds: duration ? Math.round(duration) : null,
      duration_formatted: this.formatVideoTime(duration),
      watch_progress_percentage: (currentTime && duration) ? Math.round((currentTime / duration) * 100) : 0,
      volume: video ? Math.round(video.volume * 100) : null,
      playback_rate: video ? video.playbackRate : 1,
      video_quality: this.getVideoQuality(video),
      is_paused: video ? video.paused : true,
      is_muted: video ? video.muted : false,
      ...additionalData
    };

    this.captureEvent(eventType, 'playback', eventData);
  }

  setupAdEventListeners() {
    const adObserver = new MutationObserver((mutations) => {
      if (!this.consentEnabled) return;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            this.checkForAds(node);
          }
        });
      });
    });

    adObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    this.monitorSkipButtons();
  }

  checkForAds(element) {
    const adSelectors = [
      '.ytp-ad-module',
      '.video-ads',
      '.ytp-ad-overlay-container',
      '[class*="ad-container"]',
      '[class*="advertisement"]'
    ];

    adSelectors.forEach(selector => {
      if (element.matches && element.matches(selector) || element.querySelector && element.querySelector(selector)) {
        this.handleAdEvent('ad_start');
        this.adStartTime = Date.now();
      }
    });
  }

  monitorSkipButtons() {
    const checkSkipButton = () => {
      const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, [class*="skip"]');
      if (skipButton && !skipButton.dataset.tubeDAOMonitored) {
        skipButton.dataset.tubeDAOMonitored = 'true';
        skipButton.addEventListener('click', () => {
          this.handleAdEvent('ad_skip', {
            ad_duration: this.adStartTime ? Math.round((Date.now() - this.adStartTime) / 1000) : null
          });
        });
      }
    };

    setInterval(checkSkipButton, 1000);
  }

  handleAdEvent(eventType, additionalData = {}) {
    if (!this.consentEnabled) return;

    const eventData = {
      video_id: this.extractVideoId(),
      ad_position: this.getAdPosition(),
      ...additionalData
    };

    this.captureEvent(eventType, 'ad', eventData);
  }

  setupUIEventListeners() {
    document.addEventListener('click', (event) => {
      if (!this.consentEnabled) return;

      const target = event.target;
      const button = target.closest('button, [role="button"]');
      
      if (button) {
        this.handleUIEvent(button);
      }
    });
  }

  handleUIEvent(element) {
    let eventType = 'ui_interaction';
    let category = 'engagement';
    let additionalData = {};

    const classList = element.className;
    const ariaLabel = element.getAttribute('aria-label') || '';

    if (classList.includes('like') || ariaLabel.includes('like')) {
      eventType = 'like_click';
    } else if (classList.includes('subscribe') || ariaLabel.includes('Subscribe')) {
      eventType = 'subscribe_click';
    } else if (classList.includes('share') || ariaLabel.includes('Share')) {
      eventType = 'share_click';
    } else if (classList.includes('fullscreen') || ariaLabel.includes('Fullscreen')) {
      eventType = 'fullscreen_toggle';
      category = 'playback';
    } else if (classList.includes('theater') || ariaLabel.includes('Theater')) {
      eventType = 'theater_mode';
      category = 'playback';
    }

    const video = document.querySelector('video');
    const videoId = this.extractVideoId();
    const currentTime = video ? video.currentTime : 0;
    
    this.captureEvent(eventType, category, {
      video_id: videoId,
      element_type: element.tagName.toLowerCase(),
      current_time_seconds: videoId && currentTime ? Math.round(currentTime * 100) / 100 : null,
      current_time_formatted: videoId && currentTime ? this.formatVideoTime(currentTime) : null,
      ...additionalData
    });
  }

  observePageChanges() {
    let lastUrl = location.href;
    
    const urlObserver = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        this.handlePageChange();
      }
    });

    urlObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  handlePageChange() {
    const newVideoId = this.extractVideoId();
    
    if (newVideoId && newVideoId !== this.lastVideoId) {
      this.lastVideoId = newVideoId;
      
      if (this.consentEnabled) {
        this.captureEvent('video_load', 'navigation', {
          video_id: newVideoId,
          page_type: this.getPageType()
        });
      }

      setTimeout(() => {
        this.setupVideoEventListeners();
      }, 1000);
    }
  }

  async captureEvent(eventType, category, data = {}) {
    if (!this.consentEnabled) return;

    const event = {
      event_type: eventType,
      category: category,
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      page_url: location.href,
      user_agent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      ...data
    };

    this.eventBuffer.push(event);

    if (this.eventBuffer.length >= 10) {
      await this.flushEvents();
    }

    try {
      chrome.runtime.sendMessage({ type: 'STATS_UPDATE' });
    } catch (e) {
    }
  }

  async flushEvents() {
    if (this.eventBuffer.length === 0) return;

    try {
      const result = await chrome.storage.local.get(['tubeDAOEvents']);
      const existingEvents = result.tubeDAOEvents || [];
      const updatedEvents = [...existingEvents, ...this.eventBuffer];

      await chrome.storage.local.set({ tubeDAOEvents: updatedEvents });
      this.eventBuffer = [];

      console.log(`Flushed ${this.eventBuffer.length} events to storage`);
    } catch (error) {
      console.error('Failed to flush events:', error);
    }
  }

  extractVideoId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('v');
  }

  getPageType() {
    const path = window.location.pathname;
    if (path.includes('/watch')) return 'watch';
    if (path.includes('/shorts')) return 'shorts';
    if (path.includes('/channel')) return 'channel';
    if (path === '/') return 'home';
    return 'other';
  }

  getVideoQuality(video) {
    if (!video) return null;
    
    const width = video.videoWidth;
    if (width >= 1920) return '1080p+';
    if (width >= 1280) return '720p';
    if (width >= 854) return '480p';
    if (width >= 640) return '360p';
    return 'low';
  }

  getAdPosition() {
    const video = document.querySelector('video');
    if (!video) return 'unknown';
    
    const currentTime = video.currentTime;
    const duration = video.duration;
    
    if (currentTime < 5) return 'pre-roll';
    if (duration && currentTime > duration - 30) return 'post-roll';
    return 'mid-roll';
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  formatVideoTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  }
}

const monitor = new TubeDAOMonitor();

window.addEventListener('beforeunload', () => {
  monitor.flushEvents();
}); 