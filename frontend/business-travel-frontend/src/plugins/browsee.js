import browsee from '@browsee/web-sdk';

// Browsee Plugin for Vue 3
export default {
  install(app) {
    // Make browsee available globally
    app.config.globalProperties.$browsee = browsee;
    
    // Provide browsee for Composition API
    app.provide('browsee', browsee);
  }
};

// Helper functions for A/B testing events
export const BrowseeEvents = {
  // Page view events
  trackPageView(pageName, variant = 'A') {
    browsee.logEvent('page_view', {
      page_name: pageName,
      variant: variant,
      timestamp: new Date().toISOString()
    });
  },
  
  // User interaction events
  trackButtonClick(buttonName, pageName, variant = 'A') {
    browsee.logEvent('button_click', {
      button_name: buttonName,
      page_name: pageName,
      variant: variant,
      timestamp: new Date().toISOString()
    });
  },
  
  // Navigation events
  trackNavigation(from, to, variant = 'A') {
    browsee.logEvent('navigation', {
      from_page: from,
      to_page: to,
      variant: variant,
      timestamp: new Date().toISOString()
    });
  },
  
  // Search events
  trackSearch(query, pageName, variant = 'A') {
    browsee.logEvent('search', {
      search_query: query,
      page_name: pageName,
      variant: variant,
      timestamp: new Date().toISOString()
    });
  },
  
  // CRUD operation events
  trackCRUDOperation(operation, entityType, pageName, variant = 'A') {
    browsee.logEvent('crud_operation', {
      operation_type: operation, // 'create', 'read', 'update', 'delete'
      entity_type: entityType, // 'trip', 'expense'
      page_name: pageName,
      variant: variant,
      timestamp: new Date().toISOString()
    });
  },
  
  // A/B Test assignment
  trackABTestAssignment(testName, variant) {
    browsee.logEvent('ab_test_assignment', {
      test_name: testName,
      variant: variant,
      timestamp: new Date().toISOString()
    });
  },
  
  // Time on page tracking
  trackTimeOnPage(pageName, variant, timeInSeconds) {
    browsee.logEvent('time_on_page', {
      page_name: pageName,
      variant: variant,
      duration_seconds: timeInSeconds,
      timestamp: new Date().toISOString()
    });
  },
  
  // Feature usage tracking
  trackFeatureUsage(featureName, pageName, variant = 'A') {
    browsee.logEvent('feature_usage', {
      feature_name: featureName,
      page_name: pageName,
      variant: variant,
      timestamp: new Date().toISOString()
    });
  }
};
