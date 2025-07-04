// Background service worker for TubeDAO Chrome Extension

class TubeDAOBackground {
  constructor() {
    this.init();
  }

  init() {
    console.log('TubeDAO Background Service initialized');
    
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details);
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab);
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
    });

    this.schedulePeriodicTasks();
  }

  async handleInstallation(details) {
    if (details.reason === 'install') {
      console.log('TubeDAO Extension installed for the first time');
      
      await chrome.storage.local.set({
        consentEnabled: false,
        tubeDAOEvents: [],
        installDate: new Date().toISOString(),
        version: chrome.runtime.getManifest().version
      });

      this.showNotification(
        'TubeDAO Extension Installed!',
        'Click the extension icon to start capturing your YouTube data.'
      );

    } else if (details.reason === 'update') {
      console.log('TubeDAO Extension updated');
      await this.handleUpdate(details);
    }
  }

  async handleUpdate(details) {
    const currentVersion = chrome.runtime.getManifest().version;
    
    await this.migrateData(details.previousVersion, currentVersion);
    
    await chrome.storage.local.set({ version: currentVersion });
  }

  async migrateData(previousVersion, currentVersion) {
    console.log(`Migrating data from ${previousVersion} to ${currentVersion}`);
    
    const result = await chrome.storage.local.get(['tubeDAOEvents']);
    const events = result.tubeDAOEvents || [];
    
    const validEvents = events.filter(event => 
      event && 
      event.timestamp && 
      event.event_type && 
      event.category
    );

    if (validEvents.length !== events.length) {
      console.log(`Cleaned ${events.length - validEvents.length} invalid events`);
      await chrome.storage.local.set({ tubeDAOEvents: validEvents });
    }
  }

  handleTabUpdate(tabId, changeInfo, tab) {
    if (tab.url && tab.url.includes('youtube.com') && changeInfo.status === 'complete') {
      this.ensureContentScriptInjected(tabId);
    }
  }

  async ensureContentScriptInjected(tabId) {
    try {
      const response = await chrome.tabs.sendMessage(tabId, { type: 'PING' });
    } catch (error) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content/content.js']
        });
        console.log(`Injected content script into tab ${tabId}`);
      } catch (injectError) {
        console.log('Failed to inject content script:', injectError);
      }
    }
  }

  handleMessage(message, sender, sendResponse) {
    switch (message.type) {
      case 'STATS_UPDATE':
        this.forwardToPopup(message);
        break;
        
      case 'GET_STATS':
        this.getStats().then(sendResponse);
        return true;
        
      case 'EXPORT_REQUEST':
        this.handleExportRequest(message.data).then(sendResponse);
        return true;
        
      case 'CLEAR_DATA':
        this.handleClearData().then(sendResponse);
        return true;
        
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  async forwardToPopup(message) {
    try {
      chrome.runtime.sendMessage(message);
    } catch (error) {
    }
  }

  async getStats() {
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
    await chrome.storage.local.set({ tubeDAOEvents: [] });
    console.log('All event data cleared');
    return { success: true };
  }

  schedulePeriodicTasks() {
    setInterval(() => {
      this.runMaintenance();
    }, 60 * 60 * 1000);

    setTimeout(() => {
      this.runMaintenance();
    }, 5 * 60 * 1000);
  }

  async runMaintenance() {
    console.log('Running periodic maintenance');
    
    try {
      await this.cleanupOldEvents();
      
      await this.optimizeStorage();
      
      await this.updateStatsCache();
      
    } catch (error) {
      console.error('Maintenance failed:', error);
    }
  }

  async cleanupOldEvents() {
    const result = await chrome.storage.local.get(['tubeDAOEvents']);
    const events = result.tubeDAOEvents || [];
    
    const MAX_EVENTS = 10000;
    
    if (events.length > MAX_EVENTS) {
      const recentEvents = events.slice(-MAX_EVENTS);
      await chrome.storage.local.set({ tubeDAOEvents: recentEvents });
      
      console.log(`Cleaned up ${events.length - MAX_EVENTS} old events`);
    }
  }

  async optimizeStorage() {
    const allData = await chrome.storage.local.get();
    
    const validKeys = ['consentEnabled', 'tubeDAOEvents', 'installDate', 'version'];
    const keysToRemove = Object.keys(allData).filter(key => !validKeys.includes(key));
    
    if (keysToRemove.length > 0) {
      await chrome.storage.local.remove(keysToRemove);
      console.log(`Removed orphaned keys: ${keysToRemove.join(', ')}`);
    }
  }

  async updateStatsCache() {
    const stats = await this.getStats();
    await chrome.storage.local.set({ 
      statsCache: {
        ...stats,
        lastUpdated: new Date().toISOString()
      }
    });
  }

  showNotification(title, message) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-48.png',
      title: title,
      message: message
    });
  }

  async getStorageUsage() {
    const usage = await chrome.storage.local.getBytesInUse();
    const quota = chrome.storage.local.QUOTA_BYTES;
    
    return {
      used: usage,
      quota: quota,
      percentage: Math.round((usage / quota) * 100)
    };
  }
}

const backgroundService = new TubeDAOBackground(); 