import { Target } from 'lucide-react';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { useI18n } from '../../../shared/i18n/useI18n';

export function GoalEmptyState() {
  const { t } = useI18n();
  return (
    <EmptyState
      icon={Target}
      message={t('goals.empty')}
      className="rounded-2xl border border-dashed border-white/10 bg-white/3"
      minHeight={220}
    />
  );
}
