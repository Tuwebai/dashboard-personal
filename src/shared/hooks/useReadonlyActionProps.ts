import { useMemo } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { useI18n } from '../i18n/useI18n';

export function useReadonlyActionProps() {
  const workspaceReadOnly = useAppStore((state) => state.workspaceReadOnly);
  const { t } = useI18n();

  return useMemo(
    () => ({
      workspaceReadOnly,
      readonlyActionLabel: t('settings.readonlyActionBlocked'),
      actionProps: workspaceReadOnly
        ? {
            disabled: true,
            title: t('settings.readonlyActionBlocked'),
          }
        : {},
    }),
    [t, workspaceReadOnly],
  );
}
