import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import * as Sentry from "@sentry/react";
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from "@/components/theme-provider"

// Configuration
const IS_PRODUCTION = import.meta.env.PROD;
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const SENTRY_ENABLED = IS_PRODUCTION && SENTRY_DSN;

// Sentry configuration
const SENTRY_CONFIG = {
  dsn: SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
} as const;

// Initialize Sentry for production error tracking
if (SENTRY_ENABLED) {
  Sentry.init(SENTRY_CONFIG);
}

// Performance monitoring
const reportWebVitals = (metric: { name: string; value: number }) => {
  // Send to Sentry if initialized
  if (SENTRY_ENABLED) {
    Sentry.metrics.distribution(metric.name, metric.value, {
      unit: 'millisecond',
      tags: { vitalsMetric: metric.name },
    });
  }

  // Log in development
  if (!IS_PRODUCTION) {
    const metricLabels: Record<string, string> = {
      FCP: 'First Contentful Paint',
      LCP: 'Largest Contentful Paint',
      FID: 'First Input Delay',
      CLS: 'Cumulative Layout Shift',
    };
    
    const label = metricLabels[metric.name];
    if (label) {
      console.log(`${label}:`, metric.value);
    }
  }
};

// Report Web Vitals in production
if (IS_PRODUCTION) {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP }) => {
    getCLS(reportWebVitals);
    getFID(reportWebVitals);
    getFCP(reportWebVitals);
    getLCP(reportWebVitals);
  });
}

// Render the app
ReactDOM.createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <React.StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme-v2">
        <App />
      </ThemeProvider>
    </React.StrictMode>
  </HelmetProvider>
);

// Remove initial loading spinner with fade effect
const removeInitialLoader = () => {
  const loader = document.getElementById('initial-loader');
  if (!loader) return;
  
  loader.style.opacity = '0';
  loader.style.transition = 'opacity 0.3s ease-out';
  setTimeout(() => loader.remove(), 300);
};

setTimeout(removeInitialLoader, 100);
