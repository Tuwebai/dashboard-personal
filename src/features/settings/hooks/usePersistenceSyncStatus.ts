import { useEffect, useState } from 'react';
import { getPersistenceMode } from '../../../core/persistence/config';
import { getLastSyncAt } from '../../../core/persistence/sync';

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

interface PersistenceSyncDetail {
  status: SyncStatus;
  updatedAt?: string;
}

const SYNC_EVENT_NAME = 'nexus-crm:persistence-sync';

export function usePersistenceSyncStatus() {
  const [status, setStatus] = useState<SyncStatus>(
    getPersistenceMode() === 'firebase' ? 'idle' : 'synced',
  );
  const [updatedAt, setUpdatedAt] = useState(getLastSyncAt());

  useEffect(() => {
    const handleStatusChange = (event: Event) => {
      const detail = (event as CustomEvent<PersistenceSyncDetail>).detail;

      if (!detail) {
        return;
      }

      setStatus(detail.status);

      if (detail.updatedAt) {
        setUpdatedAt(detail.updatedAt);
      }
    };

    window.addEventListener(SYNC_EVENT_NAME, handleStatusChange);

    return () => window.removeEventListener(SYNC_EVENT_NAME, handleStatusChange);
  }, []);

  return {
    status,
    updatedAt,
  };
}
