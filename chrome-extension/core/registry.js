class AdapterRegistry {
  constructor() {
    this.adapters = new Map();
    this.domainPatterns = [];
  }

  register(pattern, adapterClass) {
    const regex = this.patternToRegex(pattern);
    this.domainPatterns.push({ pattern, regex, adapterClass });
    this.adapters.set(pattern, adapterClass);
  }

  getAdapter(hostname) {
    for (const { regex, adapterClass } of this.domainPatterns) {
      if (regex.test(hostname)) {
        return adapterClass;
      }
    }
    
    return this.adapters.get('default');
  }

  patternToRegex(pattern) {
    if (pattern === 'default') {
      return /^.*$/;
    }
    
    const escaped = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*');
    
    return new RegExp(`^${escaped}$`, 'i');
  }

  listAdapters() {
    return Array.from(this.adapters.keys());
  }
}

