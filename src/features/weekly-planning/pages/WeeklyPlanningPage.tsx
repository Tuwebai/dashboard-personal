import { useState } from 'react';
import { CalendarDays, SunMedium } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../../../shared/i18n/useI18n';
import { cn } from '../../../shared/lib/cn';
import { WeeklyFocusCard } from '../components/WeeklyFocusCard';
import { WeeklyNotesCard } from '../components/WeeklyNotesCard';
import { WeeklyPrioritiesCard } from '../components/WeeklyPrioritiesCard';
import { DailyPlanningPanel } from '../../daily-planning';

type PlanningView = 'weekly' | 'daily';

export function WeeklyPlanningPage() {
  const { t } = useI18n();
  const [view, setView] = useState<PlanningView>('weekly');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/30">
            {t('weeklyPlanning.eyebrow')}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
            {view === 'weekly' ? t('weeklyPlanning.title') : t('dailyPlanning.title')}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/45">
            {view === 'weekly' ? t('weeklyPlanning.subtitle') : t('dailyPlanning.subtitle')}
          </p>
        </div>

        <div className="flex items-center self-start rounded-2xl border border-border bg-bg-secondary p-1.5 shadow-2xl glass-strong">
          <button
            onClick={() => setView('weekly')}
            className={cn(
              'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-300',
              view === 'weekly'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                : 'text-text-muted hover:bg-white/5 hover:text-text-primary',
            )}
            aria-label={t('weeklyPlanning.title')}
          >
            <CalendarDays size={16} />
            <span>{t('weeklyPlanning.switchWeekly')}</span>
          </button>
          <button
            onClick={() => setView('daily')}
            className={cn(
              'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-300',
              view === 'daily'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                : 'text-text-muted hover:bg-white/5 hover:text-text-primary',
            )}
            aria-label={t('dailyPlanning.title')}
          >
            <SunMedium size={16} />
            <span>{t('dailyPlanning.switchDaily')}</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {view === 'weekly' ? (
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <WeeklyFocusCard />
              <WeeklyPrioritiesCard />
              <div className="xl:col-span-2">
                <WeeklyNotesCard />
              </div>
            </div>
          ) : (
            <DailyPlanningPanel />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
