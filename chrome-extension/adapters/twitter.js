class TwitterAdapter extends BaseAdapter {
  constructor(collector) {
    super(collector);
    this.currentTweetId = null;
    this.viewedTweets = new Set();
  }

  async init() {
    await super.init();
    
    this.setupTweetTracking();
    this.setupEngagementTracking();
  }

  setupTweetTracking() {
    const tweetObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            this.checkForTweets(node);
          }
        });
      });
    });

    tweetObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    this.checkForTweets(document.body);
  }

  checkForTweets(element) {
    const tweets = element.querySelectorAll ? element.querySelectorAll('article[data-testid="tweet"]') : [];
    
    tweets.forEach(tweet => {
      const tweetId = this.extractTweetId(tweet);
      if (tweetId && !this.viewedTweets.has(tweetId)) {
        this.viewedTweets.add(tweetId);
        
        const isInViewport = this.isElementInViewport(tweet);
        if (isInViewport) {
          this.captureEvent('tweet_view', 'engagement', {
            tweet_id: tweetId,
            tweet_author: this.getTweetAuthor(tweet),
            has_media: this.tweetHasMedia(tweet),
            is_reply: this.isTweetReply(tweet),
            is_retweet: this.isTweetRetweet(tweet)
          });
        }
      }
    });
  }

  setupEngagementTracking() {
    document.addEventListener('click', (event) => {
      const target = event.target;
      const button = target.closest('button, [role="button"]');
      
      if (button) {
        this.handleTwitterEngagement(button);
      }
    }, true);
  }

  handleTwitterEngagement(element) {
    const ariaLabel = element.getAttribute('aria-label') || '';
    const testId = element.getAttribute('data-testid') || '';
    
    let eventType = null;
    
    if (ariaLabel.includes('Like') || testId.includes('like')) {
      eventType = 'tweet_like';
    } else if (ariaLabel.includes('Retweet') || testId.includes('retweet')) {
      eventType = 'tweet_retweet';
    } else if (ariaLabel.includes('Reply') || testId.includes('reply')) {
      eventType = 'tweet_reply';
    } else if (ariaLabel.includes('Share') || testId.includes('share')) {
      eventType = 'tweet_share';
    } else if (ariaLabel.includes('Bookmark') || testId.includes('bookmark')) {
      eventType = 'tweet_bookmark';
    } else if (ariaLabel.includes('Follow')) {
      eventType = 'user_follow';
    }

    if (eventType) {
      const tweet = element.closest('article[data-testid="tweet"]');
      const tweetId = tweet ? this.extractTweetId(tweet) : null;
      
      this.captureEvent(eventType, 'engagement', {
        tweet_id: tweetId,
        tweet_author: tweet ? this.getTweetAuthor(tweet) : null
      });
    }
  }

  handleClick(event, baseData) {
    const target = event.target;
    const link = target.closest('a');
    
    if (link && link.href.includes('/status/')) {
      this.captureEvent('tweet_click', 'interaction', {
        ...baseData,
        tweet_url: link.href
      });
    }
  }

  handleScroll(scrollDepth) {
    this.checkForTweets(document.body);
  }

  handlePageChange(oldUrl, newUrl) {
    const pageType = this.getTwitterPageType(newUrl);
    
    this.captureEvent('twitter_navigation', 'navigation', {
      from_url: oldUrl,
      to_url: newUrl,
      page_type: pageType
    });
    
    this.viewedTweets.clear();
  }

  extractTweetId(tweetElement) {
    const link = tweetElement.querySelector('a[href*="/status/"]');
    if (link) {
      const match = link.href.match(/\/status\/(\d+)/);
      return match ? match[1] : null;
    }
    return null;
  }

  getTweetAuthor(tweetElement) {
    const authorLink = tweetElement.querySelector('a[href^="/"][tabindex="-1"]');
    return authorLink ? authorLink.href.split('/').pop() : null;
  }

  tweetHasMedia(tweetElement) {
    return !!tweetElement.querySelector('[data-testid="tweetPhoto"], [data-testid="videoPlayer"]');
  }

  isTweetReply(tweetElement) {
    return !!tweetElement.querySelector('[data-testid="reply"]');
  }

  isTweetRetweet(tweetElement) {
    return !!tweetElement.querySelector('[data-testid="socialContext"]');
  }

  getTwitterPageType(url) {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    
    if (path === '/home') return 'home';
    if (path.includes('/status/')) return 'tweet';
    if (path === '/explore') return 'explore';
    if (path === '/notifications') return 'notifications';
    if (path === '/messages') return 'messages';
    if (path.match(/^\/[^\/]+$/)) return 'profile';
    return 'other';
  }

  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  cleanup() {
    super.cleanup();
    this.viewedTweets.clear();
  }
}

