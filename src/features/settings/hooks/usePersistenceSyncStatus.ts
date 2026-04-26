import { useEffect, useState } from 'react';
import { getPersistenceMode } from '../../../core/persistence/config';
import { useAppStore } from '../../../stores/useAppStore';
import {
  getLastSyncAt,
  getLastSyncError,
  type PersistenceSyncDetail,
  type PersistenceSyncStatus,
} from '../../../core/persistence/syncMetadata';

const SYNC_EVENT_NAME = 'nexus-crm:persistence-sync';

export function usePersistenceSyncStatus() {
  const firebaseUid = useAppStore((state) => state.firebaseUid);
  const [status, setStatus] = useState<PersistenceSyncStatus>(
    getPersistenceMode() === 'firebase' ? 'idle' : 'synced',
  );
  const [syncState, setSyncState] = useState(() => ({
    uid: firebaseUid,
    updatedAt: getLastSyncAt(firebaseUid ?? ''),
    error: getLastSyncError(firebaseUid ?? ''),
  }));

  useEffect(() => {
    const handleStatusChange = (event: Event) => {
      const detail = (event as CustomEvent<PersistenceSyncDetail>).detail;

      if (!detail) {
        return;
      }

      setStatus(detail.status);

      setSyncState((current) => ({
        uid: firebaseUid,
        updatedAt: detail.updatedAt ?? current.updatedAt,
        error: detail.error ?? (detail.status === 'error' || detail.status === 'offline-readonly' ? current.error : null),
      }));
    };

    window.addEventListener(SYNC_EVENT_NAME, handleStatusChange);

    return () => window.removeEventListener(SYNC_EVENT_NAME, handleStatusChange);
  }, [firebaseUid]);

  const updatedAt = syncState.uid === firebaseUid
    ? syncState.updatedAt
    : getLastSyncAt(firebaseUid ?? '');
  const error = syncState.uid === firebaseUid
    ? syncState.error
    : getLastSyncError(firebaseUid ?? '');

  return {
    status,
    updatedAt,
    errorMessageKey: error?.messageKey,
    errorInfo: error,
  };
}
