import { useEffect, useState } from 'react';
import { getPersistenceMode } from '../../../core/persistence/config';
import { useAppStore } from '../../../stores/useAppStore';
import { getLastSyncAt, type PersistenceSyncStatus } from '../../../core/persistence/syncMetadata';

interface PersistenceSyncDetail {
  status: PersistenceSyncStatus;
  updatedAt?: string;
}

const SYNC_EVENT_NAME = 'nexus-crm:persistence-sync';

export function usePersistenceSyncStatus() {
  const firebaseUid = useAppStore((state) => state.firebaseUid);
  const [status, setStatus] = useState<PersistenceSyncStatus>(
    getPersistenceMode() === 'firebase' ? 'idle' : 'synced',
  );
  const [updatedAt, setUpdatedAt] = useState(getLastSyncAt(firebaseUid ?? ''));

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
