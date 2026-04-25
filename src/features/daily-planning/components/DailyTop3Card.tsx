import { CheckCircle2, XCircle } from 'lucide-react';
import { useI18n } from '../../../shared/i18n/useI18n';
import { Select } from '../../../shared/ui/Input';
import type { Task } from '../../../shared/types';

interface DailyTop3CardProps {
  dailyTop3: string[];
  dailyHighlightedTaskIds: string[];
  suggestedTasks: Task[];
  setDailyTop3: (index: number, value: string) => void;
  setDailyHighlightedTask: (index: number, taskId: string) => void;
}

export function DailyTop3Card({
  dailyTop3,
  dailyHighlightedTaskIds,
  suggestedTasks,
  setDailyTop3,
  setDailyHighlightedTask,
}: DailyTop3CardProps) {
  const { t } = useI18n();

  return (
    <section className="rounded-3xl border border-white/10 bg-white/3 p-6 shadow-2xl shadow-black/20">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-300">
          <CheckCircle2 size={20} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">{t('dailyPlanning.top3Title')}</h2>
          <p className="text-xs text-white/35">{t('dailyPlanning.top3Subtitle')}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {dailyTop3.map((item, index) => (
          <div key={`daily-top-${index}`} className="rounded-2xl border border-white/10 bg-black/10 p-4">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-white/30">
              {t('dailyPlanning.top3ItemLabel')} {index + 1}
            </label>
            <input
              value={item}
              onChange={(event) => setDailyTop3(index, event.target.value)}
              placeholder={t('dailyPlanning.top3Placeholder')}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />

            <div className="mt-3 flex items-center gap-2">
              <Select
                value={dailyHighlightedTaskIds[index] ?? ''}
                onChange={(event) => setDailyHighlightedTask(index, event.target.value)}
                options={[
                  { value: '', label: t('dailyPlanning.selectTaskPlaceholder') },
                  ...suggestedTasks.map((task) => ({ value: task.id, label: task.title })),
                ]}
              />

              {dailyHighlightedTaskIds[index] ? (
                <button
                  onClick={() => setDailyHighlightedTask(index, '')}
                  className="rounded-xl border border-white/10 p-2 text-white/50 transition-colors hover:text-white"
                  aria-label={t('dailyPlanning.clearTask')}
                >
                  <XCircle size={18} />
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
