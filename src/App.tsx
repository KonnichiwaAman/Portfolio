// Core React imports
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Third-party imports
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SkipToContent from "@/components/SkipToContent";

// Local components
import ErrorBoundary from './components/error-boundary';
import SEO from './components/SEO';
import BackToTop from './components/BackToTop';
import { PageLoadingFallback } from './components/ui/loading-states';
import { NetworkStatus } from './components/NetworkStatus';

// Hooks
import { useAnalytics } from './hooks/useAnalytics';
import { usePerformanceMonitoring, useResourceMonitoring, useMemoryMonitoring } from './hooks/usePerformance';

// Lazy loaded components
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Query client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
      retry: 2, // Retry failed requests
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

// Main App component with analytics and monitoring
const AppContent = () => {
  // Initialize analytics and monitoring
  useAnalytics();
  usePerformanceMonitoring();
  useResourceMonitoring();
  useMemoryMonitoring();

  return (
    <>
      <SEO />
      <Toaster />
      <NetworkStatus />
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <BackToTop />
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SkipToContent />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
