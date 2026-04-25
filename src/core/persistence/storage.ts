import { createJSONStorage, type PersistStorage } from 'zustand/middleware';
import type { AppStore } from '../../stores/types';
import { getPersistenceMode, isFirebasePersistenceConfigured } from './config';

export type PersistedAppStore = Partial<AppStore>;

const STORE_STORAGE_KEY = 'nexus-crm-store';

function createLocalStorage() {
  return createJSONStorage<PersistedAppStore>(() => localStorage);
}

export function createAppPersistenceStorage(): PersistStorage<PersistedAppStore> | undefined {
  const mode = getPersistenceMode();

  if (mode === 'firebase' && isFirebasePersistenceConfigured()) {
    return createLocalStorage();
  }

  return createLocalStorage();
}

export { STORE_STORAGE_KEY };
