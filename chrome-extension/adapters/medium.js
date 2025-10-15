class MediumAdapter extends BaseAdapter {
  constructor(collector) {
    super(collector);
    this.readingStartTime = Date.now();
    this.maxScrollDepth = 0;
    this.articleData = null;
  }

  async init() {
    await super.init();
    
    this.trackArticleData();
    this.setupReadingTracking();
    this.setupEngagementTracking();
  }

  trackArticleData() {
    this.articleData = {
      title: document.querySelector('h1')?.textContent,
      author: document.querySelector('[data-testid="authorName"]')?.textContent || 
              document.querySelector('a[rel="author"]')?.textContent,
      publication: document.querySelector('[data-testid="publicationName"]')?.textContent,
      word_count: this.estimateWordCount(),
      has_paywall: !!document.querySelector('[data-testid="meter-popup"]'),
      claps: this.getClapCount()
    };

    this.captureEvent('article_view', 'engagement', this.articleData);
  }

  setupReadingTracking() {
    let lastDepth = 0;
    
    const trackReading = TubeDAOUtils.throttle(() => {
      const scrollDepth = this.getArticleScrollDepth();
      
      if (scrollDepth > this.maxScrollDepth) {
        this.maxScrollDepth = scrollDepth;
      }

      if (scrollDepth >= 25 && lastDepth < 25) {
        this.captureReadingMilestone(25);
      } else if (scrollDepth >= 50 && lastDepth < 50) {
        this.captureReadingMilestone(50);
      } else if (scrollDepth >= 75 && lastDepth < 75) {
        this.captureReadingMilestone(75);
      } else if (scrollDepth >= 100 && lastDepth < 100) {
        this.captureReadingMilestone(100);
      }
      
      lastDepth = scrollDepth;
    }, 1000);

    window.addEventListener('scroll', trackReading, { passive: true });
  }

  setupEngagementTracking() {
    document.addEventListener('click', (event) => {
      const target = event.target;
      const button = target.closest('button, [role="button"]');
      
      if (button) {
        this.handleMediumEngagement(button);
      }
    }, true);
  }

  handleMediumEngagement(element) {
    const ariaLabel = element.getAttribute('aria-label') || '';
    const dataAction = element.getAttribute('data-action') || '';
    
    let eventType = null;
    
    if (ariaLabel.includes('clap') || ariaLabel.includes('Clap') || dataAction === 'clap') {
      eventType = 'article_clap';
    } else if (ariaLabel.includes('Follow') || dataAction === 'follow') {
      eventType = 'author_follow';
    } else if (ariaLabel.includes('Bookmark') || ariaLabel.includes('Save')) {
      eventType = 'article_bookmark';
    } else if (ariaLabel.includes('Share') || dataAction === 'share') {
      eventType = 'article_share';
    } else if (ariaLabel.includes('Highlight')) {
      eventType = 'text_highlight';
    } else if (ariaLabel.includes('Respond') || ariaLabel.includes('Comment')) {
      eventType = 'article_comment';
    }

    if (eventType) {
      this.captureEvent(eventType, 'engagement', {
        ...this.articleData,
        reading_time_seconds: Math.round((Date.now() - this.readingStartTime) / 1000),
        max_scroll_depth: this.maxScrollDepth
      });
    }
  }

  handleClick(event, baseData) {
    const target = event.target;
    const link = target.closest('a');
    
    if (link) {
      if (link.href.includes('/@')) {
        this.captureEvent('author_click', 'interaction', {
          ...baseData,
          author_url: link.href
        });
      } else if (link.hostname === 'medium.com' || link.hostname.includes('.medium.com')) {
        this.captureEvent('article_link_click', 'interaction', {
          ...baseData,
          link_url: link.href
        });
      }
    }
  }

  handleScroll(scrollDepth) {
  }

  handlePageChange(oldUrl, newUrl) {
    const readingTime = Math.round((Date.now() - this.readingStartTime) / 1000);
    
    this.captureEvent('article_exit', 'engagement', {
      ...this.articleData,
      reading_time_seconds: readingTime,
      max_scroll_depth: this.maxScrollDepth,
      completed: this.maxScrollDepth >= 90
    });
    
    this.readingStartTime = Date.now();
    this.maxScrollDepth = 0;
    this.trackArticleData();
  }

  captureReadingMilestone(percentage) {
    const readingTime = Math.round((Date.now() - this.readingStartTime) / 1000);
    
    this.captureEvent('reading_progress', 'engagement', {
      ...this.articleData,
      progress_percentage: percentage,
      reading_time_seconds: readingTime
    });
  }

  getArticleScrollDepth() {
    const article = document.querySelector('article');
    if (!article) return TubeDAOUtils.getScrollDepth();
    
    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const scrollPosition = window.scrollY + window.innerHeight;
    
    if (scrollPosition < articleTop) return 0;
    if (scrollPosition > articleTop + articleHeight) return 100;
    
    return Math.round(((scrollPosition - articleTop) / articleHeight) * 100);
  }

  estimateWordCount() {
    const article = document.querySelector('article');
    if (!article) return null;
    
    const text = article.textContent || '';
    const words = text.trim().split(/\s+/).length;
    return words;
  }

  getClapCount() {
    const clapButton = document.querySelector('button[data-action="clap"]');
    if (!clapButton) return null;
    
    const clapText = clapButton.textContent;
    const match = clapText.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  cleanup() {
    super.cleanup();
  }
}

