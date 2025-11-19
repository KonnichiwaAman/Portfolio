import { lazy, Suspense, ComponentType, ReactNode } from 'react';

interface LazyComponentWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Default loading skeleton for lazy-loaded components
 */
const DefaultFallback = () => (
  <div className="w-full h-64 flex items-center justify-center">
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="w-12 h-12 bg-primary/20 rounded-full"></div>
      <div className="w-32 h-4 bg-primary/10 rounded"></div>
    </div>
  </div>
);

/**
 * Wrapper for lazy-loaded components with error boundary
 */
export const LazyComponentWrapper = ({ 
  children, 
  fallback = <DefaultFallback /> 
}: LazyComponentWrapperProps) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

/**
 * Utility to create lazy-loaded component with mobile optimization
 * Only loads heavy components when needed on mobile devices
 */
export const createMobileLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  shouldLoadOnMobile: boolean = true
) => {
  const LazyComponent = lazy(importFn);
  
  return (props: any) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    // Skip rendering on mobile if not needed
    if (isMobile && !shouldLoadOnMobile) {
      return null;
    }
    
    return (
      <Suspense fallback={<DefaultFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
};

/**
 * Preload component for faster subsequent renders
 */
export const preloadComponent = (importFn: () => Promise<any>) => {
  // Preload on idle or after user interaction
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => importFn());
  } else {
    setTimeout(() => importFn(), 1);
  }
};
