import {
  clearPersistenceMode,
  getPersistenceMode,
  isFirebasePersistenceConfigured,
  setPersistenceMode,
  type PersistenceMode,
} from '../../../core/persistence/config';

export function usePersistenceMode() {
  const currentMode = getPersistenceMode();
  const firebaseReady = isFirebasePersistenceConfigured();

  const changePersistenceMode = (mode: PersistenceMode) => {
    if (mode === 'firebase' && !firebaseReady) {
      return;
    }

    if (mode === 'local') {
      clearPersistenceMode();
    } else {
      setPersistenceMode(mode);
    }

    window.location.reload();
  };

  return {
    currentMode,
    firebaseReady,
    changePersistenceMode,
  };
}
