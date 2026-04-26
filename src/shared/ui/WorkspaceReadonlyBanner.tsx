import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../stores/useAppStore';
import { useI18n } from '../i18n/useI18n';
import { WORKSPACE_READONLY_BLOCKED_EVENT } from '../../core/persistence/workspaceReadonly';
import { Button } from './Button';

const READONLY_TOAST_DEBOUNCE_MS = 1500;

export function WorkspaceReadonlyBanner() {
  const workspaceReadOnly = useAppStore((state) => state.workspaceReadOnly);
  const setActiveModule = useAppStore((state) => state.setActiveModule);
  const { t } = useI18n();
  const lastToastAtRef = useRef(0);

  useEffect(() => {
    if (!workspaceReadOnly) {
      return;
    }

    const handleBlockedAction = () => {
      const now = Date.now();
      if (now - lastToastAtRef.current < READONLY_TOAST_DEBOUNCE_MS) {
        return;
      }

      lastToastAtRef.current = now;
      toast.error(t('settings.readonlyActionBlocked'));
    };

    window.addEventListener(WORKSPACE_READONLY_BLOCKED_EVENT, handleBlockedAction);
    return () => window.removeEventListener(WORKSPACE_READONLY_BLOCKED_EVENT, handleBlockedAction);
  }, [t, workspaceReadOnly]);

  if (!workspaceReadOnly) {
    return null;
  }

  return (
    <div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-start gap-3 text-amber-100">
        <div className="mt-0.5 rounded-lg bg-amber-500/15 p-2 text-amber-300">
          <AlertTriangle size={16} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{t('settings.readonlyBannerTitle')}</p>
          <p className="mt-1 text-xs text-amber-100/80">{t('settings.syncOfflineReadonly')}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto shrink-0 border border-amber-400/20 text-amber-100 hover:bg-amber-400/10 hover:text-white"
          onClick={() => setActiveModule('settings')}
        >
          {t('settings.reviewSyncStatus')}
        </Button>
      </div>
    </div>
  );
}
