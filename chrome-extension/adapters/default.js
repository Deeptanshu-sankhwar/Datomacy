class DefaultAdapter extends BaseAdapter {
  constructor(collector) {
    super(collector);
    this.dwellStartTime = Date.now();
    this.lastScrollDepth = 0;
  }

  async init() {
    await super.init();
    
    this.setupDwellTracking();
    this.trackPageMetadata();
  }

  setupDwellTracking() {
    this.dwellStartTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
      const dwellTime = Math.round((Date.now() - this.dwellStartTime) / 1000);
      this.captureEvent('page_exit', 'engagement', {
        dwell_time_seconds: dwellTime,
        max_scroll_depth: this.lastScrollDepth
      });
    });
  }

  trackPageMetadata() {
    const metadata = {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      author: document.querySelector('meta[name="author"]')?.content,
      og_type: document.querySelector('meta[property="og:type"]')?.content,
      og_title: document.querySelector('meta[property="og:title"]')?.content,
      canonical_url: document.querySelector('link[rel="canonical"]')?.href
    };

    this.captureEvent('page_view', 'navigation', metadata);
  }

  handleClick(event, baseData) {
    const target = event.target;
    const closestLink = target.closest('a');
    
    if (closestLink) {
      this.captureEvent('link_click', 'interaction', {
        ...baseData,
        href: closestLink.href,
        link_text: closestLink.innerText?.substring(0, 100),
        is_external: new URL(closestLink.href).hostname !== window.location.hostname
      });
    }
  }

  handleScroll(scrollDepth) {
    if (scrollDepth > this.lastScrollDepth) {
      this.lastScrollDepth = scrollDepth;
    }
  }

  handlePageChange(oldUrl, newUrl) {
    const dwellTime = Math.round((Date.now() - this.dwellStartTime) / 1000);
    
    this.captureEvent('spa_navigation', 'navigation', {
      from_url: oldUrl,
      to_url: newUrl,
      dwell_time_seconds: dwellTime
    });
    
    this.dwellStartTime = Date.now();
    this.lastScrollDepth = 0;
    this.trackPageMetadata();
  }

  attachVideoListeners(video) {
    video.addEventListener('timeupdate', () => {
      const currentTime = Math.floor(video.currentTime);
      if (currentTime > 0 && currentTime % 30 === 0) {
        this.captureEvent('video_progress', 'media', {
          current_time: currentTime,
          duration: video.duration,
          progress_percentage: Math.round((currentTime / video.duration) * 100)
        });
      }
    });
  }

  cleanup() {
    super.cleanup();
  }
}

