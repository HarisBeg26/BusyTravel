// ContentSquare Tracking Helper
// ContentSquare avtomatično sledi dogodkom, ampak lahko tudi ročno označimo pomembne dogodke

export const ContentSquareEvents = {
  // Track custom event
  trackEvent(eventName, data = {}) {
    if (window._uxa && typeof window._uxa.push === 'function') {
      window._uxa.push(['trackEvent', eventName, data]);
      console.log(`ContentSquare event tracked: ${eventName}`, data);
    }
  },

  // Track page view with variant
  trackPageView(pageName, variant = 'A') {
    this.trackEvent('PageView', {
      page: pageName,
      variant: variant,
      timestamp: new Date().toISOString()
    });
  },

  // Track button click
  trackButtonClick(buttonName, pageName, variant = 'A') {
    this.trackEvent('ButtonClick', {
      button: buttonName,
      page: pageName,
      variant: variant
    });
  },

  // Track navigation
  trackNavigation(fromPage, toPage, variant = 'A') {
    this.trackEvent('Navigation', {
      from: fromPage,
      to: toPage,
      variant: variant
    });
  },

  // Track search
  trackSearch(query, pageName, variant = 'A') {
    this.trackEvent('Search', {
      query: query,
      page: pageName,
      variant: variant
    });
  },

  // Track CRUD operations
  trackCRUDOperation(operation, entityType, pageName, variant = 'A') {
    this.trackEvent('CRUDOperation', {
      operation: operation,
      entity: entityType,
      page: pageName,
      variant: variant
    });
  },

  // Track A/B test assignment
  trackABTestAssignment(testName, variant) {
    this.trackEvent('ABTestAssignment', {
      test: testName,
      variant: variant
    });
  },

  // Track time on page
  trackTimeOnPage(pageName, variant, timeInSeconds) {
    this.trackEvent('TimeOnPage', {
      page: pageName,
      variant: variant,
      duration: timeInSeconds
    });
  },

  // Track feature usage
  trackFeatureUsage(featureName, pageName, variant = 'A') {
    this.trackEvent('FeatureUsage', {
      feature: featureName,
      page: pageName,
      variant: variant
    });
  }
};

export default ContentSquareEvents;
