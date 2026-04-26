import type { PersistenceSyncStatus } from '../../../core/persistence/syncMetadata';
import type { PersistenceMode } from '../../../core/persistence/config';

interface SyncStatusLabelParams {
  mode: PersistenceMode;
  status: PersistenceSyncStatus;
  updatedAt?: string;
  formattedUpdatedAt: string;
  t: (key: string) => string;
}

export function getSyncStatusLabel({
  mode,
  status,
  updatedAt,
  formattedUpdatedAt,
  t,
}: SyncStatusLabelParams) {
  if (mode !== 'firebase') {
    return t('settings.syncLocal');
  }

  switch (status) {
    case 'auth-resolving':
      return t('settings.syncAuthResolving');
    case 'hydrating':
      return t('settings.syncHydrating');
    case 'syncing':
      return t('settings.syncing');
    case 'offline-readonly':
      return t('settings.syncOfflineReadonly');
    case 'error':
      return t('settings.syncError');
    case 'ready':
    case 'synced':
      return updatedAt
        ? t('settings.syncedAt').replace('{time}', formattedUpdatedAt)
        : t('settings.syncWaiting');
    default:
      return updatedAt
        ? t('settings.syncedAt').replace('{time}', formattedUpdatedAt)
        : t('settings.syncWaiting');
  }
}

export function shouldShowLastConfirmedCopy(
  mode: PersistenceMode,
  status: PersistenceSyncStatus,
  updatedAt?: string,
) {
  return mode === 'firebase' && Boolean(updatedAt) && (status === 'offline-readonly' || status === 'error');
}
