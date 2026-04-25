import type { PersonalGoal } from '../types';
import { useI18n } from '../../../shared/i18n/useI18n';

interface GoalMatrixViewProps {
  goals: PersonalGoal[];
  onEdit: (goal: PersonalGoal) => void;
  getRelatedTaskCount: (goalId: string) => number;
}

const PRIORITIES: PersonalGoal['priority'][] = ['critical', 'high', 'medium', 'low'];
const HORIZONS: PersonalGoal['horizon'][] = ['weekly', 'monthly', 'quarterly', 'yearly'];

export function GoalMatrixView({ goals, onEdit, getRelatedTaskCount }: GoalMatrixViewProps) {
  const { t } = useI18n();
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {HORIZONS.map((horizon) => (
        <section key={horizon} className="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-white capitalize">{horizon}</h3>
          {PRIORITIES.map((priority) => {
            const items = goals.filter((goal) => goal.horizon === horizon && goal.priority === priority);
            return (
              <div key={priority} className="rounded-xl bg-white/4 p-3">
                <p className="mb-2 text-xs text-white/40 capitalize">{priority}</p>
                <div className="space-y-2">
                  {items.length ? (
                    items.map((goal) => (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => onEdit(goal)}
                        className="block w-full rounded-lg bg-white/5 px-3 py-2 text-left text-xs text-white/75 hover:bg-white/8"
                      >
                        <span className="block truncate">{goal.title}</span>
                        <span className="mt-1 block text-[11px] text-white/35">
                          {getRelatedTaskCount(goal.id)} {t('goals.tasks').toLowerCase()}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-white/25">{t('goals.none')}</p>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
