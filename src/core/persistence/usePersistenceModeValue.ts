import { useSyncExternalStore } from 'react';
import { getPersistenceMode, subscribePersistenceModeChange } from './config';

export function usePersistenceModeValue() {
  return useSyncExternalStore(subscribePersistenceModeChange, getPersistenceMode, getPersistenceMode);
}
