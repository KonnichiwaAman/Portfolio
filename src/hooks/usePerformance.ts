import { useEffect, useCallback, useRef } from 'react';
import * as Sentry from '@sentry/react';

// Performance thresholds (Core Web Vitals)
const PERFORMANCE_THRESHOLDS = {
  FCP: 1800,  // First Contentful Paint
  LCP: 2500,  // Largest Contentful Paint
  FID: 100,   // First Input Delay
  CLS: 0.1,   // Cumulative Layout Shift
  TTFB: 800,  // Time to First Byte
  INP: 200,   // Interaction to Next Paint
} as const;

const RESOURCE_SIZE_THRESHOLD = 500000; // 500KB
const LONG_TASK_THRESHOLD = 50; // 50ms

const isProduction = () => process.env.NODE_ENV === 'production';

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  const checkPerformanceThreshold = useCallback((metric: string, value: number): boolean => {
    const threshold = PERFORMANCE_THRESHOLDS[metric as keyof typeof PERFORMANCE_THRESHOLDS];
    return threshold ? value > threshold : false;
  }, []);

  const reportToSentry = useCallback((metric: { name: string; value: number }) => {
    if (isProduction()) {
      Sentry.metrics.distribution(metric.name, metric.value, {
        unit: 'millisecond',
        tags: { 
          vitalsMetric: metric.name,
          exceedsThreshold: checkPerformanceThreshold(metric.name, metric.value).toString(),
        },
      });
    }
  }, [checkPerformanceThreshold]);

  useEffect(() => {
    if (!isProduction()) return;

    // Web Vitals monitoring
    const reportWebVitals = (metric: any) => {
      // Send to Sentry
      reportToSentry(metric);
      
      // Send to analytics service
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_label: metric.id,
          non_interaction: true,
        });
      }

      // Log critical metrics
      if (checkPerformanceThreshold(metric.name, metric.value)) {
        console.warn(`Performance issue detected: ${metric.name}`, {
          value: metric.value,
          threshold: PERFORMANCE_THRESHOLDS[metric.name as keyof typeof PERFORMANCE_THRESHOLDS],
          url: window.location.href,
          rating: metric.rating,
        });
        
        // Capture as Sentry issue for severe cases
        if (metric.rating === 'poor') {
          Sentry.captureMessage(`Poor ${metric.name} performance: ${metric.value}`, {
            level: 'warning',
            tags: { metric: metric.name },
          });
        }
      }
    };

    // Basic performance monitoring without web-vitals
    const measurePerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const metrics = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: 0,
          firstContentfulPaint: 0
        };

        // Get paint metrics if available
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach(entry => {
          if (entry.name === 'first-paint') {
            metrics.firstPaint = entry.startTime;
          } else if (entry.name === 'first-contentful-paint') {
            metrics.firstContentfulPaint = entry.startTime;
          }
        });

        // Log performance metrics
        console.log('Performance Metrics:', metrics);

        // Check for performance issues
        if (metrics.firstContentfulPaint > 1800) {
          console.warn('Slow First Contentful Paint:', metrics.firstContentfulPaint + 'ms');
        }
        if (metrics.domContentLoaded > 1500) {
          console.warn('Slow DOM Content Loaded:', metrics.domContentLoaded + 'ms');
        }
      }
    };

    // Measure performance after load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > LONG_TASK_THRESHOLD) {
            console.warn('Long task detected:', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name
            });
            
            // Report severe long tasks to Sentry
            if (entry.duration > 200) {
              Sentry.captureMessage('Severe long task detected', {
                level: 'warning',
                extra: {
                  duration: entry.duration,
                  startTime: entry.startTime,
                  name: entry.name,
                },
              });
            }
          }
        }
      });

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Ignore if longtask is not supported
      }

      return () => {
        longTaskObserver.disconnect();
      };
    }
  }, [checkPerformanceThreshold, reportToSentry]);
};

// Resource loading monitor
export const useResourceMonitoring = () => {
  useEffect(() => {
    if (!isProduction()) return;

    const monitorResources = () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      let slowResources = 0;
      let largeResources = 0;
      
      resources.forEach(resource => {
        // Check for slow loading resources
        if (resource.duration > 3000) {
          slowResources++;
          console.warn('Slow resource detected:', {
            name: resource.name,
            duration: resource.duration,
            size: resource.transferSize,
            type: resource.initiatorType
          });
        }
        
        // Check for large resources
        if (resource.transferSize > RESOURCE_SIZE_THRESHOLD) {
          largeResources++;
          console.warn('Large resource detected:', {
            name: resource.name,
            size: `${(resource.transferSize / 1024).toFixed(2)}KB`,
            type: resource.initiatorType,
          });
        }

        // Check for failed resources
        if (resource.transferSize === 0 && resource.duration > 0) {
          console.error('Failed resource:', {
            name: resource.name,
            duration: resource.duration
          });
          
          Sentry.captureMessage('Resource load failed', {
            level: 'error',
            extra: { resourceName: resource.name },
          });
        }
      });
      
      // Report aggregate metrics
      if (slowResources > 0 || largeResources > 0) {
        Sentry.captureMessage('Resource performance issues detected', {
          level: 'warning',
          extra: {
            slowResources,
            largeResources,
            totalResources: resources.length,
          },
        });
      }
    };

    // Monitor resources after page load
    window.addEventListener('load', () => {
      setTimeout(monitorResources, 1000);
    });
  }, []);
};

// Bundle size analyzer
export const analyzeBundleSize = () => {
  if (!isProduction()) return;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  const totalScripts = scripts.length;
  const totalStylesheets = stylesheets.length;
  
  console.log('Bundle Analysis:', {
    scripts: totalScripts,
    stylesheets: totalStylesheets,
    total: totalScripts + totalStylesheets
  });
  
  // Check for duplicate resources
  const scriptSrcs = scripts.map(s => (s as HTMLScriptElement).src);
  const duplicateScripts = scriptSrcs.filter((src, index) => scriptSrcs.indexOf(src) !== index);
  
  if (duplicateScripts.length > 0) {
    console.warn('Duplicate scripts detected:', duplicateScripts);
  }
};

// Memory usage monitor
export const useMemoryMonitoring = () => {
  useEffect(() => {
    if (!isProduction()) return;
    if (!(performance as any).memory) return;

    const checkMemoryUsage = () => {
      const memory = (performance as any).memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
      const limitMB = Math.round(memory.jsHeapSizeLimit / 1048576);
      const usagePercent = (usedMB / limitMB) * 100;

      if (usagePercent > 70) {
        console.warn('High memory usage detected:', {
          used: `${usedMB}MB`,
          limit: `${limitMB}MB`,
          percentage: `${usagePercent.toFixed(1)}%`
        });
      }
    };

    const interval = setInterval(checkMemoryUsage, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);
};