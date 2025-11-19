import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Analytics configuration
const ANALYTICS_CONFIG = {
  googleAnalyticsId: 'G-XXXXXXXXXX', // Replace with your GA4 ID
  gtmId: 'GTM-XXXXXXX', // Replace with your GTM ID
  enabled: process.env.NODE_ENV === 'production',
  debugMode: process.env.NODE_ENV === 'development'
} as const;

// Extend Window interface for analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    gtm?: any;
  }
}

const hasGtag = (): boolean => typeof window !== 'undefined' && typeof window.gtag === 'function';

// Initialize Google Analytics
const initializeGA = (): void => {
  if (!ANALYTICS_CONFIG.googleAnalyticsId || !ANALYTICS_CONFIG.enabled) return;

  // Create gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.googleAnalyticsId}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer!.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', ANALYTICS_CONFIG.googleAnalyticsId, {
    page_title: document.title,
    page_location: window.location.href,
    debug_mode: ANALYTICS_CONFIG.debugMode
  });
};

// Initialize Google Tag Manager
const initializeGTM = () => {
  if (!ANALYTICS_CONFIG.gtmId || !ANALYTICS_CONFIG.enabled) return;

  // GTM Script
  const gtmScript = document.createElement('script');
  gtmScript.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${ANALYTICS_CONFIG.gtmId}');
  `;
  document.head.appendChild(gtmScript);

  // GTM NoScript fallback
  const gtmNoscript = document.createElement('noscript');
  gtmNoscript.innerHTML = `
    <iframe src="https://www.googletagmanager.com/ns.html?id=${ANALYTICS_CONFIG.gtmId}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>
  `;
  document.body.insertBefore(gtmNoscript, document.body.firstChild);
};

// Analytics utility functions
export const analytics = {
  // Track page views
  pageView: (path: string, title?: string): void => {
    if (!ANALYTICS_CONFIG.enabled || !hasGtag()) return;
    
    window.gtag!('config', ANALYTICS_CONFIG.googleAnalyticsId, {
      page_path: path,
      page_title: title || document.title,
    });

    if (ANALYTICS_CONFIG.debugMode) {
      console.log('Analytics: Page view', { path, title });
    }
  },

  // Track custom events
  event: (action: string, category: string, label?: string, value?: number): void => {
    if (!ANALYTICS_CONFIG.enabled || !hasGtag()) return;

    window.gtag!('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });

    if (ANALYTICS_CONFIG.debugMode) {
      console.log('Analytics: Event', { action, category, label, value });
    }
  },

  // Track user interactions
  interaction: (element: string, action: string) => {
    analytics.event(action, 'User Interaction', element);
  },

  // Track form submissions
  formSubmit: (formName: string, success: boolean = true) => {
    analytics.event('form_submit', 'Form', formName, success ? 1 : 0);
  },

  // Track button clicks
  buttonClick: (buttonName: string, location: string) => {
    analytics.event('click', 'Button', `${location}: ${buttonName}`);
  },

  // Track downloads
  download: (filename: string, category: string = 'Download') => {
    analytics.event('download', category, filename);
  },

  // Track external link clicks
  externalLink: (url: string, linkText?: string) => {
    analytics.event('click', 'External Link', linkText || url);
  },

  // Track scroll depth
  scrollDepth: (percentage: number) => {
    analytics.event('scroll', 'Scroll Depth', `${percentage}%`, percentage);
  },

  // Track time on page
  timeOnPage: (seconds: number, page: string) => {
    analytics.event('timing_complete', 'Time on Page', page, seconds);
  },

  // Track errors
  error: (error: string, fatal: boolean = false) => {
    analytics.event('exception', 'Error', error, fatal ? 1 : 0);
  },

  // Track performance metrics
  performance: (metric: string, value: number, unit: string = 'ms') => {
    analytics.event('timing_complete', 'Performance', `${metric} (${unit})`, value);
  }
};

// Hook for page view tracking
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    analytics.pageView(location.pathname + location.search);
  }, [location]);
};

// Hook for scroll depth tracking
export const useScrollTracking = () => {
  useEffect(() => {
    let maxScroll = 0;
    const thresholds = [25, 50, 75, 90, 100];
    const tracked = new Set<number>();

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;

        // Track threshold milestones
        thresholds.forEach(threshold => {
          if (scrollPercent >= threshold && !tracked.has(threshold)) {
            tracked.add(threshold);
            analytics.scrollDepth(threshold);
          }
        });
      }
    };

    const throttledHandleScroll = throttle(handleScroll, 1000);
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, []);
};

// Hook for time on page tracking
export const useTimeTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const endTime = Date.now();
      const timeSpent = Math.round((endTime - startTime) / 1000);
      
      if (timeSpent > 10) { // Only track if user spent more than 10 seconds
        analytics.timeOnPage(timeSpent, location.pathname);
      }
    };
  }, [location.pathname]);
};

// Hook for performance tracking
export const usePerformanceTracking = () => {
  useEffect(() => {
    // Track Core Web Vitals if available
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            analytics.performance('DOM Content Loaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart);
            analytics.performance('Load Complete', navEntry.loadEventEnd - navEntry.loadEventStart);
          }
        }
      });

      observer.observe({ entryTypes: ['navigation'] });

      return () => observer.disconnect();
    }
  }, []);
};

// Main analytics hook
export const useAnalytics = () => {
  useEffect(() => {
    // Initialize analytics services
    initializeGA();
    initializeGTM();

    // Track initial page load
    analytics.pageView(window.location.pathname + window.location.search);
  }, []);

  // Use all tracking hooks
  usePageTracking();
  useScrollTracking();
  useTimeTracking();
  usePerformanceTracking();

  return analytics;
};

// Utility function for throttling
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  } as T;
}

// Export configuration for external use
export { ANALYTICS_CONFIG };