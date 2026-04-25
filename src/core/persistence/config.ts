export type PersistenceMode = 'local' | 'firebase';
const PERSISTENCE_MODE_EVENT_NAME = 'nexus-crm:persistence-mode-change';

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
  window.dispatchEvent(new CustomEvent(PERSISTENCE_MODE_EVENT_NAME, { detail: mode }));
}

export function clearPersistenceMode() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(PERSISTENCE_MODE_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(PERSISTENCE_MODE_EVENT_NAME, { detail: getDefaultPersistenceMode() }));
}

export function isFirebasePersistenceConfigured() {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY
    && import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
    && import.meta.env.VITE_FIREBASE_PROJECT_ID
    && import.meta.env.VITE_FIREBASE_APP_ID,
  );
}

export function subscribePersistenceModeChange(onChange: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleChange = () => onChange();
  window.addEventListener(PERSISTENCE_MODE_EVENT_NAME, handleChange);
  return () => window.removeEventListener(PERSISTENCE_MODE_EVENT_NAME, handleChange);
}

export { PERSISTENCE_MODE_STORAGE_KEY };
