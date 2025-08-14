class TubeDAOPopup {
  constructor() {
    this.consentToggle = document.getElementById('consentToggle');
    this.statusIndicator = document.getElementById('statusIndicator');
    this.statusText = document.getElementById('statusText');
    this.totalEvents = document.getElementById('totalEvents');
    this.adEvents = document.getElementById('adEvents');
    this.playbackEvents = document.getElementById('playbackEvents');
    this.dataPreview = document.getElementById('dataPreview');
    this.dataPreviewSection = document.getElementById('dataPreviewSection');
    this.rewardsSection = document.getElementById('rewardsSection');
    this.totalEarnings = document.getElementById('totalEarnings');
    this.todayEarnings = document.getElementById('todayEarnings');
    this.rewardsStatus = document.getElementById('rewardsStatus');
    
    this.toggleContainer = document.getElementById('toggleContainer');
    this.toggleLabel = document.getElementById('toggleLabel');
    this.toggleDescription = document.getElementById('toggleDescription');
    this.authStatus = document.getElementById('authStatus');
    this.authIcon = document.getElementById('authIcon');
    this.authTitle = document.getElementById('authTitle');
    this.authSubtitle = document.getElementById('authSubtitle');
    this.authButton = document.getElementById('authButton');
    this.refreshButton = document.getElementById('refreshButton');

    this.isAuthenticated = false;
    this.authToken = null;
    this.consentEnabled = false;
    this.events = [];
    this.stats = { total: 0, adEvents: 0, playbackEvents: 0 };
    this.earnings = { total: 0, today: 0 };

    this.init();
  }

  async init() {
    await this.checkAuthentication();
    await this.loadSettings();
    await this.loadStats();
    await this.loadRecentEvents();
    await this.calculateEarnings();

    this.setupEventListeners();
    this.updateUI();
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
    
    this.stats = {
      total: this.events.length,
      adEvents: this.events.filter(e => e.category === 'ad').length,
      playbackEvents: this.events.filter(e => e.category === 'playback').length
    };
  }

  async loadRecentEvents() {
    const recentEvents = this.events.slice(-5).reverse();
    
    if (recentEvents.length > 0) {
      this.dataPreviewSection.style.display = 'block';
      this.dataPreview.innerHTML = recentEvents.map(event => `
        <div class="event-item">
          <span class="event-type">${event.event_type}</span>
          <span class="event-time">${this.formatTime(event.timestamp)}</span>
        </div>
      `).join('');
    } else {
      this.dataPreviewSection.style.display = 'none';
    }
  }

  async calculateEarnings() {
    this.earnings.total = (this.stats.total * 0.1).toFixed(2);
    
    const today = new Date().toDateString();
    const todayEvents = this.events.filter(event => 
      new Date(event.timestamp).toDateString() === today
    );
    this.earnings.today = (todayEvents.length * 0.1).toFixed(2);
  }

  setupEventListeners() {
    this.consentToggle.addEventListener('change', (e) => {
      this.handleConsentChange(e.target.checked);
    });

    this.authButton.addEventListener('click', () => {
      this.redirectToHomepage();
    });

    this.refreshButton.addEventListener('click', () => {
      this.refreshAuthStatus();
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'STATS_UPDATE') {
        this.loadStats().then(() => {
          this.updateStats();
          this.loadRecentEvents();
          this.calculateEarnings();
          this.updateRewards();
        });
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
      this.updateUI();
      return;
    }

    this.consentEnabled = enabled;
    await chrome.storage.local.set({ consentEnabled: enabled });
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url.includes('youtube.com')) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'CONSENT_CHANGED',
          enabled: enabled
        });
      }
    });

    this.updateUI();
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
      this.showToast('Authentication successful! You can now enable data capture and start earning rewards', 'success');
    }).catch((error) => {
      console.error('Popup: Error storing auth data:', error);
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

  redirectToHomepage() {
    chrome.tabs.create({ 
      url: 'http://localhost:3000',
      active: true 
    });
  }

  async refreshAuthStatus() {
    await this.checkAuthentication();
    this.updateUI();
    this.showToast('Auth status refreshed', 'success');
  }

  updateUI() {
    if (this.consentEnabled && this.isAuthenticated) {
      this.statusIndicator.classList.add('active');
      this.statusIndicator.querySelector('.dot').classList.add('active');
      this.statusText.textContent = 'Active';
    } else {
      this.statusIndicator.classList.remove('active');
      this.statusIndicator.querySelector('.dot').classList.remove('active');
      this.statusText.textContent = this.isAuthenticated ? 'Ready' : 'Disabled';
    }

    this.updateToggleState();
    this.updateAuthStatus();

    this.updateStats();
    this.updateRewards();
  }

  updateToggleState() {
    const isEnabled = this.consentEnabled && this.isAuthenticated;
    this.consentToggle.checked = isEnabled;
    this.consentToggle.disabled = !this.isAuthenticated;
    
    if (!this.isAuthenticated) {
      this.toggleContainer.classList.add('disabled');
      this.toggleLabel.textContent = 'Enable data capture';
      this.toggleDescription.textContent = 'Authentication required to start capturing data';
    } else {
      this.toggleContainer.classList.remove('disabled');
      this.toggleLabel.textContent = 'Enable data capture';
      this.toggleDescription.textContent = 'Capture your YouTube interaction patterns locally';
    }
  }

  updateAuthStatus() {
    if (!this.isAuthenticated) {
      this.authStatus.classList.remove('authenticated');
      this.authStatus.classList.add('show');
      this.authIcon.textContent = '🔒';
      this.authTitle.textContent = 'Authentication Required';
      this.authButton.innerHTML = '<span class="auth-button-icon">🔗</span>Authenticate';
    } else if (this.isAuthenticated && !this.consentEnabled) {
      this.authStatus.classList.add('authenticated');
      this.authStatus.classList.add('show');
      this.authIcon.textContent = '✅';
      this.authTitle.textContent = 'Ready to Capture Data';
      this.authSubtitle.textContent = 'You\'re authenticated! Enable data capture to start earning rewards';
      this.authButton.innerHTML = '<span class="auth-button-icon">💰</span>Start Earning';
    } else {
      this.authStatus.classList.remove('show');
    }
  }

  updateStats() {
    if (this.stats) {
      this.totalEvents.textContent = this.stats.total;
      this.adEvents.textContent = this.stats.adEvents;
      this.playbackEvents.textContent = this.stats.playbackEvents;
    }
  }

  updateRewards() {
    this.totalEarnings.textContent = `$${this.earnings.total}`;
    this.todayEarnings.textContent = `$${this.earnings.today}`;

    const statusText = this.rewardsStatus.querySelector('span');
    const pulseDot = this.rewardsStatus.querySelector('.pulse-dot');

    if (this.consentEnabled && this.isAuthenticated) {
      statusText.textContent = 'Capturing data in real-time';
      pulseDot.classList.add('active');
    } else if (this.isAuthenticated) {
      statusText.textContent = 'Ready to capture data';
      pulseDot.classList.remove('active');
    } else {
      statusText.textContent = 'Authentication required';
      pulseDot.classList.remove('active');
    }
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

    setTimeout(() => toast.classList.add('show'), 100);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }
}


document.addEventListener('DOMContentLoaded', () => {
  new TubeDAOPopup();
}); 