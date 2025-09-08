// Content script for TubeDAO Chrome Extension with Authentication
class TubeDAOMonitor {
  constructor() {
    this.isUnlocked = false;
    this.sessionId = this.generateSessionId();
    this.eventBuffer = [];
    this.lastVideoId = null;
    this.currentVideoData = null;
    this.adStartTime = null;
    this.lastProgressTime = 0;
    this.currentAccount = null;
    this.currentChainId = null;
    
    this.init();
  }

  async init() {
    await this.checkAuthStatus();
    
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleAuthMessage(message, sender, sendResponse);
    });

    this.setupWalletListeners();
    
    if (this.isUnlocked) {
      this.startMonitoring();
    } else {
      this.showAuthRequiredNotification();
    }

    this.observePageChanges();
  }

  async checkAuthStatus() {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_AUTH_STATUS' });
      this.isUnlocked = response.isUnlocked;
      
      if (!this.isUnlocked) {
        this.blockAllFeatures();
      }
    } catch (error) {
      console.log('Failed to check auth status:', error);
      this.blockAllFeatures();
    }
  }

  handleAuthMessage(message, sender, sendResponse) {
    switch (message.type) {
      case 'AUTH_SUCCESS':
        this.isUnlocked = true;
        this.startMonitoring();
        this.hideAuthNotification();
        break;
        
      case 'AUTH_REQUIRED':
        this.isUnlocked = false;
        this.blockAllFeatures();
        this.showAuthRequiredNotification();
        break;
        
      case 'PING':
        sendResponse({ status: 'ok', isUnlocked: this.isUnlocked });
        break;
        
      default:
        break;
    }
  }

  blockAllFeatures() {
    this.isUnlocked = false;
    this.stopMonitoring();
    this.eventBuffer = [];
  }

  setupWalletListeners() {
    if (typeof window.ethereum !== 'undefined') {
      this.monitorWalletChanges();
    } else {
      const checkForWallet = setInterval(() => {
        if (typeof window.ethereum !== 'undefined') {
          clearInterval(checkForWallet);
          this.monitorWalletChanges();
        }
      }, 1000);
      
      // Stop checking after 30 seconds
      setTimeout(() => clearInterval(checkForWallet), 30000);
    }
  }

  monitorWalletChanges() {
    if (!window.ethereum) return;

    window.ethereum.on('accountsChanged', (accounts) => {
      const newAccount = accounts[0];
      if (newAccount !== this.currentAccount) {
        this.currentAccount = newAccount;
        this.handleAccountChange(newAccount);
      }
    });

    if (window.ethereum.selectedAddress) {
      this.currentAccount = window.ethereum.selectedAddress;
    }
  }

  // Notify background script about account change
  handleAccountChange(newAccount) {
    chrome.runtime.sendMessage({
      type: 'ACCOUNT_CHANGED',
      oldAccount: this.currentAccount,
      newAccount: newAccount
    });
    
    this.blockAllFeatures();
    this.showAuthRequiredNotification('Account changed - please re-authenticate');
  }



  showAuthRequiredNotification(customMessage) {
    this.hideAuthNotification();
    
    const message = customMessage || 'Authentication required - visit TubeDAO homepage to sign in';
    
    const notification = document.createElement('div');
    notification.id = 'tubedao-auth-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d1b3d 100%);
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      border: 1px solid #ef4444;
      box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      max-width: 300px;
      z-index: 10000;
      backdrop-filter: blur(10px);
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 8px; height: 8px; background: #ef4444; border-radius: 50%; animation: pulse 2s infinite;"></div>
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">TubeDAO</div>
          <div style="font-size: 12px; opacity: 0.9; margin-bottom: 8px;">${message}</div>
          <button id="tubedao-auth-button" style="
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            transition: transform 0.2s;
          ">
            Authenticate
          </button>
        </div>
        <button id="tubedao-close-notification" style="
          background: none;
          border: none;
          color: #666;
          font-size: 16px;
          cursor: pointer;
          padding: 0;
          width: 20px;
          height: 20px;
        ">×</button>
      </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      #tubedao-auth-button:hover {
        transform: translateY(-1px);
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    notification.querySelector('#tubedao-auth-button').addEventListener('click', () => {
      window.open('http://localhost:3000', '_blank');
    });
    
    notification.querySelector('#tubedao-close-notification').addEventListener('click', () => {
      this.hideAuthNotification();
    });
    
    setTimeout(() => {
      this.hideAuthNotification();
    }, 10000);
  }

  hideAuthNotification() {
    const notification = document.getElementById('tubedao-auth-notification');
    if (notification) {
      notification.remove();
    }
  }

  startMonitoring() {
    if (!this.isUnlocked) return;
    
    this.setupVideoEventListeners();
    this.setupAdEventListeners();
    this.setupUIEventListeners();
    this.captureEvent('session_start', 'session', { session_id: this.sessionId });
    
    // Set up periodic upload of any remaining events
    this.setupPeriodicUpload();
  }

  stopMonitoring() {
    if (this.isUnlocked) {
      this.captureEvent('session_end', 'session', { session_id: this.sessionId });
    }
  }

  setupPeriodicUpload() {
    // Upload any pending events every 5 minutes
    setInterval(async () => {
      if (this.isUnlocked && this.eventBuffer.length > 0) {
        await this.flushEvents();
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Also upload on page unload
    window.addEventListener('beforeunload', async () => {
      if (this.isUnlocked && this.eventBuffer.length > 0) {
        await this.flushEvents();
      }
    });
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

  }

  handleVideoEvent(eventType, additionalData = {}) {
    if (!this.isUnlocked) return;

    const video = document.querySelector('video');
    const videoId = this.extractVideoId();
    
    const currentTime = video ? video.currentTime : 0;
    const duration = video ? video.duration : 0;
    
    const eventData = {
      video_id: videoId,
      current_time_seconds: currentTime ? Math.round(currentTime * 100) / 100 : 0,
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
      if (!this.isUnlocked) return;

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
    if (!this.isUnlocked) return;

    const eventData = {
      video_id: this.extractVideoId(),
      ad_position: this.getAdPosition(),
      ...additionalData
    };

    this.captureEvent(eventType, 'ad', eventData);
  }

  setupUIEventListeners() {
    document.addEventListener('click', (event) => {
      if (!this.isUnlocked) return;

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
      
      if (this.isUnlocked) {
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
    if (!this.isUnlocked) return;

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
      console.error('Failed to send stats update:', e);
    }
  }

  async flushEvents() {
    if (this.eventBuffer.length === 0) return;

    try {
      // Store locally first
      const result = await chrome.storage.local.get(['tubeDAOEvents']);
      const existingEvents = result.tubeDAOEvents || [];
      const updatedEvents = [...existingEvents, ...this.eventBuffer];
      await chrome.storage.local.set({ tubeDAOEvents: updatedEvents });

      // Try to upload to backend
      try {
        const uploadResult = await chrome.runtime.sendMessage({
          type: 'UPLOAD_EVENTS',
          events: this.eventBuffer
        });

        if (uploadResult.success) {
          console.log('Events uploaded successfully:', uploadResult.data);
        } else {
          console.log('Event upload failed, keeping local copy:', uploadResult.error);
        }
      } catch (uploadError) {
        console.log('Event upload failed, keeping local copy:', uploadError);
      }

      this.eventBuffer = [];
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