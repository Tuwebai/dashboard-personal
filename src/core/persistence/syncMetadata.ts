import { useAppStore } from '../../stores/useAppStore';

const LAST_SYNC_AT_STORAGE_KEY_PREFIX = 'nexus-crm-last-sync-at';
const SYNC_EVENT_NAME = 'nexus-crm:persistence-sync';

export type PersistenceSyncStatus =
  | 'idle'
  | 'auth-resolving'
  | 'hydrating'
  | 'ready'
  | 'syncing'
  | 'synced'
  | 'offline-readonly'
  | 'error';

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
  const existingNotification = store.notifications.find(
    (notification) =>
      notification.type === 'system' &&
      notification.title === 'Sync remoto' &&
      notification.message === 'Falló la última sincronización remota. Se mantiene la última copia confirmada.',
  );

  if (existingNotification) {
    useAppStore.setState((currentState) => ({
      notifications: currentState.notifications.map((notification) =>
        notification.id === existingNotification.id
          ? {
              ...notification,
              isRead: false,
              createdAt: now,
            }
          : notification,
      ),
    }));
    return;
  }

  useAppStore.setState((currentState) => ({
    notifications: [
      {
        id: `sync-error-${Date.now()}`,
        type: 'system',
        title: 'Sync remoto',
        message: 'Falló la última sincronización remota. Se mantiene la última copia confirmada.',
        isRead: false,
        createdAt: now,
      },
      ...currentState.notifications,
    ],
  }));
}
