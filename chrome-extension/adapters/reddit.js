class RedditAdapter extends BaseAdapter {
  constructor(collector) {
    super(collector);
    this.viewedPosts = new Set();
    this.currentSubreddit = null;
  }

  async init() {
    await super.init();
    
    this.setupPostTracking();
    this.setupEngagementTracking();
    this.trackSubreddit();
  }

  setupPostTracking() {
    const postObserver = new MutationObserver(() => {
      this.checkForPosts(document.body);
    });

    postObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    this.checkForPosts(document.body);
  }

  checkForPosts(element) {
    const posts = element.querySelectorAll ? 
      element.querySelectorAll('[data-testid="post-container"], [data-test-id="post-content"]') : [];
    
    posts.forEach(post => {
      const postId = this.extractPostId(post);
      if (postId && !this.viewedPosts.has(postId)) {
        this.viewedPosts.add(postId);
        
        if (this.isElementInViewport(post)) {
          this.captureEvent('post_view', 'engagement', {
            post_id: postId,
            subreddit: this.getPostSubreddit(post),
            post_type: this.getPostType(post),
            has_media: this.postHasMedia(post),
            upvotes: this.getUpvotes(post),
            comments: this.getCommentCount(post)
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
        this.handleRedditEngagement(button);
      }
    }, true);
  }

  handleRedditEngagement(element) {
    const ariaLabel = element.getAttribute('aria-label') || '';
    const className = element.className || '';
    
    let eventType = null;
    
    if (ariaLabel.includes('upvote') || className.includes('upvote')) {
      eventType = 'post_upvote';
    } else if (ariaLabel.includes('downvote') || className.includes('downvote')) {
      eventType = 'post_downvote';
    } else if (ariaLabel.includes('Save') || className.includes('save')) {
      eventType = 'post_save';
    } else if (ariaLabel.includes('Share') || className.includes('share')) {
      eventType = 'post_share';
    } else if (ariaLabel.includes('Award')) {
      eventType = 'post_award';
    } else if (ariaLabel.includes('Join') || ariaLabel.includes('Subscribe')) {
      eventType = 'subreddit_join';
    }

    if (eventType) {
      const post = element.closest('[data-testid="post-container"], [data-test-id="post-content"]');
      const postId = post ? this.extractPostId(post) : null;
      
      this.captureEvent(eventType, 'engagement', {
        post_id: postId,
        subreddit: this.currentSubreddit
      });
    }
  }

  handleClick(event, baseData) {
    const target = event.target;
    const link = target.closest('a');
    
    if (link && link.href.includes('/comments/')) {
      this.captureEvent('post_click', 'interaction', {
        ...baseData,
        post_url: link.href
      });
    }
  }

  handleScroll(scrollDepth) {
    this.checkForPosts(document.body);
  }

  handlePageChange(oldUrl, newUrl) {
    this.trackSubreddit();
    
    const pageType = this.getRedditPageType(newUrl);
    
    this.captureEvent('reddit_navigation', 'navigation', {
      from_url: oldUrl,
      to_url: newUrl,
      page_type: pageType,
      subreddit: this.currentSubreddit
    });
    
    this.viewedPosts.clear();
  }

  trackSubreddit() {
    const match = window.location.pathname.match(/\/r\/([^\/]+)/);
    this.currentSubreddit = match ? match[1] : null;
  }

  extractPostId(postElement) {
    const link = postElement.querySelector('a[href*="/comments/"]');
    if (link) {
      const match = link.href.match(/\/comments\/([^\/]+)/);
      return match ? match[1] : null;
    }
    return null;
  }

  getPostSubreddit(postElement) {
    const subredditLink = postElement.querySelector('a[href*="/r/"]');
    if (subredditLink) {
      const match = subredditLink.href.match(/\/r\/([^\/]+)/);
      return match ? match[1] : null;
    }
    return this.currentSubreddit;
  }

  getPostType(postElement) {
    if (postElement.querySelector('[data-testid="post-media-container"] img')) return 'image';
    if (postElement.querySelector('video')) return 'video';
    if (postElement.querySelector('[data-click-id="text"]')) return 'text';
    if (postElement.querySelector('a[data-click-id="body"]')) return 'link';
    return 'unknown';
  }

  postHasMedia(postElement) {
    return !!(postElement.querySelector('img, video'));
  }

  getUpvotes(postElement) {
    const scoreElement = postElement.querySelector('[data-test-id="post-score"]');
    return scoreElement ? scoreElement.textContent : null;
  }

  getCommentCount(postElement) {
    const commentElement = postElement.querySelector('[data-click-id="comments"]');
    if (commentElement) {
      const match = commentElement.textContent.match(/(\d+)/);
      return match ? parseInt(match[1]) : null;
    }
    return null;
  }

  getRedditPageType(url) {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    
    if (path === '/' || path === '/home') return 'home';
    if (path.includes('/comments/')) return 'post';
    if (path.match(/^\/r\/[^\/]+\/?$/)) return 'subreddit';
    if (path.includes('/user/')) return 'profile';
    if (path === '/r/popular') return 'popular';
    if (path === '/r/all') return 'all';
    return 'other';
  }

  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom > 0
    );
  }

  cleanup() {
    super.cleanup();
    this.viewedPosts.clear();
  }
}

