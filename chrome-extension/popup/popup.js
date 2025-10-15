class TubeDAOPopup {
  constructor() {
    // UI Elements
    this.authCard = document.getElementById('authCard');
    this.connectedState = document.getElementById('connectedState');
    this.authButton = document.getElementById('authButton');
    this.refreshButton = document.getElementById('refreshButton');
    this.consentToggle = document.getElementById('consentToggle');
    this.statusIndicator = document.getElementById('statusIndicator');
    this.statusText = document.getElementById('statusText');
    this.totalEarnings = document.getElementById('totalEarnings');
    this.todayEvents = document.getElementById('todayEvents');
    this.activityList = document.getElementById('activityList');
    this.activityPulse = document.getElementById('activityPulse');
    this.themeToggle = document.getElementById('themeToggle');
    
    // State
    this.isAuthenticated = false;
    this.authToken = null;
    this.consentEnabled = false;
    this.events = [];
    this.stats = { total: 0, today: 0 };
    this.earnings = { total: 0, today: 0 };
    this.isDarkMode = true;

    // Initialize earnings calculator
    this.earningsCalculator = new EarningsCalculator();

    this.init();
  }

  async init() {
    await this.loadTheme();
    await this.checkAuthentication();
    await this.loadSettings();
    await this.loadStats();
    this.setupEventListeners();
    this.updateUI();
    this.startActivityMonitoring();
  }

  async checkAuthentication() {
    try {
      try {
        await chrome.runtime.sendMessage({ type: 'PING' });
      } catch (bgError) {
        this.isAuthenticated = false;
        this.updateUI();
        return;
      }
      
      const result = await chrome.storage.session.get(['tubedao_auth_token', 'tubedao_address', 'tubedao_expiresAt']);
      
      this.authToken = result.tubedao_auth_token;
      this.isAuthenticated = !!this.authToken;
    } catch (error) {
      this.isAuthenticated = false;
    }
  }

  async loadSettings() {
    const result = await chrome.storage.local.get(['consentEnabled']);
    this.consentEnabled = result.consentEnabled || false;
    this.consentToggle.checked = this.consentEnabled;
  }

  async loadStats() {
    const result = await chrome.storage.local.get(['tubeDAOEvents']);
    this.events = result.tubeDAOEvents || [];
    
    const today = new Date().toDateString();
    const todayEvents = this.events.filter(event => 
      new Date(event.timestamp).toDateString() === today
    );
    
    this.stats = {
      total: this.events.length,
      today: todayEvents.length
    };
    
    this.earningsSummary = this.earningsCalculator.getEarningsSummary(this.events);
    this.earnings = {
      total: this.earningsSummary.total.formatted,
      today: this.earningsSummary.today.formatted
    };
  }

  setupEventListeners() {
    this.themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });

    this.authButton.addEventListener('click', () => {
      if (this.isAuthenticated) {
        this.handleConsentChange(true);
        this.consentToggle.checked = true;
      } else {
        this.redirectToHomepage();
      }
    });

    this.refreshButton.addEventListener('click', async () => {
      await this.refreshAuthStatus();
    });

    // Prevent dashboard button clicks
    const dashboardButton = document.getElementById('dashboardButton');
    if (dashboardButton) {
      dashboardButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
    }

    this.consentToggle.addEventListener('change', (e) => {
      this.handleConsentChange(e.target.checked);
    });

    // Listen for messages from background/content scripts
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'STATS_UPDATE') {
        this.handleStatsUpdate();
      } else if (message.type === 'AUTH_SUCCESS') {
        this.handleAuthSuccess(message);
      } else if (message.type === 'AUTH_REQUIRED') {
        this.handleAuthRequired();
      }
    });
  }

  async handleConsentChange(enabled) {
    if (enabled && !this.isAuthenticated) {
      this.consentToggle.checked = false;
      this.showToast('Please connect your wallet first', 'error');
      return;
    }

    this.consentEnabled = enabled;
    await chrome.storage.local.set({ consentEnabled: enabled });
    
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'CONSENT_CHANGED',
            enabled: enabled
          }).catch(() => {});
        }
      });
    });

    this.updateUI();
    this.showToast(enabled ? 'Data capture enabled' : 'Data capture disabled', enabled ? 'success' : 'error');
  }

  handleAuthSuccess(message) {
    this.isAuthenticated = true;
    this.authToken = message.token;
    this.updateUI();
    this.showToast('Wallet connected successfully', 'success');
  }

  handleAuthRequired() {
    this.isAuthenticated = false;
    this.authToken = null;
    
    chrome.storage.session.remove([
      'tubedao_auth_token',
      'tubedao_address', 
      'tubedao_chainId',
      'tubedao_expiresAt'
    ]);

    if (this.consentEnabled) {
      this.consentToggle.checked = false;
      this.consentEnabled = false;
      chrome.storage.local.set({ consentEnabled: false });
    }

    this.updateUI();
  }

  async handleStatsUpdate() {
    await this.loadStats();
    this.updateStats();
    this.updateActivity();
  }

  redirectToHomepage() {
    chrome.tabs.create({ 
      url: 'http://localhost:3000',
      active: true 
    });
  }

  async refreshAuthStatus() {
    this.showLoadingState();
    await this.checkAuthentication();
    await this.loadStats();
    this.updateUI();
    this.showToast('Status refreshed', 'success');
  }

  updateUI() {
    console.log('Popup: updateUI called - isAuthenticated:', this.isAuthenticated, 'consentEnabled:', this.consentEnabled);
    
    // Update header status
    if (this.consentEnabled && this.isAuthenticated) {
      console.log('Popup: Setting status to Active');
      this.statusIndicator.classList.add('active');
      this.statusText.textContent = 'Active';
    } else {
      console.log('Popup: Setting status to', this.isAuthenticated ? 'Connected' : 'Inactive');
      this.statusIndicator.classList.remove('active');
      this.statusText.textContent = this.isAuthenticated ? 'Connected' : 'Inactive';
    }

    // Show/hide UI sections
    if (this.isAuthenticated) {
      console.log('Popup: Showing connected state, hiding auth card');
      this.authCard.style.display = 'none';
      this.connectedState.style.display = 'flex';
    this.updateStats();
      this.updateActivity();
    } else {
      console.log('Popup: Showing auth card, hiding connected state');
      this.authCard.style.display = 'block';
      this.connectedState.style.display = 'none';
    }
    
    // Update activity pulse
    if (this.consentEnabled && this.isAuthenticated) {
      this.activityPulse.style.display = 'flex';
    } else {
      this.activityPulse.style.display = 'none';
    }
    
    console.log('Popup: UI update complete');
  }

  updateStats() {
    this.totalEarnings.textContent = this.earnings.total;
    this.todayEvents.textContent = this.stats.today.toString();
    
    // Add quality indicator if available
    if (this.earningsSummary && this.earningsSummary.total.qualityScore) {
      const qualityScore = (this.earningsSummary.total.qualityScore * 10).toFixed(0);
      this.totalEarnings.title = `Quality Score: ${qualityScore}/100`;
    }
  }

  updateActivity() {
    const recentEvents = this.events.slice(-50).reverse();
    
    // Filter to only meaningful events
    const meaningfulEvents = recentEvents.filter(event => this.isMeaningfulEvent(event)).slice(0, 15);
    
    if (meaningfulEvents.length > 0) {
      this.activityList.innerHTML = meaningfulEvents.map(event => {
        const favicon = this.getSiteFavicon(event.site || event.page_url);
        const metadata = this.getEventMetadata(event);
        const siteName = this.getSiteName(event.site || event.page_url);
        
        return `
          <div class="activity-item" title="${metadata.tooltip || ''}">
            <img src="${favicon}" class="activity-favicon" alt="${siteName}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22><rect width=%2216%22 height=%2216%22 fill=%22%23666%22/></svg>'">
            <div class="activity-content">
              <div class="activity-main">
                <span class="activity-type">${metadata.title}</span>
                ${metadata.subtitle ? `<span class="activity-subtitle">${metadata.subtitle}</span>` : ''}
              </div>
              <div class="activity-meta">
                <span class="activity-site">${siteName}</span>
                <span class="activity-time">${this.formatTime(event.timestamp)}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      this.activityList.innerHTML = `
        <div class="activity-empty">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" opacity="0.3">
            <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="2"/>
            <path d="M16 10V16L20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p>No recent activity</p>
          <p style="font-size: 11px; opacity: 0.5; margin-top: 4px;">Visit websites to start capturing data</p>
        </div>
      `;
    }
  }

  isMeaningfulEvent(event) {
    const eventType = event.event_type;
    
    // Always show these high-value events
    const highValueEvents = [
      // YouTube
      'video_load', 'progress_checkpoint', 'like_click', 'subscribe_click', 
      'share_click', 'ad_skip', 'play', 'pause',
      
      // Twitter/X
      'tweet_view', 'tweet_like', 'tweet_retweet', 'tweet_reply', 
      'tweet_share', 'user_follow',
      
      // Reddit
      'post_view', 'post_upvote', 'post_downvote', 'post_save', 
      'subreddit_join', 'post_share',
      
      // Medium
      'article_view', 'reading_progress', 'article_clap', 'article_bookmark',
      'author_follow',
      
      // Navigation
      'navigation', 'session_start'
    ];
    
    if (highValueEvents.includes(eventType)) {
      return true;
    }
    
    // Show clicks only if they have meaningful text (not IDs/containers)
    if (eventType === 'click') {
      const text = event.element_text?.trim();
      // Filter out DOM noise - IDs, random strings, single chars
      if (text && text.length > 2 && text.length < 50) {
        // Check if it's not a DOM ID or random string
        const hasNumbers = /\d{3,}/.test(text); // Long numbers = likely ID
        const isAllCaps = text === text.toUpperCase() && text.length > 4; // Long ALLCAPS = likely ID
        const hasSpecialChars = /[_\-]{2,}/.test(text); // Multiple dashes/underscores = likely class name
        
        if (!hasNumbers && !isAllCaps && !hasSpecialChars) {
          return true;
        }
      }
      return false; // Skip noisy clicks
    }
    
    // Show scroll only at major milestones
    if (eventType === 'scroll_checkpoint') {
      const depth = event.scroll_depth_percentage;
      return depth === 25 || depth === 50 || depth === 75 || depth === 100;
    }
    
    // Skip generic/noisy events
    const skipEvents = [
      'session_end', 'input_interaction', 'ui_interaction',
      'seek_start', 'seek_end', 'speed_change', 'quality_change',
      'video_resize', 'fullscreen_toggle', 'theater_mode'
    ];
    
    return !skipEvents.includes(eventType);
  }

  getSiteFavicon(siteOrUrl) {
    if (!siteOrUrl) return 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22><rect width=%2216%22 height=%2216%22 fill=%22%23666%22/></svg>';
    
    try {
      const url = siteOrUrl.includes('://') ? new URL(siteOrUrl) : { hostname: siteOrUrl };
      const domain = url.hostname || siteOrUrl;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22><rect width=%2216%22 height=%2216%22 fill=%22%23666%22/></svg>';
    }
  }

  getSiteName(siteOrUrl) {
    if (!siteOrUrl) return 'Unknown';
    
    try {
      const url = siteOrUrl.includes('://') ? new URL(siteOrUrl) : { hostname: siteOrUrl };
      const domain = (url.hostname || siteOrUrl).replace('www.', '');
      
      const siteNames = {
        'youtube.com': 'YouTube',
        'twitter.com': 'Twitter',
        'x.com': 'X',
        'reddit.com': 'Reddit',
        'medium.com': 'Medium',
        'github.com': 'GitHub',
        'linkedin.com': 'LinkedIn',
        'facebook.com': 'Facebook',
        'instagram.com': 'Instagram'
      };
      
      return siteNames[domain] || domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
    } catch {
      return 'Unknown';
    }
  }

  getEventMetadata(event) {
    const eventType = event.event_type;
    const category = event.category;
    
    // Extract page title from URL or metadata
    const pageTitle = this.extractPageTitle(event);
    
    // YouTube-specific events
    if (event.video_id || event.site?.includes('youtube')) {
      const videoId = event.video_id;
      
      if (eventType === 'video_load') {
        return {
          title: pageTitle || `Video ${videoId?.substring(0, 8)}`,
          subtitle: '📺 opened',
          tooltip: event.page_url
        };
      }
      if (eventType === 'progress_checkpoint') {
        const time = event.current_time_formatted || `${event.progress_seconds}s`;
        return {
          title: pageTitle || `Video ${videoId?.substring(0, 8)}`,
          subtitle: `▶️ at ${time} (${event.progress_percentage}%)`,
          tooltip: `Watched ${event.progress_percentage}% of video`
        };
      }
      if (eventType === 'play' || eventType === 'video_play') {
        return {
          title: pageTitle || `Video ${videoId?.substring(0, 8)}`,
          subtitle: '▶️ playing',
          tooltip: event.page_url
        };
      }
      if (eventType === 'pause') {
        const time = event.current_time_formatted;
        return {
          title: pageTitle || `Video ${videoId?.substring(0, 8)}`,
          subtitle: `⏸️ paused at ${time}`,
          tooltip: event.page_url
        };
      }
      if (eventType === 'like_click') {
        return { 
          title: pageTitle || `Video ${videoId?.substring(0, 8)}`,
          subtitle: '👍 liked'
        };
      }
      if (eventType === 'subscribe_click') {
        return { title: 'Channel subscription', subtitle: '🔔 subscribed' };
      }
      if (eventType === 'ad_skip') {
        return { title: 'Ad interaction', subtitle: `⏩ skipped (${event.ad_duration}s)` };
      }
    }
    
    // Twitter/X-specific events
    if (event.site?.includes('twitter') || event.site?.includes('x.com')) {
      const author = event.tweet_author ? `@${event.tweet_author}` : 'Tweet';
      
      if (eventType === 'tweet_view') {
        return {
          title: author,
          subtitle: '👁️ viewed tweet',
          tooltip: event.tweet_id
        };
      }
      if (eventType === 'tweet_like') {
        return { title: author, subtitle: '❤️ liked tweet' };
      }
      if (eventType === 'tweet_retweet') {
        return { title: author, subtitle: '🔄 retweeted' };
      }
      if (eventType === 'tweet_reply') {
        return { title: author, subtitle: '💬 replied' };
      }
      if (eventType === 'user_follow') {
        return { title: author, subtitle: '➕ followed' };
      }
    }
    
    // Reddit-specific events
    if (event.site?.includes('reddit')) {
      const subreddit = event.subreddit ? `r/${event.subreddit}` : 'Post';
      
      if (eventType === 'post_view') {
        return {
          title: subreddit,
          subtitle: '👁️ viewed post',
          tooltip: event.post_id
        };
      }
      if (eventType === 'post_upvote') {
        return { title: subreddit, subtitle: '⬆️ upvoted' };
      }
      if (eventType === 'post_downvote') {
        return { title: subreddit, subtitle: '⬇️ downvoted' };
      }
      if (eventType === 'subreddit_join') {
        return { title: subreddit, subtitle: '➕ joined' };
      }
    }
    
    // Medium-specific events
    if (event.site?.includes('medium')) {
      const articleTitle = event.title || pageTitle || 'Article';
      
      if (eventType === 'article_view') {
        return {
          title: this.truncateText(articleTitle, 30),
          subtitle: event.word_count ? `📖 ${event.word_count} words` : '📖 reading',
          tooltip: articleTitle
        };
      }
      if (eventType === 'reading_progress') {
        return {
          title: this.truncateText(articleTitle, 30),
          subtitle: `📖 ${event.progress_percentage}% read`,
          tooltip: `${event.reading_time_seconds}s reading time`
        };
      }
      if (eventType === 'article_clap') {
        return { 
          title: this.truncateText(articleTitle, 30),
          subtitle: '👏 clapped',
          tooltip: event.author 
        };
      }
    }
    
    // Generic events with context
    if (eventType === 'click') {
      const clickedText = event.element_text?.trim();
      if (clickedText && clickedText.length > 0 && clickedText.length < 50) {
        return {
          title: `"${this.truncateText(clickedText, 30)}"`,
          subtitle: '🖱️ clicked',
          tooltip: event.element_type
        };
      }
      return {
        title: pageTitle || this.extractDomain(event.page_url),
        subtitle: `🖱️ clicked ${event.element_type || 'element'}`,
        tooltip: event.element_text || event.xpath
      };
    }
    
    if (eventType === 'scroll_checkpoint') {
      return {
        title: pageTitle || this.extractDomain(event.page_url),
        subtitle: `📜 scrolled to ${event.scroll_depth_percentage}%`,
        tooltip: `Scroll depth on page`
      };
    }
    
    if (eventType === 'navigation' || eventType === 'page_view') {
      const targetTitle = this.extractTitleFromUrl(event.to_url || event.page_url);
      return {
        title: targetTitle,
        subtitle: 'visited page',
        tooltip: event.to_url || event.page_url
      };
    }
    
    if (eventType === 'session_start') {
      return { 
        title: pageTitle || this.extractDomain(event.page_url),
        subtitle: 'started browsing' 
      };
    }
    
    if (eventType === 'session_end') {
      return { 
        title: this.getSiteName(event.site || event.page_url),
        subtitle: 'ended session' 
      };
    }
    
    if (eventType.includes('video_') || eventType.includes('audio_')) {
      return {
        title: pageTitle || 'Media content',
        subtitle: `${this.getMediaEmoji(eventType)} ${this.formatEventType(eventType)}`,
        tooltip: event.src
      };
    }
    
    // Fallback with context
    return {
      title: pageTitle || this.extractDomain(event.page_url),
      subtitle: this.formatEventType(eventType),
      tooltip: event.page_url
    };
  }

  extractPageTitle(event) {
    // Try to extract meaningful title from event data
    if (event.video_title) return this.truncateText(event.video_title, 35);
    if (event.article_title) return this.truncateText(event.article_title, 35);
    if (event.title) return this.truncateText(event.title, 35);
    if (event.page_title) return this.truncateText(event.page_title, 35);
    
    // Try to extract from URL
    return this.extractTitleFromUrl(event.page_url);
  }

  extractTitleFromUrl(url) {
    if (!url) return null;
    
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      
      // Clean up the path
      const segments = path.split('/').filter(s => s.length > 0);
      if (segments.length === 0) return urlObj.hostname.replace('www.', '');
      
      // Get the last meaningful segment
      let lastSegment = segments[segments.length - 1];
      
      // Skip if it looks like an ID (all numbers, or long random string)
      if (/^\d+$/.test(lastSegment) || lastSegment.length > 50) {
        // Try previous segment
        lastSegment = segments.length > 1 ? segments[segments.length - 2] : lastSegment;
      }
      
      // Skip if still looks like garbage
      if (/^\d+$/.test(lastSegment) || lastSegment.length > 50) {
        return urlObj.hostname.replace('www.', '');
      }
      
      // Convert URL slug to readable title
      const title = lastSegment
        .replace(/[-_]/g, ' ')
        .replace(/\.(html|php|aspx)$/i, '')
        .split(' ')
        .filter(word => word.length > 0)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      // If title is too short or looks like code, use domain
      if (title.length < 3 || /^[A-Z0-9_]+$/.test(title)) {
        return urlObj.hostname.replace('www.', '');
      }
      
      return this.truncateText(title, 35);
    } catch {
      return null;
    }
  }

  extractDomain(url) {
    if (!url) return 'Page';
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'Page';
    }
  }

  truncateText(text, maxLength) {
    if (!text) return null;
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 1) + '…';
  }

  getMediaEmoji(eventType) {
    if (eventType.includes('play')) return '▶️';
    if (eventType.includes('pause')) return '⏸️';
    if (eventType.includes('ended')) return '⏹️';
    if (eventType.includes('seek')) return '⏩';
    return '🎬';
  }

  startActivityMonitoring() {
    // Update activity every 30 seconds
    setInterval(async () => {
      if (this.isAuthenticated && this.consentEnabled) {
        await this.loadStats();
        this.updateStats();
        this.updateActivity();
      }
    }, 30000);
  }

  showLoadingState() {
    this.refreshButton.classList.add('loading');
    this.refreshButton.disabled = true;
    setTimeout(() => {
      this.refreshButton.classList.remove('loading');
      this.refreshButton.disabled = false;
    }, 1000);
  }

  showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  formatEventType(type) {
    const typeMap = {
      'video_watch': 'Watched Video',
      'video_start': 'Started Video',
      'video_end': 'Finished Video',
      'video_pause': 'Paused Video',
      'video_resume': 'Resumed Video',
      'seek_start': 'Skipped Forward',
      'seek_end': 'Seeked Video',
      'play': 'Played Video',
      'pause': 'Paused Video',
      'ad_view': 'Viewed Ad',
      'ad_skip': 'Skipped Ad',
      'ad_click': 'Clicked Ad',
      'like': 'Liked Video',
      'dislike': 'Disliked Video',
      'comment': 'Left Comment',
      'subscribe': 'Subscribed',
      'unsubscribe': 'Unsubscribed',
      'search': 'Searched',
      'navigation': 'Navigated',
      'page_view': 'Viewed Page',
      'click': 'Clicked',
      'scroll': 'Scrolled',
      'hover': 'Hovered'
    };
    
    // Convert snake_case to Title Case if not in map
    if (!typeMap[type]) {
      return type.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    return typeMap[type];
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  async loadTheme() {
    try {
      const result = await chrome.storage.local.get(['theme']);
      this.isDarkMode = result.theme !== 'light';
      this.applyTheme();
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  }

  async toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    await chrome.storage.local.set({ theme: this.isDarkMode ? 'dark' : 'light' });
    this.applyTheme();
  }

  applyTheme() {
    if (this.isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new TubeDAOPopup();
}); 