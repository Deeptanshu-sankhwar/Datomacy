class BaseAdapter {
  constructor(collector) {
    this.collector = collector;
    this.initialized = false;
  }

  async init() {
    this.initialized = true;
  }

  cleanup() {
    this.initialized = false;
  }

  handleClick(event, baseData) {
  }

  handleScroll(scrollDepth) {
  }

  handlePageChange(oldUrl, newUrl) {
  }

  attachVideoListeners(video) {
  }

  captureEvent(eventType, category, data = {}) {
    if (this.collector.consentEnabled) {
      this.collector.captureEvent(eventType, category, data);
    }
  }
}

