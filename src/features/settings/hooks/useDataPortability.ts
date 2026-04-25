import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { useAppStore } from '../../../stores/useAppStore';
import { STORE_STORAGE_KEY } from '../../../core/persistence/storage';
import {
  mergePersistedWorkspace,
  pickPersistedWorkspace,
  sanitizeImportedSnapshot,
} from '../../../core/persistence/workspace';
import { useI18n } from '../../../shared/i18n/useI18n';
import { getPersistenceMode } from '../../../core/persistence/config';
import { writeWorkspaceRemote, wipeRemoteWorkspace } from '../../../core/persistence/remoteWorkspace';
import { clearWorkspaceCache, writeWorkspaceCache } from '../../../core/persistence/remoteCache';
import { setLastSyncAt } from '../../../core/persistence/syncMetadata';

const MAX_IMPORT_SIZE_BYTES = 5 * 1024 * 1024;

export function useDataPortability() {
  const { t } = useI18n();
  const store = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const exportData = () => {
    setIsExporting(true);
    try {
      const data = JSON.stringify(pickPersistedWorkspace(store), null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nexus-crm-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(t('settings.exportSuccess'));
    } catch {
      setImportStatus('error');
      toast.error(t('settings.exportError'));
    } finally {
      setIsExporting(false);
    }
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMPORT_SIZE_BYTES) {
      setImportStatus('error');
      toast.error(t('settings.importTooLarge'));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setIsImporting(true);
    setImportStatus('idle');

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const raw = event.target?.result as string;
        const parsedData = sanitizeImportedSnapshot(JSON.parse(raw));

        if (!parsedData) {
          throw new Error('Invalid schema');
        }

        const mode = getPersistenceMode();
        const currentUser = useAppStore.getState().user;
        const firebaseUid = useAppStore.getState().firebaseUid;
        const normalizedData = firebaseUid
          ? {
              ...parsedData,
              user: {
                ...parsedData.user,
                id: firebaseUid,
                email: currentUser.email,
              },
            }
          : parsedData;

        if (mode === 'firebase' && firebaseUid) {
          const updatedAt = new Date().toISOString();
          await writeWorkspaceRemote(firebaseUid, {
            updatedAt,
            state: normalizedData,
          });
          useAppStore.setState((state) => mergePersistedWorkspace(state, normalizedData));
          writeWorkspaceCache(firebaseUid, normalizedData, updatedAt);
          setLastSyncAt(firebaseUid, updatedAt);
        } else {
          useAppStore.setState(normalizedData);
        }

        setImportStatus('success');
        toast.success(t('settings.importSuccess'));
        setTimeout(() => window.location.reload(), 1500);
      } catch {
        setImportStatus('error');
        toast.error(t('settings.importInvalid'));
      } finally {
        setIsImporting(false);
        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  const wipeAccount = () => {
    const mode = getPersistenceMode();
    const firebaseUid = useAppStore.getState().firebaseUid;

    if (mode === 'firebase' && firebaseUid) {
      void wipeRemoteWorkspace(firebaseUid)
        .then(() => {
          clearWorkspaceCache(firebaseUid);
          toast.success(t('settings.resetRemoteSuccess'));
          window.setTimeout(() => {
            window.location.reload();
          }, 700);
        })
        .catch(() => {
          toast.error(t('settings.resetRemoteError'));
        });
      return;
    }

    clearWorkspaceCache();
    localStorage.removeItem(STORE_STORAGE_KEY);
    toast.success(t('settings.resetSuccess'));
    window.setTimeout(() => {
      window.location.reload();
    }, 700);
  };

  return {
    isExporting,
    isImporting,
    importStatus,
    fileInputRef,
    exportData,
    triggerImport,
    handleFileChange,
    wipeAccount
  };
}
