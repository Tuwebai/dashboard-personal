import { useState, useRef } from 'react';
import { useAppStore } from '../../../stores/useAppStore';
import { STORE_STORAGE_KEY } from '../../../core/persistence/storage';
const MAX_IMPORT_SIZE_BYTES = 5 * 1024 * 1024;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidImportData(value: unknown): value is Record<string, unknown> {
  if (!isPlainObject(value)) return false;

  const { settings, tasks } = value;

  return isPlainObject(settings) && Array.isArray(tasks);
}

export function useDataPortability() {
  const store = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const exportData = () => {
    setIsExporting(true);
    try {
      const data = JSON.stringify(store, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nexus-crm-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      setImportStatus('error');
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
        const parsedData = JSON.parse(raw);
        
        if (isValidImportData(parsedData)) {
           useAppStore.setState(parsedData);
           setImportStatus('success');
           setTimeout(() => window.location.reload(), 1500);
        } else {
           throw new Error('Invalid schema');
        }
      } catch {
        setImportStatus('error');
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
    localStorage.removeItem(STORE_STORAGE_KEY);
    window.location.reload();
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
