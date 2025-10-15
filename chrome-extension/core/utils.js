const TubeDAOUtils = {
  extractVideoId(url) {
    const urlObj = new URL(url || window.location.href);
    return urlObj.searchParams.get('v');
  },

  getPageType(pathname) {
    if (pathname.includes('/watch')) return 'watch';
    if (pathname.includes('/shorts')) return 'shorts';
    if (pathname.includes('/channel')) return 'channel';
    if (pathname === '/') return 'home';
    return 'other';
  },

  getVideoQuality(video) {
    if (!video) return null;
    
    const width = video.videoWidth;
    if (width >= 1920) return '1080p+';
    if (width >= 1280) return '720p';
    if (width >= 854) return '480p';
    if (width >= 640) return '360p';
    return 'low';
  },

  formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  getElementSignature(element) {
    return {
      tag: element.tagName.toLowerCase(),
      id: element.id,
      classes: element.className,
      text: element.innerText?.substring(0, 100),
      attributes: {
        href: element.getAttribute('href'),
        src: element.getAttribute('src'),
        type: element.getAttribute('type'),
        role: element.getAttribute('role'),
        ariaLabel: element.getAttribute('aria-label')
      }
    };
  },

  getScrollDepth() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const scrollPercent = scrollTop / (docHeight - winHeight);
    return Math.min(Math.round(scrollPercent * 100), 100);
  }
};

