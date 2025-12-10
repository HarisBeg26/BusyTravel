// A-B Testing Service
class ABTestingService {
  constructor() {
    this.testConfig = {
      'home': {
        variants: ['A', 'B'],
        weights: [50, 50] // 50/50 split
      },
      'trips': {
        variants: ['A', 'B'],
        weights: [50, 50] // 50/50 split
      }
    };
    
    // Initialize user's test group
    this.initializeUserSession();
  }

  initializeUserSession() {
    // Check if user already has a test session
    if (!localStorage.getItem('ab_test_session')) {
      const sessionId = this.generateSessionId();
      const testGroups = {};
      
      // Assign user to test groups for each test
      Object.keys(this.testConfig).forEach(testName => {
        testGroups[testName] = this.assignVariant(testName);
      });
      
      const session = {
        sessionId,
        testGroups,
        startTime: Date.now()
      };
      
      localStorage.setItem('ab_test_session', JSON.stringify(session));
      
      // Track session start event
      this.trackEvent('session_start', {
        sessionId,
        testGroups
      });
    }
  }

  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  assignVariant(testName) {
    const config = this.testConfig[testName];
    if (!config) return 'A'; // Default to A if test not configured
    
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (let i = 0; i < config.variants.length; i++) {
      cumulative += config.weights[i];
      if (random <= cumulative) {
        return config.variants[i];
      }
    }
    
    return config.variants[0]; // Fallback to first variant
  }

  getUserVariant(testName) {
    const session = JSON.parse(localStorage.getItem('ab_test_session'));
    return session?.testGroups?.[testName] || 'A';
  }

  getSessionId() {
    const session = JSON.parse(localStorage.getItem('ab_test_session'));
    return session?.sessionId || 'unknown';
  }

  trackEvent(eventName, eventData = {}) {
    const session = JSON.parse(localStorage.getItem('ab_test_session'));
    const sessionId = session?.sessionId || 'unknown';
    const testGroups = session?.testGroups || {};

    const eventPayload = {
      eventName,
      sessionId,
      testGroups,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...eventData
    };

    // Send to Browzee or other analytics service
    this.sendToBrowzee(eventPayload);
    
    // Also log to console for debugging
    console.log('AB Test Event:', eventPayload);
  }

  sendToBrowzee(eventPayload) {
    // Browsee integration (already configured in index.html)
    if (window._browsee) {
      try {
        // Send custom event to Browsee
        window._browsee('track', eventPayload.eventName, {
          session_id: eventPayload.sessionId,
          test_groups: JSON.stringify(eventPayload.testGroups),
          variant: eventPayload.variant || 'A',
          timestamp: eventPayload.timestamp,
          page_url: eventPayload.url,
          ...eventPayload
        });
      } catch (error) {
        console.error('Error sending to Browsee:', error);
      }
    }

    // Fallback: send to your backend for analytics
    this.sendToBackend(eventPayload);
  }

  async sendToBackend(eventPayload) {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventPayload)
      });
    } catch (error) {
      console.error('Error sending analytics to backend:', error);
    }
  }

  // Track page views
  trackPageView(pageName, additionalData = {}) {
    const variant = this.getUserVariant(pageName);
    this.trackEvent('page_view', {
      page: pageName,
      variant,
      ...additionalData
    });
  }

  // Track button clicks
  trackButtonClick(buttonName, pageName, additionalData = {}) {
    const variant = this.getUserVariant(pageName);
    this.trackEvent('button_click', {
      button: buttonName,
      page: pageName,
      variant,
      ...additionalData
    });
  }

  // Track form submissions
  trackFormSubmission(formName, pageName, additionalData = {}) {
    const variant = this.getUserVariant(pageName);
    this.trackEvent('form_submission', {
      form: formName,
      page: pageName,
      variant,
      ...additionalData
    });
  }

  // Track task completion
  trackTaskCompletion(taskName, duration, success = true, additionalData = {}) {
    this.trackEvent('task_completion', {
      task: taskName,
      duration,
      success,
      ...additionalData
    });
  }

  // Track SUS questionnaire submission
  trackSUSSubmission(scores, pageName, additionalData = {}) {
    const variant = this.getUserVariant(pageName);
    this.trackEvent('sus_submission', {
      sus_scores: scores,
      page: pageName,
      variant,
      ...additionalData
    });
  }
}

// Create singleton instance
const abTestingService = new ABTestingService();

export default abTestingService;
