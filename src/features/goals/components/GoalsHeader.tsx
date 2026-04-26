import { Target } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { useI18n } from '../../../shared/i18n/useI18n';
import { useReadonlyActionProps } from '../../../shared/hooks/useReadonlyActionProps';

interface GoalsHeaderProps {
  onCreate: () => void;
}

export function GoalsHeader({ onCreate }: GoalsHeaderProps) {
  const { t } = useI18n();
  const { actionProps } = useReadonlyActionProps();
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-white/8 bg-white/4 p-6 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
          <Target size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{t('goals.title')}</h1>
          <p className="mt-1 max-w-2xl text-sm text-white/45">
            {t('goals.subtitle')}
          </p>
        </div>
      </div>

      <Button variant="gradient" onClick={onCreate} {...actionProps}>{t('goals.newGoal')}</Button>
    </header>
  );
}
