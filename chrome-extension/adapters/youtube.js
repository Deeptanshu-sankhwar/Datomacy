class YouTubeAdapter extends BaseAdapter {
  constructor(collector) {
    super(collector);
    this.lastVideoId = null;
    this.adStartTime = null;
    this.lastProgressTime = 0;
    this.currentVideo = null;
  }

  async init() {
    await super.init();
    
    this.setupYouTubeSpecificListeners();
    this.setupAdDetection();
    this.setupYouTubeUIListeners();
  }

  setupYouTubeSpecificListeners() {
    const checkForPlayer = () => {
      const video = document.querySelector('video');
      if (video && video !== this.currentVideo) {
        this.currentVideo = video;
        this.attachYouTubeVideoListeners(video);
      }
    };

    setInterval(checkForPlayer, 2000);
    checkForPlayer();
  }

  attachVideoListeners(video) {
    this.attachYouTubeVideoListeners(video);
  }

  attachYouTubeVideoListeners(video) {
    if (video.dataset.youtubeAdapterAttached) return;
    video.dataset.youtubeAdapterAttached = 'true';

    video.addEventListener('play', () => this.handleVideoEvent('play'));
    video.addEventListener('pause', () => this.handleVideoEvent('pause'));
    video.addEventListener('ended', () => this.handleVideoEvent('ended'));
    video.addEventListener('seeking', () => this.handleVideoEvent('seek_start'));
    video.addEventListener('seeked', () => this.handleVideoEvent('seek_end'));
    video.addEventListener('ratechange', () => this.handleVideoEvent('speed_change', { playback_rate: video.playbackRate }));

    video.addEventListener('resize', () => {
      const quality = TubeDAOUtils.getVideoQuality(video);
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
  }

  handleVideoEvent(eventType, additionalData = {}) {
    const video = document.querySelector('video');
    const videoId = TubeDAOUtils.extractVideoId();
    
    const currentTime = video ? video.currentTime : 0;
    const duration = video ? video.duration : 0;
    
    const eventData = {
      video_id: videoId,
      current_time_seconds: currentTime ? Math.round(currentTime * 100) / 100 : 0,
      current_time_formatted: TubeDAOUtils.formatTime(currentTime),
      duration_seconds: duration ? Math.round(duration) : null,
      duration_formatted: TubeDAOUtils.formatTime(duration),
      watch_progress_percentage: (currentTime && duration) ? Math.round((currentTime / duration) * 100) : 0,
      volume: video ? Math.round(video.volume * 100) : null,
      playback_rate: video ? video.playbackRate : 1,
      video_quality: TubeDAOUtils.getVideoQuality(video),
      is_paused: video ? video.paused : true,
      is_muted: video ? video.muted : false,
      ...additionalData
    };

    this.captureEvent(eventType, 'playback', eventData);
  }

  setupAdDetection() {
    const adObserver = new MutationObserver((mutations) => {
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
    const eventData = {
      video_id: TubeDAOUtils.extractVideoId(),
      ad_position: this.getAdPosition(),
      ...additionalData
    };

    this.captureEvent(eventType, 'ad', eventData);
  }

  setupYouTubeUIListeners() {
    document.addEventListener('click', (event) => {
      const target = event.target;
      const button = target.closest('button, [role="button"]');
      
      if (button) {
        this.handleYouTubeUIEvent(button);
      }
    }, true);
  }

  handleYouTubeUIEvent(element) {
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
    } else {
      return;
    }

    const video = document.querySelector('video');
    const videoId = TubeDAOUtils.extractVideoId();
    const currentTime = video ? video.currentTime : 0;
    
    this.captureEvent(eventType, category, {
      video_id: videoId,
      element_type: element.tagName.toLowerCase(),
      current_time_seconds: videoId && currentTime ? Math.round(currentTime * 100) / 100 : null,
      current_time_formatted: videoId && currentTime ? TubeDAOUtils.formatTime(currentTime) : null,
      ...additionalData
    });
  }

  handlePageChange(oldUrl, newUrl) {
    const newVideoId = TubeDAOUtils.extractVideoId(newUrl);
    
    if (newVideoId && newVideoId !== this.lastVideoId) {
      this.lastVideoId = newVideoId;
      
      this.captureEvent('video_load', 'navigation', {
        video_id: newVideoId,
        page_type: TubeDAOUtils.getPageType(new URL(newUrl).pathname)
      });

      setTimeout(() => {
        this.setupYouTubeSpecificListeners();
      }, 1000);
    }
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

  cleanup() {
    super.cleanup();
    this.currentVideo = null;
    this.lastVideoId = null;
  }
}

