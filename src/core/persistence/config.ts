export type PersistenceMode = 'local' | 'firebase';

function getDefaultPersistenceMode(): PersistenceMode {
  return isFirebasePersistenceConfigured() ? 'firebase' : 'local';
}
const PERSISTENCE_MODE_STORAGE_KEY = 'nexus-crm-persistence-mode';

function isPersistenceMode(value: string | undefined): value is PersistenceMode {
  return value === 'local' || value === 'firebase';
}

export function getPersistenceMode(): PersistenceMode {
  if (typeof window !== 'undefined') {
    const storedMode = window.localStorage.getItem(PERSISTENCE_MODE_STORAGE_KEY) ?? undefined;

    if (isPersistenceMode(storedMode)) {
      return storedMode;
    }
  }

  const mode = import.meta.env.VITE_PERSISTENCE_MODE;

  return isPersistenceMode(mode) ? mode : getDefaultPersistenceMode();
}

export function setPersistenceMode(mode: PersistenceMode) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(PERSISTENCE_MODE_STORAGE_KEY, mode);
}

export function clearPersistenceMode() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(PERSISTENCE_MODE_STORAGE_KEY);
}

export function isFirebasePersistenceConfigured() {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY
    && import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
    && import.meta.env.VITE_FIREBASE_PROJECT_ID
    && import.meta.env.VITE_FIREBASE_APP_ID,
  );
}

export { PERSISTENCE_MODE_STORAGE_KEY };
