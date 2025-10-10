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
    
    // State
    this.isAuthenticated = false;
    this.authToken = null;
    this.consentEnabled = false;
    this.events = [];
    this.stats = { total: 0, today: 0 };
    this.earnings = { total: 0, today: 0 };

    // Initialize earnings calculator
    this.earningsCalculator = new EarningsCalculator();

    this.init();
  }

  async init() {
    await this.checkAuthentication();
    await this.loadSettings();
    await this.loadStats();
    this.setupEventListeners();
    this.updateUI();
    this.startActivityMonitoring();
  }

  async checkAuthentication() {
    try {
      const result = await chrome.storage.session.get(['tubedao_auth_token']);
      this.authToken = result.tubedao_auth_token;
      this.isAuthenticated = !!this.authToken;
    } catch (error) {
      console.error('Error checking authentication:', error);
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
    
    // Calculate earnings using the earnings calculator
    this.earningsSummary = this.earningsCalculator.getEarningsSummary(this.events);
    this.earnings = {
      total: this.earningsSummary.total.formatted,
      today: this.earningsSummary.today.formatted
    };
  }

  setupEventListeners() {
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
    
    // Notify content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url.includes('youtube.com')) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'CONSENT_CHANGED',
          enabled: enabled
        });
      }
    });

    this.updateUI();
    this.showToast(enabled ? 'Data capture enabled' : 'Data capture disabled', enabled ? 'success' : 'error');
  }

  handleAuthSuccess(message) {
    this.isAuthenticated = true;
    this.authToken = message.token;
    
    chrome.storage.session.set({ 
      tubedao_auth_token: message.token,
      tubedao_address: message.address,
      tubedao_chainId: message.chainId,
      tubedao_expiresAt: message.expiresAt
    }).then(() => {
      this.updateUI();
      this.showToast('Wallet connected successfully', 'success');
    });
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
      url: 'https://www.tubedao.org',
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
    // Update header status
    if (this.consentEnabled && this.isAuthenticated) {
      this.statusIndicator.classList.add('active');
      this.statusText.textContent = 'Active';
    } else {
      this.statusIndicator.classList.remove('active');
      this.statusText.textContent = this.isAuthenticated ? 'Connected' : 'Inactive';
    }

    // Show/hide UI sections
    if (this.isAuthenticated) {
      this.authCard.style.display = 'none';
      this.connectedState.style.display = 'flex';
      this.updateStats();
      this.updateActivity();
    } else {
      this.authCard.style.display = 'block';
      this.connectedState.style.display = 'none';
    }

    // Update activity pulse
    if (this.consentEnabled && this.isAuthenticated) {
      this.activityPulse.style.display = 'flex';
    } else {
      this.activityPulse.style.display = 'none';
    }
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
    const recentEvents = this.events.slice(-50).reverse(); // Show more events to test scrolling
    
    if (recentEvents.length > 0) {
      this.activityList.innerHTML = recentEvents.map(event => `
        <div class="activity-item">
          <span class="activity-type">${this.formatEventType(event.event_type)}</span>
          <span class="activity-time">${this.formatTime(event.timestamp)}</span>
        </div>
      `).join('');
    } else {
      this.activityList.innerHTML = `
        <div class="activity-empty">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" opacity="0.3">
            <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="2"/>
            <path d="M16 10V16L20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p>No recent activity</p>
        </div>
      `;
    }
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
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new TubeDAOPopup();
});