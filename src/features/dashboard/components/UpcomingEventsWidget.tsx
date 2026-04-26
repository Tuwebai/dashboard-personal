import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { useI18n } from '../../../shared/i18n/useI18n';
import type { AppModule } from '../../../core/navigation/routes';
import type { CalendarEvent } from '../../../shared/types';

interface UpcomingEventsWidgetProps {
  upcomingEvents: CalendarEvent[];
  setActiveModule: (module: AppModule) => void;
}

export function UpcomingEventsWidget({ upcomingEvents, setActiveModule }: UpcomingEventsWidgetProps) {
  const { t } = useI18n();
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div variants={itemVariants} className="bg-bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white text-sm">{t('dashboard.upcoming')}</h3>
        <button onClick={() => setActiveModule('calendar')} className="text-violet-400 hover:text-violet-300 transition-colors cursor-pointer">
          <ArrowRight size={16} />
        </button>
      </div>
      {upcomingEvents.length > 0 ? (
        <div className="space-y-3">
          {upcomingEvents.map(event => (
            <div key={event.id} className="flex items-start gap-3">
              <div
                className="w-1 h-full min-h-[36px] rounded-full shrink-0 mt-1"
                style={{ background: event.color }}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{event.title}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock size={11} className="text-white/30" />
                  <p className="text-xs text-white/40">
                    {event.isAllDay
                      ? format(parseISO(event.startDate), 'MMM d')
                      : format(parseISO(event.startDate), 'MMM d · h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Calendar} message={t('dashboard.noEvents')} />
      )}
    </motion.div>
  );
}
