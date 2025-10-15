# TubeDAO Universal Data Capture Extension

## Architecture Overview

The TubeDAO extension has been refactored to support **universal data capture** across all websites while maintaining high-fidelity tracking for specific platforms.

### Design Philosophy: Hierarchical Specialization

Instead of generalizing to the lowest common denominator, we use a hierarchical specialization approach:

```
Browser Extension
│
├── Universal Collector (base)
│     • Captures primitive browser events (click, scroll, media, input)
│     • Classifies event context (DOM region, element type, etc.)
│     • Broadcasts standardized event envelopes
│
└── Site Adapter Registry
      ├── YouTubeAdapter (detailed video tracking)
      ├── TwitterAdapter (tweet engagement)
      ├── RedditAdapter (post interactions)
      ├── MediumAdapter (reading behavior)
      └── DefaultAdapter (generic fallback)
```

## Directory Structure

```
chrome-extension/
├── core/
│   ├── collector.js       # Universal event collector
│   ├── registry.js        # Adapter registry system
│   └── utils.js          # Shared utilities
│
├── adapters/
│   ├── base.js           # Base adapter class
│   ├── default.js        # Generic site tracking
│   ├── youtube.js        # YouTube-specific tracking
│   ├── twitter.js        # Twitter/X-specific tracking
│   ├── reddit.js         # Reddit-specific tracking
│   └── medium.js         # Medium-specific tracking
│
├── content/
│   └── main.js           # Entry point & adapter registration
│
├── background/
│   └── background.js     # Service worker
│
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
│
└── manifest.json
```

## How It Works

### 1. Universal Collector

The `UniversalCollector` class in `core/collector.js` captures primitive browser events across all sites:

- **Click events**: Tracks all user clicks with element metadata
- **Scroll events**: Monitors scroll depth at 25% intervals
- **Media events**: Detects video/audio play, pause, and end events
- **Input events**: Tracks form interactions (anonymized)
- **Navigation events**: Monitors page changes and SPA routing

### 2. Adapter Registry

The `AdapterRegistry` in `core/registry.js` dynamically loads site-specific adapters:

```javascript
registry.register('*.youtube.com', YouTubeAdapter);
registry.register('*.twitter.com', TwitterAdapter);
registry.register('default', DefaultAdapter);
```

### 3. Site Adapters

Each adapter extends `BaseAdapter` and can:

- Override universal event handlers
- Add site-specific event listeners
- Enhance event data with platform context
- Clean up resources when navigating away

#### Example: YouTubeAdapter

```javascript
class YouTubeAdapter extends BaseAdapter {
  async init() {
    // Setup YouTube-specific tracking
    this.setupYouTubeSpecificListeners();
    this.setupAdDetection();
  }

  attachVideoListeners(video) {
    // Add detailed video event tracking
    video.addEventListener('timeupdate', ...);
  }
}
```

#### Example: DefaultAdapter

```javascript
class DefaultAdapter extends BaseAdapter {
  async init() {
    // Generic tracking for any site
    this.setupDwellTracking();
    this.trackPageMetadata();
  }
}
```

## Event Types

### Universal Events (captured on all sites)

| Event Type | Category | Description |
|------------|----------|-------------|
| `click` | interaction | All user clicks |
| `scroll_checkpoint` | engagement | Scroll depth milestones |
| `video_play/pause/ended` | media | Generic video events |
| `audio_play/pause` | media | Generic audio events |
| `input_interaction` | interaction | Form interactions |
| `navigation` | navigation | Page changes |
| `session_start/end` | session | User session lifecycle |

### Site-Specific Events

#### YouTube
- `progress_checkpoint` (every 10s)
- `seek_start/end`
- `speed_change`
- `quality_change`
- `ad_start/skip`
- `like_click`, `subscribe_click`, `share_click`
- `fullscreen_toggle`, `theater_mode`

#### Twitter
- `tweet_view`, `tweet_click`
- `tweet_like`, `tweet_retweet`, `tweet_reply`
- `tweet_share`, `tweet_bookmark`
- `user_follow`

#### Reddit
- `post_view`, `post_click`
- `post_upvote/downvote`
- `post_save`, `post_share`, `post_award`
- `subreddit_join`

#### Medium
- `article_view`, `article_exit`
- `reading_progress` (25%, 50%, 75%, 100%)
- `article_clap`, `article_bookmark`
- `text_highlight`, `article_comment`
- `author_follow`

## Quality Retention Strategy

This architecture preserves quality because:

1. **Not flattening**: Each site keeps its unique event schema
2. **Progressive enhancement**: High-value sites get detailed tracking
3. **Universal baseline**: Unknown sites still provide meaningful signals
4. **Modular**: Easy to add new adapters without affecting existing ones

## Performance Characteristics

| Aspect | Implementation |
|--------|---------------|
| CPU overhead | Controlled via base collector |
| Memory usage | Efficient event buffering (batch at 10 events) |
| Network calls | Batched uploads to minimize API hits |
| Adapter loading | Lazy-load only on matching hostname |
| Privacy | Whitelist per site, can disable specific domains |

## Adding New Adapters

To add tracking for a new site:

1. **Create adapter file**: `adapters/yoursite.js`

```javascript
class YourSiteAdapter extends BaseAdapter {
  async init() {
    await super.init();
    // Your site-specific setup
  }

  handleClick(event, baseData) {
    // Override to add site context
  }

  // Add custom methods
  trackYourSiteFeature() {
    this.captureEvent('custom_event', 'engagement', {
      // Your custom data
    });
  }
}
```

2. **Register adapter**: In `content/main.js`

```javascript
registry.register('*.yoursite.com', YourSiteAdapter);
```

3. **Update manifest**: Add script to `manifest.json`

```json
"js": [
  ...existing scripts,
  "adapters/yoursite.js",
  ...
]
```

## Event Data Schema

Every event includes:

```javascript
{
  event_type: string,       // e.g., "click", "video_play"
  category: string,          // e.g., "interaction", "media", "engagement"
  timestamp: ISO8601,        // When the event occurred
  session_id: string,        // User session identifier
  page_url: string,          // Current page URL
  site: string,              // Hostname (e.g., "youtube.com")
  adapter: string,           // Which adapter captured it
  user_agent: string,        // Browser info
  viewport: {
    width: number,
    height: number
  },
  ...adapter_specific_data   // Additional context from adapter
}
```

## Privacy & Permissions

The extension requests `<all_urls>` to enable universal tracking, but:

- Users can whitelist/blacklist specific sites
- Sensitive data (passwords, credit cards) is never captured
- Input tracking only records field types, not values
- All data is encrypted before upload

## Backend Integration

Events are batched and uploaded to the backend API:

- **Batch size**: 10 events
- **Endpoint**: `POST /api/events/upload`
- **Authentication**: JWT Bearer token
- **Fallback**: Local storage if upload fails

## Migration from Old Architecture

The old YouTube-only content script (`content/content.js`) has been fully refactored into the new modular system. No breaking changes to the backend API.

## Future Enhancements

- [ ] Add adapters for Instagram, TikTok, LinkedIn
- [ ] Implement user-configurable site preferences
- [ ] Add real-time event streaming option
- [ ] Create visualization dashboard for captured events
- [ ] Support for video streaming platforms (Netflix, Twitch)

