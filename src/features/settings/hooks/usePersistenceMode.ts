import {
  clearPersistenceMode,
  getPersistenceMode,
  isFirebasePersistenceConfigured,
  setPersistenceMode,
  type PersistenceMode,
} from '../../../core/persistence/config';
import { toast } from 'sonner';
import { useI18n } from '../../../shared/i18n/useI18n';

export function usePersistenceMode() {
  const { t } = useI18n();
  const currentMode = getPersistenceMode();
  const firebaseReady = isFirebasePersistenceConfigured();

  const changePersistenceMode = (mode: PersistenceMode) => {
    if (mode === 'firebase' && !firebaseReady) {
      toast.error(t('settings.persistenceFirebaseDisabled'));
      return;
    }

    if (mode === currentMode) {
      return;
    }

    if (mode === 'local') {
      clearPersistenceMode();
    } else {
      setPersistenceMode(mode);
    }

    toast.success(
      mode === 'firebase'
        ? t('settings.persistenceFirebaseEnabled')
        : t('settings.persistenceLocalEnabled'),
    );

    window.setTimeout(() => {
      window.location.reload();
    }, 700);
  };

  return {
    currentMode,
    firebaseReady,
    changePersistenceMode,
  };
}
