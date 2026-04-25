import type { PersonalGoal } from '../types';
import { useI18n } from '../../../shared/i18n/useI18n';

interface GoalTableViewProps {
  goals: PersonalGoal[];
  onEdit: (goal: PersonalGoal) => void;
  getRelatedTaskCount: (goalId: string) => number;
}

export function GoalTableView({ goals, onEdit, getRelatedTaskCount }: GoalTableViewProps) {
  const { t } = useI18n();
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/3">
      <table className="w-full">
        <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.12em] text-white/35">
          <tr>
            <th className="px-4 py-3">{t('goals.goal')}</th>
            <th className="px-4 py-3">{t('goals.horizon')}</th>
            <th className="px-4 py-3">{t('goals.priority')}</th>
            <th className="px-4 py-3">{t('goals.status')}</th>
            <th className="px-4 py-3">{t('goals.tasks')}</th>
            <th className="px-4 py-3">{t('goals.progress')}</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {goals.map((goal) => (
            <tr key={goal.id} className="border-t border-white/6 text-sm text-white/75">
              <td className="px-4 py-3">{goal.title}</td>
              <td className="px-4 py-3 capitalize">{goal.horizon}</td>
              <td className="px-4 py-3 capitalize">{goal.priority}</td>
              <td className="px-4 py-3 capitalize">{goal.status}</td>
              <td className="px-4 py-3">{getRelatedTaskCount(goal.id)}</td>
              <td className="px-4 py-3">{goal.progress}%</td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onEdit(goal)}
                  className="text-xs font-medium text-white/45 hover:text-white/80"
                >
                  {t('goals.edit')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
