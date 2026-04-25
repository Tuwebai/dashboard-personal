import { BookOpenText, NotebookPen, SunMedium } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { useI18n } from '../../../shared/i18n/useI18n';

interface DailyNotesCardsProps {
  dailyIntention: string;
  dailyQuickNotes: string;
  setDailyIntention: (value: string) => void;
  setDailyQuickNotes: (value: string) => void;
  onOpenJournaling: () => void;
  onSaved: () => void;
}

export function DailyNotesCards({
  dailyIntention,
  dailyQuickNotes,
  setDailyIntention,
  setDailyQuickNotes,
  onOpenJournaling,
  onSaved,
}: DailyNotesCardsProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-amber-500/15 p-3 text-amber-300">
            <SunMedium size={20} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">{t('dailyPlanning.intentionTitle')}</h2>
            <p className="text-xs text-white/35">{t('dailyPlanning.intentionSubtitle')}</p>
          </div>
        </div>

        <textarea
          value={dailyIntention}
          onChange={(event) => {
            setDailyIntention(event.target.value);
            onSaved();
          }}
          placeholder={t('dailyPlanning.intentionPlaceholder')}
          className="mt-5 min-h-32 w-full rounded-2xl border border-dashed border-white/10 bg-black/10 p-5 text-sm text-white/75 outline-none transition-colors placeholder:text-white/30 focus:border-amber-500/40"
        />
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-300">
            <NotebookPen size={20} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">{t('dailyPlanning.quickNotesTitle')}</h2>
            <p className="text-xs text-white/35">{t('dailyPlanning.quickNotesSubtitle')}</p>
          </div>
        </div>

        <textarea
          value={dailyQuickNotes}
          onChange={(event) => {
            setDailyQuickNotes(event.target.value);
            onSaved();
          }}
          placeholder={t('dailyPlanning.quickNotesPlaceholder')}
          className="mt-5 min-h-40 w-full rounded-2xl border border-dashed border-white/10 bg-black/10 p-5 text-sm text-white/75 outline-none transition-colors placeholder:text-white/30 focus:border-emerald-500/40"
        />

        <div className="mt-4">
          <Button onClick={onOpenJournaling} variant="secondary" className="w-full sm:w-auto">
            <BookOpenText size={16} />
            {t('dailyPlanning.openJournaling')}
          </Button>
        </div>
      </section>
    </div>
  );
}
