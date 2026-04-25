import { Target } from 'lucide-react';
import { cn } from '../../../shared/lib/cn';
import type { PersonalGoal } from '../types';
import { GoalProgressBar } from './GoalProgressBar';
import { useI18n } from '../../../shared/i18n/useI18n';
import { useAppStore } from '../../../stores/useAppStore';

interface GoalCardProps {
  goal: PersonalGoal;
  onEdit?: (goal: PersonalGoal) => void;
  relatedTaskCount?: number;
}

const STATUS_STYLES: Record<PersonalGoal['status'], string> = {
  planned: 'bg-white/8 text-white/60',
  active: 'bg-violet-500/15 text-violet-300',
  paused: 'bg-amber-500/15 text-amber-300',
  completed: 'bg-emerald-500/15 text-emerald-300',
};

export function GoalCard({ goal, onEdit, relatedTaskCount = 0 }: GoalCardProps) {
  const { t } = useI18n();
  const setWeeklyFocusGoal = useAppStore((state) => state.setWeeklyFocusGoal);
  const horizonLabels = {
    weekly: t('goals.horizonWeekly'),
    monthly: t('goals.horizonMonthly'),
    quarterly: t('goals.horizonQuarterly'),
    yearly: t('goals.horizonYearly'),
  } as const;
  const priorityLabels = {
    low: t('goals.priorityLow'),
    medium: t('goals.priorityMedium'),
    high: t('goals.priorityHigh'),
    critical: t('goals.priorityCritical'),
  } as const;
  const statusLabels = {
    planned: t('goals.statusPlanned'),
    active: t('goals.statusActive'),
    paused: t('goals.statusPaused'),
    completed: t('goals.statusCompleted'),
  } as const;
  return (
    <article className="rounded-2xl border border-white/8 bg-white/4 p-5 backdrop-blur-sm transition-all duration-200 hover:bg-white/6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
              <Target size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-white">{goal.title}</h3>
              <p className="truncate text-xs text-white/40">{goal.description}</p>
            </div>
          </div>
        </div>

        <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium', STATUS_STYLES[goal.status])}>
          {statusLabels[goal.status]}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-white/6 px-2.5 py-1 text-[11px] text-white/55">
          {horizonLabels[goal.horizon]}
        </span>
        <span className="rounded-full bg-white/6 px-2.5 py-1 text-[11px] text-white/55">
          {t('goals.priorityLabel')} {priorityLabels[goal.priority]}
        </span>
        <span className="rounded-full bg-white/6 px-2.5 py-1 text-[11px] text-white/55">
          {relatedTaskCount} {t('goals.tasks').toLowerCase()}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-white/45">
          <span>Progreso</span>
          <span>{goal.progress}%</span>
        </div>
        <GoalProgressBar value={goal.progress} />
      </div>

      {onEdit ? (
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => setWeeklyFocusGoal(goal.id)}
            className="text-xs font-medium text-violet-300 transition-colors hover:text-violet-200"
          >
            {t('weeklyPlanning.setAsFocus')}
          </button>
          <button
            type="button"
            onClick={() => onEdit(goal)}
            className="text-xs font-medium text-white/45 transition-colors hover:text-white/80"
          >
            {t('goals.edit')}
          </button>
        </div>
      ) : null}
    </article>
  );
}
