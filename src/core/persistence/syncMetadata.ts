import { useAppStore } from '../../stores/useAppStore';
import type { Lang } from '../../shared/i18n/translations/types';
import {
  getLocalizedSyncNotification,
  type PersistenceSyncErrorInfo,
} from './syncErrors';

const LAST_SYNC_AT_STORAGE_KEY_PREFIX = 'nexus-crm-last-sync-at';
const LAST_SYNC_ERROR_STORAGE_KEY_PREFIX = 'nexus-crm-last-sync-error';
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

export interface PersistenceSyncDetail {
  status: PersistenceSyncStatus;
  updatedAt?: string;
  error?: PersistenceSyncErrorInfo | null;
}

function getLastSyncAtStorageKey(uid?: string | null) {
  return uid ? `${LAST_SYNC_AT_STORAGE_KEY_PREFIX}:${uid}` : LAST_SYNC_AT_STORAGE_KEY_PREFIX;
}

function getLastSyncErrorStorageKey(uid?: string | null) {
  return uid ? `${LAST_SYNC_ERROR_STORAGE_KEY_PREFIX}:${uid}` : LAST_SYNC_ERROR_STORAGE_KEY_PREFIX;
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

export function getLastSyncError(uid = '') {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(getLastSyncErrorStorageKey(uid));
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as PersistenceSyncErrorInfo;
  } catch {
    return null;
  }
}

export function setLastSyncError(uid: string, error: PersistenceSyncErrorInfo) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(getLastSyncErrorStorageKey(uid), JSON.stringify(error));
}

export function clearLastSyncError(uid?: string | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (uid) {
    window.localStorage.removeItem(getLastSyncErrorStorageKey(uid));
    return;
  }

  window.localStorage.removeItem(getLastSyncErrorStorageKey());
}

export function dispatchSyncStatus(
  status: PersistenceSyncStatus,
  updatedAt?: string,
  error?: PersistenceSyncErrorInfo | null,
) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent<PersistenceSyncDetail>(SYNC_EVENT_NAME, { detail: { status, updatedAt, error } }));
}

export function pushSyncErrorNotification(error: PersistenceSyncErrorInfo) {
  const store = useAppStore.getState();
  const language = (store.settings.language ?? 'es') as Lang;
  const localizedNotification = getLocalizedSyncNotification(language, error);
  const now = new Date().toISOString();
  const existingNotification = store.systemNotifications.find(
    (notification) =>
      notification.type === 'system' &&
      notification.title === localizedNotification.title &&
      notification.message === localizedNotification.message,
  );

  if (existingNotification) {
    store.upsertSystemNotification({
      ...existingNotification,
      isRead: false,
      createdAt: now,
      delivery: {
        ...existingNotification.delivery,
        inApp: 'queued',
      },
      channels: existingNotification.channels,
      scope: 'system',
    });
    return;
  }

  store.upsertSystemNotification({
    id: `sync-error-${Date.now()}`,
    type: 'system',
    title: localizedNotification.title,
    message: localizedNotification.message,
    isRead: false,
    createdAt: now,
    channels: ['in_app'],
    delivery: {
      inApp: 'queued',
      push: 'disabled',
    },
    scope: 'system',
    isEphemeral: true,
  });
}
