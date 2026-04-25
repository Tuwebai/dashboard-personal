import { useDebouncedSuccessToast } from '../../../shared/hooks/useDebouncedSuccessToast';
import { useI18n } from '../../../shared/i18n/useI18n';

export function usePlanningAutosaveToast() {
  const { t } = useI18n();
  return useDebouncedSuccessToast(t('common.saved'));
}
