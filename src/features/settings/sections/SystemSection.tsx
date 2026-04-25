import { useState } from 'react';
import { Button } from '../../../shared/ui/Button';
import { Modal } from '../../../shared/ui/Modal';
import { 
  Download, Upload, Trash2, 
  AlertTriangle, ShieldAlert, Archive, Check 
} from 'lucide-react';
import { useDataPortability } from '../hooks/useDataPortability';
import { usePersistenceMode } from '../hooks/usePersistenceMode';
import { usePersistenceSyncStatus } from '../hooks/usePersistenceSyncStatus';
import { useI18n } from '../../../shared/i18n/useI18n';

export function SystemSection() {
  const { t } = useI18n();
  const {
    isExporting, isImporting, importStatus, fileInputRef,
    exportData, triggerImport, handleFileChange, wipeAccount
  } = useDataPortability();
  const { currentMode, firebaseReady, changePersistenceMode } = usePersistenceMode();
  const { status, updatedAt } = usePersistenceSyncStatus();
  
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const formattedUpdatedAt = updatedAt
    ? new Date(updatedAt).toLocaleString('es-AR', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : '';

  return (
    <section className="space-y-8 md:space-y-12">
      <div className="rounded-xl border border-border bg-bg-card p-4 space-y-6 sm:p-6">
        <h3 className="text-sm font-semibold text-white tracking-tight">{t('settings.persistence')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => changePersistenceMode('local')}
            className={`rounded-xl border p-5 text-left transition ${currentMode === 'local' ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-border bg-bg-tertiary hover:border-white/20'}`}
          >
            <p className="text-sm font-semibold text-white">{t('settings.persistenceLocal')}</p>
            <p className="mt-1 text-xs text-white/40">{t('settings.persistenceLocalDesc')}</p>
          </button>

          <button
            type="button"
            onClick={() => changePersistenceMode('firebase')}
            disabled={!firebaseReady}
            className={`rounded-xl border p-5 text-left transition ${currentMode === 'firebase' ? 'border-violet-500/30 bg-violet-500/10' : 'border-border bg-bg-tertiary hover:border-white/20'} ${!firebaseReady ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <p className="text-sm font-semibold text-white">{t('settings.persistenceFirebase')}</p>
            <p className="mt-1 text-xs text-white/40">
              {firebaseReady ? t('settings.persistenceFirebaseDesc') : t('settings.persistenceFirebaseDisabled')}
            </p>
          </button>
        </div>

        <div className="rounded-xl border border-border bg-bg-tertiary p-4">
          <p className="text-sm font-semibold text-white">{t('settings.syncStatus')}</p>
          <p className="mt-1 text-xs text-white/40">
            {currentMode === 'firebase'
              ? status === 'auth-resolving'
                ? t('settings.syncAuthResolving')
                : status === 'hydrating'
                ? t('settings.syncHydrating')
                : status === 'ready'
                ? updatedAt
                  ? t('settings.syncedAt').replace('{time}', formattedUpdatedAt)
                  : t('settings.syncWaiting')
                : status === 'syncing'
                ? t('settings.syncing')
                : status === 'offline-readonly'
                ? t('settings.syncOfflineReadonly')
                : status === 'error'
                  ? t('settings.syncError')
                  : updatedAt
                    ? t('settings.syncedAt').replace('{time}', formattedUpdatedAt)
                    : t('settings.syncWaiting')
              : t('settings.syncLocal')}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-bg-card p-4 space-y-6 sm:p-6">
        <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
          <Download className="w-4 h-4 text-violet-400" />
          {t('settings.dataPortability')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-bg-tertiary border border-border rounded-xl space-y-4">
             <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center">
              <Download size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{t('settings.exportWorkspace')}</p>
              <p className="text-xs text-white/40 mt-1">{t('settings.exportWorkspaceDesc')}</p>
            </div>
            <Button 
              variant="outline" 
              className="w-full h-10 border-blue-500/20 hover:bg-blue-500/10 text-blue-400 text-sm"
              onClick={exportData}
              loading={isExporting}
              leftIcon={<Download size={18} />}
            >
              {t('settings.startExport')}
            </Button>
          </div>

          <div className="p-5 bg-bg-tertiary border border-border rounded-xl space-y-4 relative overflow-hidden">
             <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept=".json" />
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${importStatus === 'success' ? 'bg-emerald-500/20 text-emerald-400' : importStatus === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-violet-500/10 text-violet-400'}`}>
              {importStatus === 'success' ? <Check size={20} /> : importStatus === 'error' ? <AlertTriangle size={20} /> : <Upload size={20} />}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{t('settings.importBackup')}</p>
              <p className="text-xs text-white/40 mt-1">{t('settings.importBackupDesc')}</p>
            </div>
            <Button 
              variant="outline" 
              className={`w-full h-10 text-sm ${importStatus === 'error' ? 'border-red-500/20 text-red-500' : 'border-violet-500/20 hover:bg-violet-500/10 text-violet-400'}`}
              onClick={triggerImport}
              loading={isImporting}
              leftIcon={<Upload size={18} />}
            >
              {t('settings.restoreBackup')}
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-bg-card p-4 space-y-5 sm:p-6">
        <h3 className="text-sm font-semibold text-red-400 tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          {t('settings.dangerZone')}
        </h3>
        <div className="flex flex-col gap-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 sm:p-5 md:flex-row md:items-center md:gap-5">
           <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm font-semibold text-red-400">{t('settings.resetDataCenter')}</p>
              <p className="text-xs text-white/40 mt-1">{t('settings.resetDataCenterDesc')}</p>
            </div>
            <Button 
              variant="primary" 
              className="px-6 h-10 bg-red-500 hover:bg-red-600 text-white font-bold text-sm shrink-0"
              leftIcon={<Trash2 size={16} />}
              onClick={() => setIsResetModalOpen(true)}
            >
              {t('settings.wipeAccount')}
            </Button>
        </div>
      </div>

      <div className="p-5 bg-bg-card border border-border rounded-xl flex items-center gap-4">
        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40">
           <Archive size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t('settings.persistenceOverview')}</p>
          <p className="text-xs text-white/40">
            {currentMode === 'firebase' ? t('settings.persistenceFirebaseDesc') : t('settings.persistenceLocalDesc')}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-semibold border border-emerald-500/20">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          {currentMode === 'firebase' ? t('settings.persistenceModeRemote') : t('settings.persistenceModeLocal')}
        </div>
      </div>

      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title={t('settings.resetDanger')}
      >
        <div className="space-y-5 text-center py-2">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center mx-auto">
            <AlertTriangle size={32} />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-white">{t('settings.resetConfirmTitle')}</h4>
            <p className="text-sm text-white/40">
              {currentMode === 'firebase' ? t('settings.resetRemoteConfirmDesc') : t('settings.resetLocalConfirmDesc')}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button 
              variant="primary" 
              className="h-11 bg-red-500 hover:bg-red-600 text-white font-bold"
              onClick={wipeAccount}
            >
              {t('settings.confirmDestructiveAction')}
            </Button>
            <Button 
              variant="ghost" 
              className="h-10 text-sm text-white/40 hover:text-white"
              onClick={() => setIsResetModalOpen(false)}
            >
              {t('settings.cancelAndReturn')}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
