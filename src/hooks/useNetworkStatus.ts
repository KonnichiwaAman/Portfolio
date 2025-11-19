import { useEffect, useState, useCallback } from 'react';

/**
 * Hook to detect online/offline status
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

/**
 * Hook for retry logic with exponential backoff
 */
interface UseRetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  onRetry?: (attempt: number) => void;
  onMaxRetriesReached?: () => void;
}

export const useRetry = (options: UseRetryOptions = {}) => {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    onRetry,
    onMaxRetriesReached,
  } = options;

  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T | null> => {
      setIsRetrying(true);
      const delay = Math.min(initialDelay * Math.pow(2, retryCount), maxDelay);

      await new Promise(resolve => setTimeout(resolve, delay));

      try {
        const result = await fn();
        setRetryCount(0);
        setIsRetrying(false);
        return result;
      } catch (error) {
        const newRetryCount = retryCount + 1;
        setRetryCount(newRetryCount);
        setIsRetrying(false);

        if (newRetryCount >= maxRetries) {
          onMaxRetriesReached?.();
          throw error;
        }

        onRetry?.(newRetryCount);
        return retry(fn);
      }
    },
    [retryCount, initialDelay, maxDelay, maxRetries, onRetry, onMaxRetriesReached]
  );

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return { retry, retryCount, isRetrying, reset };
};

/**
 * Hook for network request with automatic retry
 */
interface UseFetchWithRetryOptions extends UseRetryOptions {
  enabled?: boolean;
}

export const useFetchWithRetry = <T,>(
  url: string,
  options: RequestInit = {},
  retryOptions: UseFetchWithRetryOptions = {}
) => {
  const { enabled = true, ...retryOpts } = retryOptions;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const { retry, retryCount, isRetrying } = useRetry(retryOpts);
  const isOnline = useOnlineStatus();

  const fetchData = useCallback(async () => {
    if (!enabled || !isOnline) return;

    setLoading(true);
    setError(null);

    try {
      const result = await retry(async () => {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      });

      if (result) {
        setData(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [url, options, enabled, isOnline, retry]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading, retryCount, isRetrying, refetch: fetchData };
};

/**
 * Hook for timeout with cleanup
 */
export const useTimeout = (callback: () => void, delay: number | null) => {
  useEffect(() => {
    if (delay === null) return;

    const timeoutId = setTimeout(callback, delay);
    return () => clearTimeout(timeoutId);
  }, [callback, delay]);
};

/**
 * Hook for debounced value
 */
export const useDebounce = <T,>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for idle detection
 */
export const useIdle = (timeout: number = 5 * 60 * 1000) => {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      setIsIdle(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsIdle(true), timeout);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    resetTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
      clearTimeout(timeoutId);
    };
  }, [timeout]);

  return isIdle;
};
