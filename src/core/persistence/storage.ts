import type { PersistStorage, StorageValue } from 'zustand/middleware';
import type { PersistedWorkspaceSnapshot } from './workspace';
import { getPersistenceMode } from './config';

export type PersistedAppStore = PersistedWorkspaceSnapshot;

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

export { STORE_STORAGE_KEY };
