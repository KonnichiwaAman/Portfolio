import { memo, useEffect, useState } from 'react';
import { useOnlineStatus } from '@/hooks/useNetworkStatus';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator = memo(() => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div 
      className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-destructive/90 text-destructive-foreground p-4 rounded-lg shadow-lg z-50 backdrop-blur-sm animate-slide-in-up"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center gap-3">
        <WifiOff className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <p className="font-semibold">You're offline</p>
          <p className="text-sm opacity-90">
            Please check your internet connection. Some features may not be available.
          </p>
        </div>
      </div>
    </div>
  );
});

OfflineIndicator.displayName = 'OfflineIndicator';

export const OnlineIndicator = memo(() => {
  const isOnline = useOnlineStatus();
  const [showNotification, setShowNotification] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (!showNotification) return null;

  return (
    <div 
      className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-green-500/90 text-white p-4 rounded-lg shadow-lg z-50 backdrop-blur-sm animate-slide-in-up"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <Wifi className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <p className="font-semibold">You're back online!</p>
          <p className="text-sm opacity-90">
            Your connection has been restored.
          </p>
        </div>
      </div>
    </div>
  );
});

OnlineIndicator.displayName = 'OnlineIndicator';

// Combined network status component
export const NetworkStatus = memo(() => (
  <>
    <OfflineIndicator />
    <OnlineIndicator />
  </>
));

NetworkStatus.displayName = 'NetworkStatus';
