import { useAppStore } from '../../stores/useAppStore';

const LAST_SYNC_AT_STORAGE_KEY_PREFIX = 'nexus-crm-last-sync-at';
const SYNC_EVENT_NAME = 'nexus-crm:persistence-sync';

export type PersistenceSyncStatus = 'idle' | 'hydrating' | 'syncing' | 'synced' | 'error';

function getLastSyncAtStorageKey(uid?: string | null) {
  return uid ? `${LAST_SYNC_AT_STORAGE_KEY_PREFIX}:${uid}` : LAST_SYNC_AT_STORAGE_KEY_PREFIX;
}

export function getLastSyncAt(uid = '') {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(getLastSyncAtStorageKey(uid)) ?? '';
}

export function setLastSyncAt(uid: string, value: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(getLastSyncAtStorageKey(uid), value);
}

export function clearLastSyncAt(uid?: string | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (uid) {
    window.localStorage.removeItem(getLastSyncAtStorageKey(uid));
    return;
  }

  window.localStorage.removeItem(getLastSyncAtStorageKey());
}

export function dispatchSyncStatus(status: PersistenceSyncStatus, updatedAt?: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail: { status, updatedAt } }));
}

export function pushSyncErrorNotification() {
  const store = useAppStore.getState();
  const now = new Date().toISOString();
  const alreadyExists = store.notifications.some(
    (notification) =>
      notification.type === 'system' &&
      notification.title === 'Sincronización Firebase' &&
      !notification.isRead,
  );

  if (alreadyExists) {
    return;
  }

  useAppStore.setState((currentState) => ({
    notifications: [
      {
        id: `sync-error-${Date.now()}`,
        type: 'system',
        title: 'Sincronización Firebase',
        message: 'Falló la última sincronización remota. La app sigue usando la copia local.',
        isRead: false,
        createdAt: now,
      },
      ...currentState.notifications,
    ],
  }));
}
