// Hotjar Plugin for Vue 3 - A/B Testing Integration

// Helper functions for A/B testing events with Hotjar
export const HotjarEvents = {
  // Initialize Hotjar (called from main.js after script loads)
  init(siteId) {
    window.hj = window.hj || function() { 
      (window.hj.q = window.hj.q || []).push(arguments);
    };
    window._hjSettings = { hjid: siteId, hjsv: 6 };
  },

  // Check if Hotjar is loaded
  isLoaded() {
    return typeof window.hj === 'function';
  },

  // Track page view with variant
  trackPageView(pageName, variant = 'A') {
    if (!this.isLoaded()) return;
    const eventName = `viewed_${pageName.toLowerCase()}_${variant}`;
    window.hj('event', eventName);
  },

  // Track button click
  trackButtonClick(buttonName, pageName, variant = 'A') {
    if (!this.isLoaded()) return;
    const eventName = `clicked_${buttonName}_${variant}`;
    window.hj('event', eventName);
  },

  // Track navigation between pages
  trackNavigation(fromPage, toPage, variant = 'A') {
    if (!this.isLoaded()) return;
    const eventName = `nav_${fromPage}_to_${toPage}_${variant}`;
    window.hj('event', eventName);
  },

  // Track search queries
  trackSearch(query, pageName, variant = 'A') {
    if (!this.isLoaded()) return;
    const eventName = `search_${pageName.toLowerCase()}_${variant}`;
    window.hj('event', eventName);
    // Also track as user attribute
    window.hj('identify', null, {
      last_search_query: query,
      search_variant: variant
    });
  },

  // Track CRUD operations
  trackCRUDOperation(operation, entityType, pageName, variant = 'A') {
    if (!this.isLoaded()) return;
    const eventName = `${operation}_${entityType}_${variant}`;
    window.hj('event', eventName);
  },

  // Track A/B test assignment
  trackABTestAssignment(testName, variant) {
    if (!this.isLoaded()) return;
    const eventName = `ab_test_${testName}_${variant}`;
    window.hj('event', eventName);
    // Store variant as user attribute for segmentation
    window.hj('identify', null, {
      [`${testName}_variant`]: variant
    });
  },

  // Track time spent on page
  trackTimeOnPage(pageName, variant, timeInSeconds) {
    if (!this.isLoaded()) return;
    const eventName = `time_on_${pageName.toLowerCase()}_${variant}`;
    window.hj('event', eventName);
    // Store as user attribute
    window.hj('identify', null, {
      [`${pageName.toLowerCase()}_time`]: timeInSeconds,
      [`${pageName.toLowerCase()}_variant`]: variant
    });
  },

  // Track feature usage
  trackFeatureUsage(featureName, pageName, variant = 'A') {
    if (!this.isLoaded()) return;
    const eventName = `used_${featureName}_${variant}`;
    window.hj('event', eventName);
  },

  // Identify user with custom attributes
  identifyUser(userId, attributes = {}) {
    if (!this.isLoaded()) return;
    window.hj('identify', userId, attributes);
  },

  // Trigger survey for specific variant
  triggerSurvey(surveyId) {
    if (!this.isLoaded()) return;
    window.hj('trigger', surveyId);
  },

  // Send custom event
  sendEvent(eventName) {
    if (!this.isLoaded()) return;
    window.hj('event', eventName);
  },

  // Track form submission
  trackFormSubmission(formName, pageName, variant = 'A') {
    if (!this.isLoaded()) return;
    const eventName = `submitted_${formName}_${variant}`;
    window.hj('event', eventName);
  },

  // Track modal open/close
  trackModal(action, modalName, pageName, variant = 'A') {
    if (!this.isLoaded()) return;
    const eventName = `${action}_${modalName}_modal_${variant}`;
    window.hj('event', eventName);
  },

  // Track error occurrence
  trackError(errorType, pageName, variant = 'A') {
    if (!this.isLoaded()) return;
    const eventName = `error_${errorType}_${variant}`;
    window.hj('event', eventName);
  },

  // Track conversion event
  trackConversion(goalName, variant = 'A', value = null) {
    if (!this.isLoaded()) return;
    const eventName = `conversion_${goalName}_${variant}`;
    window.hj('event', eventName);
    if (value) {
      window.hj('identify', null, {
        [`${goalName}_value`]: value
      });
    }
  }
};

// Vue Plugin
export default {
  install(app) {
    // Make Hotjar events available globally
    app.config.globalProperties.$hotjar = HotjarEvents;
    
    // Provide for Composition API
    app.provide('hotjar', HotjarEvents);
  }
};
