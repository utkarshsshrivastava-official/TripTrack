import { useState, useEffect, useCallback } from 'react';
import { localDB, flushQueuedPings } from '../db/dexie';

export interface NetworkStatus {
  isOnline: boolean;
  queuedCount: number;
  lastOnlineAt: Date | null;
  isSyncing: boolean;
  triggerSync: () => Promise<void>;
}

export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [queuedCount, setQueuedCount] = useState<number>(0);
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(
    typeof navigator !== 'undefined' && navigator.onLine ? new Date() : null
  );
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Refresh queued pings count
  const refreshQueueCount = useCallback(async () => {
    try {
      const count = await localDB.queuedPings.count();
      setQueuedCount(count);
    } catch {
      // IndexedDB may be inaccessible in certain edge environments
    }
  }, []);

  // Synchronize queued pings
  const triggerSync = useCallback(async () => {
    if (!navigator.onLine || isSyncing) return;
    setIsSyncing(true);
    try {
      await flushQueuedPings();
      await refreshQueueCount();
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, refreshQueueCount]);

  useEffect(() => {
    refreshQueueCount();

    const handleOnline = () => {
      setIsOnline(true);
      setLastOnlineAt(new Date());
      triggerSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic check for local queue size
    const interval = setInterval(refreshQueueCount, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [refreshQueueCount, triggerSync]);

  return {
    isOnline,
    queuedCount,
    lastOnlineAt,
    isSyncing,
    triggerSync
  };
}
