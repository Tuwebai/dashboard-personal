import { useState } from 'react';
import type { PersonalGoal } from '../types';
import { useI18n } from '../../../shared/i18n/useI18n';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog';

interface GoalMatrixViewProps {
  goals: PersonalGoal[];
  onEdit: (goal: PersonalGoal) => void;
  onDelete: (goal: PersonalGoal) => void;
  getRelatedTaskCount: (goalId: string) => number;
}

const PRIORITIES: PersonalGoal['priority'][] = ['critical', 'high', 'medium', 'low'];
const HORIZONS: PersonalGoal['horizon'][] = ['weekly', 'monthly', 'quarterly', 'yearly'];

export function GoalMatrixView({ goals, onEdit, onDelete, getRelatedTaskCount }: GoalMatrixViewProps) {
  const { t } = useI18n();
  const [selectedGoal, setSelectedGoal] = useState<PersonalGoal | null>(null);
  return (
    <>
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
                        <div key={goal.id} className="rounded-lg bg-white/5 px-3 py-2 text-xs text-white/75">
                          <button
                            type="button"
                            onClick={() => onEdit(goal)}
                            className="block w-full text-left hover:text-white"
                          >
                            <span className="block truncate">{goal.title}</span>
                            <span className="mt-1 block text-[11px] text-white/35">
                              {getRelatedTaskCount(goal.id)} {t('goals.tasks').toLowerCase()}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedGoal(goal)}
                            className="mt-2 text-[11px] font-medium text-rose-300 transition-colors hover:text-rose-200"
                          >
                            {t('goals.delete')}
                          </button>
                        </div>
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
      <ConfirmDialog
        isOpen={selectedGoal !== null}
        title={t('goals.deleteTitle')}
        message={t('goals.deleteMessage')}
        confirmLabel={t('goals.delete')}
        onCancel={() => setSelectedGoal(null)}
        onConfirm={() => {
          if (selectedGoal) {
            onDelete(selectedGoal);
          }
          setSelectedGoal(null);
        }}
      />
    </>
  );
}
