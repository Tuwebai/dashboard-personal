import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { useAppStore } from '../../../stores/useAppStore';
import { STORE_STORAGE_KEY } from '../../../core/persistence/storage';
import {
  pickPersistedWorkspace,
  sanitizeImportedSnapshot,
} from '../../../core/persistence/workspace';
import { useI18n } from '../../../shared/i18n/useI18n';

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
    reader.onload = (event) => {
      try {
        const raw = event.target?.result as string;
        const parsedData = sanitizeImportedSnapshot(JSON.parse(raw));

        if (!parsedData) {
          throw new Error('Invalid schema');
        }

        useAppStore.setState(parsedData);
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
    toast.success(t('settings.resetSuccess'));
    localStorage.removeItem(STORE_STORAGE_KEY);
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
