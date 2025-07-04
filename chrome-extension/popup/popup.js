// Popup script for TubeDAO Chrome Extension
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
    this.exportBtn = document.getElementById('exportBtn');
    this.clearBtn = document.getElementById('clearBtn');
    this.helpLink = document.getElementById('helpLink');

    this.init();
  }

  async init() {
    await this.loadSettings();
    await this.loadStats();
    await this.loadRecentEvents();

    this.setupEventListeners();

    this.updateUI();
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

  setupEventListeners() {
    this.consentToggle.addEventListener('change', (e) => {
      this.handleConsentChange(e.target.checked);
    });

    this.exportBtn.addEventListener('click', () => {
      this.exportData();
    });

    this.clearBtn.addEventListener('click', () => {
      this.clearData();
    });

    this.helpLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.showHelp();
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'STATS_UPDATE') {
        this.loadStats().then(() => {
          this.updateStats();
          this.loadRecentEvents();
        });
      }
    });
  }

  async handleConsentChange(enabled) {
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

  updateUI() {
    if (this.consentEnabled) {
      this.statusIndicator.classList.add('active');
      this.statusIndicator.querySelector('.dot').classList.add('active');
      this.statusText.textContent = 'Active';
    } else {
      this.statusIndicator.classList.remove('active');
      this.statusIndicator.querySelector('.dot').classList.remove('active');
      this.statusText.textContent = 'Disabled';
    }

    this.updateStats();

    const hasData = this.events && this.events.length > 0;
    this.exportBtn.disabled = !hasData;
    this.clearBtn.disabled = !hasData;
  }

  updateStats() {
    if (this.stats) {
      this.totalEvents.textContent = this.stats.total;
      this.adEvents.textContent = this.stats.adEvents;
      this.playbackEvents.textContent = this.stats.playbackEvents;
    }
  }

  async exportData() {
    if (!this.events || this.events.length === 0) {
      this.showNotification('No data to export', 'warning');
      return;
    }

    const exportData = {
      metadata: {
        source: 'TubeDAO Chrome Extension',
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        totalEvents: this.events.length,
        dataTypes: [...new Set(this.events.map(e => e.category))],
        privacyNote: 'This data was collected locally with user consent and contains anonymized behavioral patterns.'
      },
      summary: {
        totalEvents: this.stats.total,
        adInteractions: this.stats.adEvents,
        playbackActions: this.stats.playbackEvents,
        sessionCount: [...new Set(this.events.map(e => e.session_id))].length,
        dateRange: {
          start: this.events.length > 0 ? this.events[0].timestamp : null,
          end: this.events.length > 0 ? this.events[this.events.length - 1].timestamp : null
        }
      },
      events: this.events
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tubedao-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    
    this.showNotification('Data exported successfully!', 'success');
  }

  async clearData() {
    if (confirm('Are you sure you want to clear all local data? This action cannot be undone.')) {
      await chrome.storage.local.remove(['tubeDAOEvents']);
      this.events = [];
      this.stats = { total: 0, adEvents: 0, playbackEvents: 0 };
      
      await this.loadRecentEvents();
      this.updateUI();
      
      this.showNotification('Data cleared successfully', 'success');
    }
  }

  showHelp() {
    const helpContent = `
🔒 Privacy First: Your data stays on your device until you export it.

📊 What We Capture:
• Video interactions (play, pause, seek)
• Ad viewing patterns (skip, complete, click)
• Playback preferences (speed, quality)
• Engagement signals (likes, shares)

🎯 How It Works:
1. Enable data capture with the toggle
2. Browse YouTube normally
3. Review your data anytime
4. Export when ready to contribute

💡 Your data powers better ad experiences and creator insights while keeping you in control.
    `;
    
    alert(helpContent);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#2ed573' : type === 'warning' ? '#ff6b6b' : '#4ecdc4'};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      z-index: 1000;
      animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) {
      return 'Just now';
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}m ago`;
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TubeDAOPopup();
}); 