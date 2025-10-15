if (!window.tubeDAOMonitorInstance) {
  window.tubeDAOMonitorInstance = true;

  const registry = new AdapterRegistry();
  
  registry.register('*.youtube.com', YouTubeAdapter);
  registry.register('*.twitter.com', TwitterAdapter);
  registry.register('*.x.com', TwitterAdapter);
  registry.register('*.reddit.com', RedditAdapter);
  registry.register('*.medium.com', MediumAdapter);
  registry.register('default', DefaultAdapter);

  const collector = new UniversalCollector(registry);

  window.addEventListener('beforeunload', () => {
    collector.stopMonitoring();
  });
}

