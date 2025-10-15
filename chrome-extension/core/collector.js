class UniversalCollector {
  constructor(registry) {
    this.registry = registry;
    this.sessionId = this.generateSessionId();
    this.eventBuffer = [];
    this.isUnlocked = false;
    this.isUploading = false;
    this.currentAdapter = null;
    this.consentEnabled = false;
    
    this.init();
  }

  async init() {
    await this.checkAuthStatus();
    await this.checkConsentStatus();
    
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
    });

    this.setupWalletListeners();
    
    if (this.isUnlocked && this.consentEnabled) {
      await this.startMonitoring();
    } else {
      this.showAuthRequiredNotification();
    }
  }

  async checkAuthStatus() {
    try {
      if (!chrome || !chrome.runtime) return;
      
      const response = await chrome.runtime.sendMessage({ type: 'GET_AUTH_STATUS' });
      this.isUnlocked = response.isUnlocked;
      
      if (!this.isUnlocked) {
        this.blockAllFeatures();
      }
    } catch (error) {
      this.blockAllFeatures();
    }
  }

  async checkConsentStatus() {
    try {
      if (!chrome || !chrome.storage) return;
      
      const result = await chrome.storage.local.get(['consentEnabled']);
      this.consentEnabled = result.consentEnabled || false;
    } catch (error) {
      this.consentEnabled = false;
    }
  }

  handleMessage(message, sender, sendResponse) {
    switch (message.type) {
      case 'AUTH_SUCCESS':
        this.isUnlocked = true;
        if (this.consentEnabled) {
          this.startMonitoring();
        }
        this.hideAuthNotification();
        break;
        
      case 'AUTH_REQUIRED':
        this.isUnlocked = false;
        this.blockAllFeatures();
        this.showAuthRequiredNotification();
        break;
        
      case 'CONSENT_CHANGED':
        this.consentEnabled = message.enabled;
        
        if (this.isUnlocked && this.consentEnabled) {
          this.startMonitoring();
        } else {
          this.stopMonitoring();
          this.eventBuffer = [];
        }
        break;
        
      case 'PING':
        sendResponse({ status: 'ok', isUnlocked: this.isUnlocked, consentEnabled: this.consentEnabled });
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

  handleAccountChange(newAccount) {
    if (!chrome || !chrome.runtime) return;
    
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
      window.open('https://www.tubedao.org', '_blank');
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

  async startMonitoring() {
    if (!this.isUnlocked) return;
    
    const adapter = this.registry.getAdapter(window.location.hostname);
    this.currentAdapter = new adapter(this);
    
    this.setupUniversalListeners();
    
    await this.currentAdapter.init();
    
    this.captureEvent('session_start', 'session', { 
      session_id: this.sessionId,
      site: window.location.hostname,
      adapter: this.currentAdapter.constructor.name
    });
    
    this.setupPeriodicUpload();
  }

  stopMonitoring() {
    if (this.isUnlocked) {
      this.captureEvent('session_end', 'session', { session_id: this.sessionId });
    }
    
    if (this.currentAdapter && this.currentAdapter.cleanup) {
      this.currentAdapter.cleanup();
    }
  }

  setupUniversalListeners() {
    document.addEventListener('click', (e) => this.handleUniversalClick(e), true);
    document.addEventListener('scroll', () => this.handleUniversalScroll(), { passive: true });
    window.addEventListener('beforeunload', () => this.handleBeforeUnload());
    
    this.observePageChanges();
    this.setupMediaListeners();
    this.setupInputListeners();
  }

  handleUniversalClick(event) {
    if (!this.isUnlocked) return;

    const target = event.target;
    const eventData = {
      element_type: target.tagName.toLowerCase(),
      element_classes: target.className,
      element_id: target.id,
      element_text: target.innerText?.substring(0, 100),
      xpath: this.getXPath(target),
      viewport_position: {
        x: event.clientX,
        y: event.clientY
      }
    };

    this.captureEvent('click', 'interaction', eventData);
    
    if (this.currentAdapter && this.currentAdapter.handleClick) {
      this.currentAdapter.handleClick(event, eventData);
    }
  }

  handleUniversalScroll() {
    if (!this.isUnlocked) return;

    const scrollDepth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollDepth > 0 && scrollDepth % 25 === 0) {
      this.captureEvent('scroll_checkpoint', 'engagement', {
        scroll_depth_percentage: scrollDepth,
        scroll_position: window.scrollY
      });
    }

    if (this.currentAdapter && this.currentAdapter.handleScroll) {
      this.currentAdapter.handleScroll(scrollDepth);
    }
  }

  handleBeforeUnload() {
    if (this.isUnlocked && this.eventBuffer.length > 0) {
      this.flushEvents();
    }
  }

  setupMediaListeners() {
    const mediaObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const videos = node.querySelectorAll ? node.querySelectorAll('video') : [];
            videos.forEach(video => this.attachVideoListeners(video));
            
            const audios = node.querySelectorAll ? node.querySelectorAll('audio') : [];
            audios.forEach(audio => this.attachAudioListeners(audio));
          }
        });
      });
    });

    mediaObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  attachVideoListeners(video) {
    if (video.dataset.tubeDAOAttached) return;
    video.dataset.tubeDAOAttached = 'true';

    video.addEventListener('play', () => {
      this.captureEvent('video_play', 'media', this.getMediaContext(video));
    });
    
    video.addEventListener('pause', () => {
      this.captureEvent('video_pause', 'media', this.getMediaContext(video));
    });
    
    video.addEventListener('ended', () => {
      this.captureEvent('video_ended', 'media', this.getMediaContext(video));
    });

    if (this.currentAdapter && this.currentAdapter.attachVideoListeners) {
      this.currentAdapter.attachVideoListeners(video);
    }
  }

  attachAudioListeners(audio) {
    if (audio.dataset.tubeDAOAttached) return;
    audio.dataset.tubeDAOAttached = 'true';

    audio.addEventListener('play', () => {
      this.captureEvent('audio_play', 'media', this.getMediaContext(audio));
    });
    
    audio.addEventListener('pause', () => {
      this.captureEvent('audio_pause', 'media', this.getMediaContext(audio));
    });
  }

  getMediaContext(media) {
    return {
      src: media.src || media.currentSrc,
      current_time: media.currentTime,
      duration: media.duration,
      volume: media.volume,
      muted: media.muted
    };
  }

  setupInputListeners() {
    let inputTimeout;
    
    document.addEventListener('input', (e) => {
      if (!this.isUnlocked) return;
      
      clearTimeout(inputTimeout);
      inputTimeout = setTimeout(() => {
        const target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          this.captureEvent('input_interaction', 'interaction', {
            input_type: target.type,
            input_name: target.name,
            input_id: target.id,
            value_length: target.value?.length || 0
          });
        }
      }, 1000);
    }, true);
  }

  observePageChanges() {
    let lastUrl = location.href;
    
    const urlObserver = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        const oldUrl = lastUrl;
        lastUrl = location.href;
        this.handlePageChange(oldUrl, lastUrl);
      }
    });

    urlObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  handlePageChange(oldUrl, newUrl) {
    this.captureEvent('navigation', 'navigation', {
      from_url: oldUrl,
      to_url: newUrl
    });

    if (this.currentAdapter && this.currentAdapter.handlePageChange) {
      this.currentAdapter.handlePageChange(oldUrl, newUrl);
    }
  }

  setupPeriodicUpload() {
    setInterval(async () => {
      if (this.isUnlocked && this.eventBuffer.length >= 5 && !this.isUploading) {
        await this.flushEvents();
      }
    }, 5 * 60 * 1000);
  }

  async captureEvent(eventType, category, data = {}) {
    if (!this.isUnlocked || !this.consentEnabled) return;

    const event = {
      event_type: eventType,
      category: category,
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      page_url: location.href,
      site: window.location.hostname,
      adapter: this.currentAdapter?.constructor.name || 'none',
      user_agent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      ...data
    };

    this.eventBuffer.push(event);

    if (this.eventBuffer.length >= 10 && !this.isUploading) {
      await this.flushEvents();
    }

    try {
      if (chrome && chrome.runtime) {
        chrome.runtime.sendMessage({ type: 'STATS_UPDATE' });
      }
    } catch (e) {
      console.error('Failed to send stats update:', e);
    }
  }

  async flushEvents() {
    if (this.eventBuffer.length === 0 || this.isUploading) return;
    
    this.isUploading = true;
    const eventsToUpload = [...this.eventBuffer];
    this.eventBuffer = [];

    try {
      if (!chrome || !chrome.storage || !chrome.runtime) {
        console.log('Chrome APIs not available');
        return;
      }

      const result = await chrome.storage.local.get(['tubeDAOEvents']);
      const existingEvents = result.tubeDAOEvents || [];
      const updatedEvents = [...existingEvents, ...eventsToUpload];
      await chrome.storage.local.set({ tubeDAOEvents: updatedEvents });

      try {
        const uploadResult = await chrome.runtime.sendMessage({
          type: 'UPLOAD_EVENTS',
          events: eventsToUpload
        });

        if (uploadResult.success) {
          console.log('Events uploaded successfully:', uploadResult.data);
        } else {
          console.log('Event upload failed, keeping local copy:', uploadResult.error);
        }
      } catch (uploadError) {
        console.log('Event upload failed, keeping local copy:', uploadError);
      }
    } catch (error) {
      console.error('Failed to flush events:', error);
      this.eventBuffer.push(...eventsToUpload);
    } finally {
      this.isUploading = false;
    }
  }

  getXPath(element) {
    if (element.id) return `//*[@id="${element.id}"]`;
    
    if (element === document.body) return '/html/body';
    
    let ix = 0;
    const siblings = element.parentNode?.childNodes || [];
    
    for (let i = 0; i < siblings.length; i++) {
      const sibling = siblings[i];
      if (sibling === element) {
        return this.getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
      }
      if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
        ix++;
      }
    }
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  formatTime(seconds) {
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

