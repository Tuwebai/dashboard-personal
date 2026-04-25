import { ArrowUpRight, CheckCircle2, PlayCircle, Sparkles, Star } from 'lucide-react';
import { useI18n } from '../../../shared/i18n/useI18n';
import type { Task } from '../../../shared/types';

interface HighlightedTaskItem {
  slot: number;
  task: Task | null;
}

interface DailyHighlightedTasksCardProps {
  highlightedTasks: HighlightedTaskItem[];
  firstAvailableWeeklySlot: number;
  completeTask: (taskId: string) => void;
  moveTask: (taskId: string, status: Task['status']) => void;
  setWeeklyPriorityTask: (index: number, taskId: string) => void;
  openTaskDetail: (taskId: string) => void;
  startFocusSession: (task: Task) => void;
}

export function DailyHighlightedTasksCard({
  highlightedTasks,
  firstAvailableWeeklySlot,
  completeTask,
  moveTask,
  setWeeklyPriorityTask,
  openTaskDetail,
  startFocusSession,
}: DailyHighlightedTasksCardProps) {
  const { t } = useI18n();

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 xl:col-span-2">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-sky-500/15 p-3 text-sky-300">
          <Star size={20} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">{t('dailyPlanning.highlightedTitle')}</h2>
          <p className="text-xs text-white/35">{t('dailyPlanning.highlightedSubtitle')}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {highlightedTasks.length > 0 ? (
          highlightedTasks.map(({ slot, task }) => (
            <div key={task!.id} className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/30">
                {t('dailyPlanning.top3ItemLabel')} {slot + 1}
              </p>
              <p className="mt-2 text-sm font-medium text-white">{task!.title}</p>
              <p className="mt-2 text-xs text-white/35">{t('dailyPlanning.quickActionsTitle')}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {task!.status !== 'in_progress' ? (
                  <button
                    onClick={() => moveTask(task!.id, 'in_progress')}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white/75 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <PlayCircle size={14} />
                    {t('dailyPlanning.actionStart')}
                  </button>
                ) : null}

                {task!.status !== 'done' ? (
                  <button
                    onClick={() => completeTask(task!.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/20"
                  >
                    <CheckCircle2 size={14} />
                    {t('dailyPlanning.actionComplete')}
                  </button>
                ) : null}

                {firstAvailableWeeklySlot !== -1 ? (
                  <button
                    onClick={() => setWeeklyPriorityTask(firstAvailableWeeklySlot, task!.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-100 transition-colors hover:bg-sky-500/20"
                  >
                    <Sparkles size={14} />
                    {t('dailyPlanning.actionAddWeekly')}
                  </button>
                ) : null}
                <button
                  onClick={() => openTaskDetail(task!.id)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white/75 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <ArrowUpRight size={14} />
                  {t('dailyPlanning.actionOpenTask')}
                </button>
                <button
                  onClick={() => startFocusSession(task!)}
                  className="inline-flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-100 transition-colors hover:bg-violet-500/20"
                >
                  <PlayCircle size={14} />
                  {t('dailyPlanning.actionStartFocus')}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-4 text-sm text-white/45 md:col-span-2 xl:col-span-3">
            {t('dailyPlanning.highlightedEmpty')}
          </div>
        )}
      </div>
    </section>
  );
}
