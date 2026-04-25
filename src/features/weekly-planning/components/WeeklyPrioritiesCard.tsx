import { CheckSquare } from 'lucide-react';
import { useMemo } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n';
import { useAppStore } from '../../../stores/useAppStore';
import { Select } from '../../../shared/ui/Input';

export function WeeklyPrioritiesCard() {
  const { t } = useI18n();
  const weeklyTopPriorities = useAppStore((state) => state.weeklyTopPriorities);
  const weeklyPriorityTaskIds = useAppStore((state) => state.weeklyPriorityTaskIds);
  const setWeeklyPriority = useAppStore((state) => state.setWeeklyPriority);
  const setWeeklyPriorityTask = useAppStore((state) => state.setWeeklyPriorityTask);
  const tasks = useAppStore((state) => state.tasks);
  const availableTasks = useMemo(() => tasks.filter((task) => !task.isArchived), [tasks]);
  const taskOptions = useMemo(
    () => [
      { value: '', label: t('weeklyPlanning.priorityTaskPlaceholder') },
      ...availableTasks.map((task) => ({ value: task.id, label: task.title })),
    ],
    [availableTasks, t]
  );

  return (
    <section className="rounded-2xl border border-white/8 bg-white/4 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/12 text-cyan-300">
          <CheckSquare size={18} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">{t('weeklyPlanning.prioritiesTitle')}</h2>
          <p className="text-xs text-white/35">{t('weeklyPlanning.prioritiesSubtitle')}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {weeklyTopPriorities.map((priority, row) => (
          <div key={row} className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-4 py-3">
            <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/6 text-xs font-semibold text-white/45">
              {row + 1}
            </span>
            <input
              value={priority}
              onChange={(event) => setWeeklyPriority(row, event.target.value)}
              placeholder={t('weeklyPlanning.priorityEmpty')}
              className="w-full bg-transparent text-sm text-white/75 outline-none placeholder:text-white/30"
            />
            </div>
            <div className="mt-3">
              <Select
                label={t('weeklyPlanning.priorityTask')}
                value={weeklyPriorityTaskIds[row] ?? ''}
                onChange={(event) => setWeeklyPriorityTask(row, event.target.value)}
                options={taskOptions}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
