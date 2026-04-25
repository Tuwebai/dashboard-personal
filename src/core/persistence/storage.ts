import { createJSONStorage, type PersistStorage } from 'zustand/middleware';
import type { PersistedWorkspaceSnapshot } from './workspace';

export type PersistedAppStore = PersistedWorkspaceSnapshot;

const STORE_STORAGE_KEY = 'nexus-crm-store';

export function createAppPersistenceStorage(): PersistStorage<PersistedAppStore> | undefined {
  return createJSONStorage<PersistedAppStore>(() => localStorage);
}

export { STORE_STORAGE_KEY };
