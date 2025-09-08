// Background service worker for TubeDAO Chrome Extension with Authentication

class TubeDAOBackground {
  constructor() {
    this.isUnlocked = false;
    this.TUBEDAO_HOMEPAGE = 'http://localhost:3000';
    this.BACKEND_API = 'http://localhost:8080/api';
    this.VANA_MOKSHA_CHAIN_ID = 14800;
    this.init();
  }

  init() {
    
    this.isUnlocked = false;
    this.blockAllFeatures();

    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details);
    });

    chrome.runtime.onStartup.addListener(() => {
      this.handleStartup();
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab);
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true;
    });

    this.checkAuthStatus();
  }

  async handleInstallation(details) {
    if (details.reason === 'install') {  
      await this.clearAuthData();
      await this.initializeStorage();
      
      await this.openAuthPage();

    } else if (details.reason === 'update') {
      await this.checkAuthStatus();
    }
  }

  async handleStartup() {
    this.isUnlocked = false;
    await this.checkAuthStatus();
  }

  async initializeStorage() {
    await chrome.storage.local.set({
      installDate: new Date().toISOString(),
      version: chrome.runtime.getManifest().version,
      tubeDAOEvents: []
    });

    await chrome.storage.session.clear();
  }

  async clearAuthData() {
    await chrome.storage.session.clear();
    this.isUnlocked = false;
    this.blockAllFeatures();
  }

  blockAllFeatures() {
    this.isUnlocked = false;
    
    this.broadcastMessage({
      type: 'AUTH_REQUIRED',
      message: 'Authentication required to use TubeDAO features'
    });
  }

  async openAuthPage() {
    try {
      await chrome.tabs.create({
        url: this.TUBEDAO_HOMEPAGE,
        active: true
      });
    } catch (error) {
      console.error('Failed to open auth page:', error);
    }
  }

  async checkAuthStatus() {
    try {
      const sessionData = await chrome.storage.session.get(['tubedao_auth_token', 'tubedao_address', 'tubedao_chainId', 'tubedao_expiresAt']);
      
      if (!sessionData.tubedao_auth_token || !sessionData.tubedao_address) {
        this.blockAllFeatures();
        return;
      }

      if (Date.now() > sessionData.tubedao_expiresAt) { 
        await this.clearAuthData();
        return;
      }

      const isValid = await this.verifyToken(sessionData.tubedao_auth_token);
      if (isValid) {
        this.isUnlocked = true;
        this.notifyUnlocked();
      } else {
        await this.clearAuthData();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      this.blockAllFeatures();
    }
  }

  async verifyToken(token) {
    try {
      const response = await fetch(`${this.BACKEND_API}/auth/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }

  notifyUnlocked() {
    this.broadcastMessage({
      type: 'AUTH_SUCCESS',
      message: 'Authentication successful - features enabled'
    });
  }

  handleTabUpdate(tabId, changeInfo, tab) {
    if (tab.url && tab.url.includes('youtube.com') && changeInfo.status === 'complete') {
      if (this.isUnlocked) {
        this.ensureContentScriptInjected(tabId);
      } else {
        this.sendMessageToTab(tabId, {
          type: 'AUTH_REQUIRED',
          message: 'Please authenticate at TubeDAO homepage to enable data collection'
        });
      }
    }
  }

  async ensureContentScriptInjected(tabId) {
    if (!this.isUnlocked) return;
    
    try {
      await chrome.tabs.sendMessage(tabId, { type: 'PING' });
    } catch (error) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content/content.js']
        });
        
        setTimeout(() => {
          this.sendMessageToTab(tabId, {
            type: 'AUTH_SUCCESS',
            message: 'Data collection enabled'
          });
        }, 100);
        
      } catch (injectError) {
        console.log('Failed to inject content script:', injectError);
      }
    }
  }

  async sendMessageToTab(tabId, message) {
    try {
      await chrome.tabs.sendMessage(tabId, message);
    } catch (error) {
    }
  }

  async handleMessage(message, sender, sendResponse) {
    try {
      
      switch (message.type) {
        case 'AUTH_SUCCESS':
          await this.handleAuthSuccess(message);
          sendResponse({ success: true });
          break;
          
        case 'AUTH_REQUIRED':
          this.blockAllFeatures();
          await this.openAuthPage();
          sendResponse({ success: true });
          break;
          
        case 'GET_AUTH_STATUS':
          sendResponse({ 
            isUnlocked: this.isUnlocked,
            hasSession: await this.hasValidSession()
          });
          break;
          
        case 'LOGOUT':
          await this.handleLogout();
          sendResponse({ success: true });
          break;
          
        case 'STATS_UPDATE':
          if (this.isUnlocked) {
            this.forwardToPopup(message);
          }
          sendResponse({ success: true });
          break;
          
        case 'UPLOAD_EVENTS':
          if (this.isUnlocked) {
            const result = await this.handleEventUpload(message.events);
            sendResponse(result);
          } else {
            sendResponse({ error: 'Authentication required' });
          }
          break;
          
        case 'GET_STATS':
          if (this.isUnlocked) {
            const stats = await this.getStats();
            sendResponse(stats);
          } else {
            sendResponse({ error: 'Authentication required' });
          }
          break;
          
        case 'EXPORT_REQUEST':
          if (this.isUnlocked) {
            const exportData = await this.handleExportRequest(message.data);
            sendResponse(exportData);
          } else {
            sendResponse({ error: 'Authentication required' });
          }
          break;
          
        case 'CLEAR_DATA':
          if (this.isUnlocked) {
            const result = await this.handleClearData();
            sendResponse(result);
          } else {
            sendResponse({ error: 'Authentication required' });
          }
          break;
          
        case 'ACCOUNT_CHANGED':
          await this.handleAccountChanged(message.newAccount, message.oldAccount);
          sendResponse({ success: true });
          break;
          
        default:
          console.log('Unknown message type:', message.type);
          sendResponse({ error: 'Unknown message type' });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ error: error.message });
    }
  }

  async handleAuthSuccess(message) {
    const { token, address, chainId, expiresAt } = message;
    
    if (!token || !address) {
      console.error('Invalid auth success message:', message);
      return;
    }

    await chrome.storage.session.set({
      tubedao_auth_token: token,
      tubedao_address: address,
      tubedao_chainId: chainId || 1,
      tubedao_expiresAt: expiresAt || (Date.now() + 24 * 60 * 60 * 1000)
    });

    this.isUnlocked = true;
    this.notifyUnlocked();
    
    this.forwardToPopup(message);
  }

  async handleLogout() {
    const sessionData = await chrome.storage.session.get(['tubedao_auth_token']);
    
    if (sessionData.tubedao_auth_token) {
      try {
        await fetch(`${this.BACKEND_API}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionData.tubedao_auth_token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Failed to notify backend about logout:', error);
      }
    }

    await this.clearAuthData();
    await this.openAuthPage();
  }

  async hasValidSession() {
    try {
      const sessionData = await chrome.storage.session.get(['tubedao_auth_token', 'tubedao_expiresAt']);
      return sessionData.tubedao_auth_token && Date.now() < sessionData.tubedao_expiresAt;
    } catch (error) {
      return false;
    }
  }



  async handleAccountChanged(newAccount, currentAccount) {
    if (newAccount !== currentAccount) {
      await this.clearAuthData();
      await this.openAuthPage();
    }
  }



  broadcastMessage(message) {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.url && tab.url.includes('youtube.com')) {
          this.sendMessageToTab(tab.id, message);
        }
      });
    });

    this.forwardToPopup(message);
  }

  async forwardToPopup(message) {
    try {
      chrome.runtime.sendMessage(message);
    } catch (error) {
      console.log('Background: Popup might not be open:', error);
    }
  }

  async getStats() {
    if (!this.isUnlocked) {
      return { error: 'Authentication required' };
    }

    const result = await chrome.storage.local.get(['tubeDAOEvents']);
    const events = result.tubeDAOEvents || [];
    
    return {
      total: events.length,
      adEvents: events.filter(e => e.category === 'ad').length,
      playbackEvents: events.filter(e => e.category === 'playback').length,
      lastUpdate: events.length > 0 ? events[events.length - 1].timestamp : null
    };
  }

  async handleExportRequest(filters = {}) {
    if (!this.isUnlocked) {
      return { error: 'Authentication required' };
    }

    const result = await chrome.storage.local.get(['tubeDAOEvents']);
    const events = result.tubeDAOEvents || [];
    
    let filteredEvents = events;
    
    if (filters.startDate) {
      filteredEvents = filteredEvents.filter(e => 
        new Date(e.timestamp) >= new Date(filters.startDate)
      );
    }
    
    if (filters.endDate) {
      filteredEvents = filteredEvents.filter(e => 
        new Date(e.timestamp) <= new Date(filters.endDate)
      );
    }
    
    if (filters.categories) {
      filteredEvents = filteredEvents.filter(e => 
        filters.categories.includes(e.category)
      );
    }

    return {
      events: filteredEvents,
      count: filteredEvents.length,
      exportDate: new Date().toISOString()
    };
  }

  async handleClearData() {
    if (!this.isUnlocked) {
      return { error: 'Authentication required' };
    }

    await chrome.storage.local.set({ tubeDAOEvents: [] });
    console.log('All event data cleared');
    return { success: true };
  }

  async handleEventUpload(events) {
    if (!this.isUnlocked) {
      return { error: 'Authentication required' };
    }

    try {
      const sessionData = await chrome.storage.session.get(['tubedao_auth_token', 'tubedao_address']);
      
      if (!sessionData.tubedao_auth_token || !sessionData.tubedao_address) {
        return { error: 'Authentication required' };
      }

      const response = await fetch(`${this.BACKEND_API}/events/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionData.tubedao_auth_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          address: sessionData.tubedao_address,
          events: events
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload events');
      }

      const result = await response.json();
      console.log('Events uploaded successfully:', result);
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Event upload failed:', error);
      return { error: error.message };
    }
  }

  showNotification(title, message) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/logo.png',
      title: title,
      message: message
    });
  }
}

const backgroundService = new TubeDAOBackground();