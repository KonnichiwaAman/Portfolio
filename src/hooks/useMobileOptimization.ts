import { useEffect, useState } from 'react';

interface MobileOptimizationConfig {
  isMobile: boolean;
  isTablet: boolean;
  isAndroid: boolean;
  isIOS: boolean;
  screenSize: {
    width: number;
    height: number;
  };
  orientation: 'portrait' | 'landscape';
  connection: {
    effectiveType: string;
    saveData: boolean;
  };
  prefersReducedMotion: boolean;
}

/**
 * Hook to detect mobile device and optimize performance accordingly
 */
export const useMobileOptimization = (): MobileOptimizationConfig => {
  const [config, setConfig] = useState<MobileOptimizationConfig>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isAndroid: false,
        isIOS: false,
        screenSize: { width: 0, height: 0 },
        orientation: 'portrait',
        connection: { effectiveType: '4g', saveData: false },
        prefersReducedMotion: false,
      };
    }

    const ua = navigator.userAgent;
    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      isMobile: /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || width < 768,
      isTablet: /iPad|Android/i.test(ua) && width >= 768 && width < 1024,
      isAndroid: /Android/i.test(ua),
      isIOS: /iPhone|iPad|iPod/i.test(ua),
      screenSize: { width, height },
      orientation: width > height ? 'landscape' : 'portrait',
      connection: {
        effectiveType: (navigator as any)?.connection?.effectiveType || '4g',
        saveData: (navigator as any)?.connection?.saveData || false,
      },
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    };
  });

  useEffect(() => {
    const updateConfig = () => {
      const ua = navigator.userAgent;
      const width = window.innerWidth;
      const height = window.innerHeight;

      setConfig({
        isMobile: /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || width < 768,
        isTablet: /iPad|Android/i.test(ua) && width >= 768 && width < 1024,
        isAndroid: /Android/i.test(ua),
        isIOS: /iPhone|iPad|iPod/i.test(ua),
        screenSize: { width, height },
        orientation: width > height ? 'landscape' : 'portrait',
        connection: {
          effectiveType: (navigator as any)?.connection?.effectiveType || '4g',
          saveData: (navigator as any)?.connection?.saveData || false,
        },
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      });
    };

    // Debounce resize events
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(updateConfig, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', updateConfig, { passive: true } as any);

    // Listen for connection changes
    const connection = (navigator as any)?.connection;
    if (connection) {
      connection.addEventListener('change', updateConfig);
    }

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', updateConfig);
      if (connection) {
        connection.removeEventListener('change', updateConfig);
      }
    };
  }, []);

  return config;
};

/**
 * Hook to determine if animations should be enabled based on device capabilities
 */
export const useShouldAnimate = (): boolean => {
  const { isMobile, prefersReducedMotion, connection } = useMobileOptimization();
  
  // Disable animations on slow connections or if user prefers reduced motion
  if (prefersReducedMotion || connection.saveData) {
    return false;
  }

  // Reduce animations on mobile with slow connections
  if (isMobile && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
    return false;
  }

  return true;
};
