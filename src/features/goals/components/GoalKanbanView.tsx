import { GoalCard } from './GoalCard';
import type { PersonalGoal } from '../types';
import { useI18n } from '../../../shared/i18n/useI18n';

interface GoalKanbanViewProps {
  goals: PersonalGoal[];
  onEdit: (goal: PersonalGoal) => void;
  getRelatedTaskCount: (goalId: string) => number;
}

export function GoalKanbanView({ goals, onEdit, getRelatedTaskCount }: GoalKanbanViewProps) {
  const { t } = useI18n();
  const columns: Array<{ key: PersonalGoal['status']; label: string }> = [
    { key: 'planned', label: t('goals.columnPlanned') },
    { key: 'active', label: t('goals.columnActive') },
    { key: 'paused', label: t('goals.columnPaused') },
    { key: 'completed', label: t('goals.columnCompleted') },
  ];
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {columns.map((column) => (
        <section key={column.key} className="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">{column.label}</h3>
            <span className="text-xs text-white/35">{goals.filter((goal) => goal.status === column.key).length}</span>
          </div>
          <div className="space-y-3">
            {goals
              .filter((goal) => goal.status === column.key)
              .map((goal) => <GoalCard key={goal.id} goal={goal} onEdit={onEdit} relatedTaskCount={getRelatedTaskCount(goal.id)} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
