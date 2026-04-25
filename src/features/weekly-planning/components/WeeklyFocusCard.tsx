import { Target } from 'lucide-react';
import { useMemo } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n';
import { useAppStore } from '../../../stores/useAppStore';
import { Select } from '../../../shared/ui/Input';

export function WeeklyFocusCard() {
  const { t } = useI18n();
  const weeklyFocus = useAppStore((state) => state.weeklyFocus);
  const weeklyFocusGoalId = useAppStore((state) => state.weeklyFocusGoalId);
  const setWeeklyFocus = useAppStore((state) => state.setWeeklyFocus);
  const setWeeklyFocusGoal = useAppStore((state) => state.setWeeklyFocusGoal);
  const personalGoals = useAppStore((state) => state.personalGoals);
  const goalOptions = useMemo(
    () => [
      { value: '', label: t('weeklyPlanning.focusGoalPlaceholder') },
      ...personalGoals.map((goal) => ({ value: goal.id, label: goal.title })),
    ],
    [personalGoals, t]
  );

  return (
    <section className="rounded-2xl border border-white/8 bg-white/4 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/12 text-violet-300">
          <Target size={18} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">{t('weeklyPlanning.focusTitle')}</h2>
          <p className="text-xs text-white/35">{t('weeklyPlanning.focusSubtitle')}</p>
        </div>
      </div>

      <Select
        label={t('weeklyPlanning.focusGoal')}
        value={weeklyFocusGoalId}
        onChange={(event) => setWeeklyFocusGoal(event.target.value)}
        options={goalOptions}
      />

      <textarea
        value={weeklyFocus}
        onChange={(event) => setWeeklyFocus(event.target.value)}
        placeholder={t('weeklyPlanning.focusEmpty')}
        className="mt-4 min-h-32 w-full rounded-2xl border border-dashed border-white/10 bg-black/10 p-5 text-sm text-white/80 outline-none transition-colors placeholder:text-white/30 focus:border-violet-500/40"
      />
    </section>
  );
}
