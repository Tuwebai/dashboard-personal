import {
  clearPersistenceMode,
  isFirebasePersistenceConfigured,
  setPersistenceMode,
  type PersistenceMode,
} from '../../../core/persistence/config';
import { toast } from 'sonner';
import { useI18n } from '../../../shared/i18n/useI18n';
import { pickPersistedWorkspace } from '../../../core/persistence/workspace';
import { writeLocalWorkspaceSnapshot } from '../../../core/persistence/storage';
import { useAppStore } from '../../../stores/useAppStore';
import { usePersistenceModeValue } from '../../../core/persistence/usePersistenceModeValue';

export function usePersistenceMode() {
  const { t } = useI18n();
  const currentMode = usePersistenceModeValue();
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
      writeLocalWorkspaceSnapshot(pickPersistedWorkspace(useAppStore.getState()));
    } else {
      setPersistenceMode(mode);
    }

    toast.success(
      mode === 'firebase'
        ? t('settings.persistenceFirebaseEnabled')
        : t('settings.persistenceLocalEnabled'),
    );

  };

  return {
    currentMode,
    firebaseReady,
    changePersistenceMode,
  };
}
