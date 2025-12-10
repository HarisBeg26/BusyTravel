// A/B Testing Router Helper
// Randomly assigns users to variant A or B and redirects them

export const ABTestRouter = {
  // Get or assign variant for current session
  getVariant() {
    // Check if variant is already stored in sessionStorage
    let variant = sessionStorage.getItem('ab_test_variant');
    
    if (!variant) {
      // Randomly assign variant A or B (50/50 split)
      variant = Math.random() < 0.5 ? 'A' : 'B';
      sessionStorage.setItem('ab_test_variant', variant);
      
      // Track assignment in ContentSquare
      if (window._uxa && typeof window._uxa.push === 'function') {
        window._uxa.push(['trackEvent', 'AB_Test_Assignment', {
          variant: variant,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent
        }]);
      }
      
      console.log(`User assigned to variant: ${variant}`);
    }
    
    return variant;
  },

  // Redirect to appropriate home page variant
  redirectToHomeVariant(router) {
    const variant = this.getVariant();
    const currentPath = router.currentRoute.value.path;
    
    // If user is on home page, redirect based on variant
    if (currentPath === '/' && variant === 'B') {
      router.push('/home-b');
    } else if (currentPath === '/home-b' && variant === 'A') {
      router.push('/');
    }
  },

  // Redirect to appropriate trips page variant
  redirectToTripsVariant(router) {
    const variant = this.getVariant();
    const currentPath = router.currentRoute.value.path;
    
    // If user is on trips page, redirect based on variant
    if (currentPath === '/trips' && variant === 'B') {
      router.push('/trips-b');
    } else if (currentPath === '/trips-b' && variant === 'A') {
      router.push('/trips');
    }
  },

  // Get the correct route path for variant
  getVariantRoute(basePath) {
    const variant = this.getVariant();
    
    if (basePath === '/') {
      return variant === 'B' ? '/home-b' : '/';
    } else if (basePath === '/trips') {
      return variant === 'B' ? '/trips-b' : '/trips';
    }
    
    return basePath;
  },

  // Force assign specific variant (for testing purposes)
  forceVariant(variant) {
    if (variant === 'A' || variant === 'B') {
      sessionStorage.setItem('ab_test_variant', variant);
      console.log(`Variant forced to: ${variant}`);
      return true;
    }
    return false;
  },

  // Clear variant (start fresh)
  clearVariant() {
    sessionStorage.removeItem('ab_test_variant');
    console.log('Variant cleared');
  }
};

export default ABTestRouter;
