import type { PersistStorage, StorageValue } from 'zustand/middleware';
import type { PersistedWorkspaceSnapshot } from './workspace';
import { getPersistenceMode } from './config';

export type PersistedAppStore = PersistedWorkspaceSnapshot;

export const LOCAL_WORKSPACE_STORAGE_VERSION = 8;
const STORE_STORAGE_KEY = 'nexus-crm-store';

export function createAppPersistenceStorage(): PersistStorage<PersistedAppStore> | undefined {
  return {
    getItem: (name) => {
      if (typeof window === 'undefined' || getPersistenceMode() !== 'local') {
        return null;
      }

      const value = window.localStorage.getItem(name);
      return value ? (JSON.parse(value) as StorageValue<PersistedAppStore>) : null;
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

export { STORE_STORAGE_KEY };
