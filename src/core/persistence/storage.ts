import type { PersistStorage, StorageValue } from 'zustand/middleware';
import type { PersistedWorkspaceSnapshot } from './workspace';
import { getPersistenceMode } from './config';

export type PersistedAppStore = PersistedWorkspaceSnapshot;

export const LOCAL_WORKSPACE_STORAGE_VERSION = 9;
const STORE_STORAGE_KEY = 'nexus-crm-store';

function parseStoredWorkspaceValue(value: string | null): StorageValue<PersistedAppStore> | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as StorageValue<PersistedAppStore>;
  } catch {
    return null;
  }
}

export function createAppPersistenceStorage(): PersistStorage<PersistedAppStore> | undefined {
  return {
    getItem: (name) => {
      if (typeof window === 'undefined' || getPersistenceMode() !== 'local') {
        return null;
      }

      return parseStoredWorkspaceValue(window.localStorage.getItem(name));
    },
    setItem: (name, value) => {
      if (typeof window === 'undefined' || getPersistenceMode() !== 'local') {
        return;
      }

      window.localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name) => {
      if (typeof window === 'undefined') {
        return;
      }

      window.localStorage.removeItem(name);
    },
  };
}

export function writeLocalWorkspaceSnapshot(snapshot: PersistedAppStore) {
  if (typeof window === 'undefined') {
    return;
  }

  const payload: StorageValue<PersistedAppStore> = {
    state: snapshot,
    version: LOCAL_WORKSPACE_STORAGE_VERSION,
  };

  window.localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(payload));
}

export function clearLocalWorkspaceSnapshot() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORE_STORAGE_KEY);
}

export function readLocalWorkspaceSnapshot() {
  if (typeof window === 'undefined') {
    return null;
  }

  return parseStoredWorkspaceValue(window.localStorage.getItem(STORE_STORAGE_KEY))?.state ?? null;
}

export function subscribeLocalWorkspaceStorageChange(onChange: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORE_STORAGE_KEY) {
      onChange();
    }
  };

  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
}

export { STORE_STORAGE_KEY };
