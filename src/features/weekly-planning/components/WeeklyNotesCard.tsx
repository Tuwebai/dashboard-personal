import { NotebookText } from 'lucide-react';
import { useI18n } from '../../../shared/i18n/useI18n';
import { useAppStore } from '../../../stores/useAppStore';

export function WeeklyNotesCard() {
  const { t } = useI18n();
  const weeklyNotes = useAppStore((state) => state.weeklyNotes);
  const setWeeklyNotes = useAppStore((state) => state.setWeeklyNotes);

  return (
    <section className="rounded-2xl border border-white/8 bg-white/4 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-300">
          <NotebookText size={18} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">{t('weeklyPlanning.notesTitle')}</h2>
          <p className="text-xs text-white/35">{t('weeklyPlanning.notesSubtitle')}</p>
        </div>
      </div>

      <textarea
        value={weeklyNotes}
        onChange={(event) => setWeeklyNotes(event.target.value)}
        placeholder={t('weeklyPlanning.notesEmpty')}
        className="mt-5 min-h-40 w-full rounded-2xl border border-dashed border-white/10 bg-black/10 p-5 text-sm text-white/75 outline-none transition-colors placeholder:text-white/30 focus:border-emerald-500/40"
      />
    </section>
  );
}
