# TubeDAO Chrome Extension

Privacy-first Chrome extension that captures YouTube behavioral data for the TubeDAO ecosystem. Users maintain complete control over their data with local storage and explicit consent mechanisms.

## Purpose

This extension enables TubeDAO users to contribute valuable YouTube behavioral insights while maintaining full privacy and data ownership. It captures:

- **Premium feature usage patterns** - How users interact with YouTube Premium features
- **Ad interaction & skip behavior** - Detailed ad engagement metrics
- **Real-time engagement metrics** - Play, pause, seek, quality changes
- **Content stickiness insights** - Session duration and video completion rates

## Installation

### Development Installation

1. **Clone/Download** this repository
2. **Add Icons** - Place required icon files in the `icons/` folder (see `icons/README.md`)
3. **Load Extension**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked"
   - Select the `chrome-extension` folder
4. **Verify Installation** - The TubeDAO icon should appear in your browser toolbar

### Production Installation
Once published to Chrome Web Store, users can install directly from the store.

## Usage

### Getting Started
1. **Click Extension Icon** - Opens the TubeDAO popup interface
2. **Enable Data Collection** - Toggle the consent switch to start capturing data
3. **Browse YouTube Normally** - The extension works passively in the background
4. **Monitor Progress** - View real-time stats in the popup
5. **Export Data** - Download your behavioral data as JSON when ready

### Features

#### Privacy Controls
- **Local Storage Only** - All data stays on your device until export
- **Explicit Consent** - Easy toggle to enable/disable data collection
- **Transparent Processing** - View exactly what data is captured
- **User-Owned Export** - Complete control over when and how to share data

#### Data Capture
- **Video Interactions** - Play, pause, seek, speed changes, quality adjustments
- **Ad Behavior** - View time, skip actions, interaction patterns
- **Engagement Signals** - Likes, shares, subscriptions, comments
- **Session Tracking** - Visit patterns and content flow

#### Management Tools
- **Real-time Stats** - Live view of captured events
- **Data Preview** - Recent activity summary
- **Bulk Export** - Comprehensive JSON export with metadata
- **Data Cleanup** - Clear local storage when needed

### Data Flow

```
YouTube Page → Content Script → Local Storage → Popup Display → User Export
```

1. **Capture** - Content script monitors YouTube interactions
2. **Buffer** - Events are batched locally for performance
3. **Store** - Data is saved to Chrome's local storage API
4. **Display** - Popup shows real-time statistics
5. **Export** - User downloads comprehensive JSON file

### Privacy Design

- **Zero External Communication** - No data leaves the device without explicit user action
- **Consent-First** - All monitoring requires active user permission
- **Anonymization** - Sensitive identifiers are excluded or hashed
- **User Control** - Complete visibility and control over captured data

### Key Technologies
- **Manifest V3** - Latest Chrome extension API
- **Chrome Storage API** - Local data persistence
- **Content Scripts** - YouTube page interaction
- **Service Workers** - Background processing
- **Modern JavaScript** - ES6+ features and async/await

## Data Schema

### Event Structure
```json
{
  "event_type": "play",
  "category": "playback",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "session_id": "session_1705312200000_abc123def",
  "page_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "video_id": "dQw4w9WgXcQ",
  "current_time": 30,
  "duration": 212,
  "volume": 80,
  "viewport": {
    "width": 1920,
    "height": 1080
  }
}
```

### Export Format
```json
{
  "metadata": {
    "source": "TubeDAO Chrome Extension",
    "version": "1.0.0",
    "exportDate": "2025-01-15T10:30:00.000Z",
    "totalEvents": 1250,
    "privacyNote": "Data collected with user consent..."
  },
  "summary": {
    "totalEvents": 1250,
    "adInteractions": 89,
    "playbackActions": 756,
    "sessionCount": 23
  },
  "events": [...]
}
```

## 🔐 Security & Privacy

### Data Protection
- **Local-First** - No remote data transmission without user action
- **Encryption Ready** - Data structure supports future encryption
- **Minimal Collection** - Only captures necessary behavioral signals
- **Anonymization** - Personal identifiers are excluded

### Permissions
- **`storage`** - Local data persistence only
- **`activeTab`** - YouTube page access when explicitly activated
- **`https://www.youtube.com/*`** - YouTube domain access only

### Compliance
- **GDPR Ready** - User consent and data portability
- **CCPA Compatible** - Transparent data practices
- **Chrome Store Compliant** - Follows all extension policies

## 🚧 Roadmap

### Version 1.1
- [ ] Enhanced ad detection algorithms
- [ ] YouTube Shorts support
- [ ] Advanced privacy controls
- [ ] Data encryption options

### Version 1.2
- [ ] Cross-device synchronization
- [ ] Advanced analytics dashboard
- [ ] Custom data filters
- [ ] Automated contribution workflows

### Future Considerations
- [ ] Integration with TubeDAO web platform
- [ ] Advanced machine learning insights
- [ ] Community data sharing protocols
- [ ] Monetization and token rewards

## 📄 License

This project is part of the TubeDAO ecosystem. See the main repository license for terms and conditions.

---

**TubeDAO** - Own Your Data, Power the Future of Content Intelligence 