import { memo } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronRight, Clock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import { useI18n } from '../../../../shared/i18n/useI18n';
import { formatWithLocale, parseDateString } from '../../utils/dateUtils';
import type { CalendarEvent } from '../../../../shared/types';

interface AgendaViewProps {
  onEventClick: (ev: CalendarEvent) => void;
}

export const AgendaView = memo(({ onEventClick }: AgendaViewProps) => {
  const { eventsByDate, deleteEvent } = useCalendarEvents();
  const { t, lang } = useI18n();

  const sortedDates = Object.keys(eventsByDate).sort();

  return (
    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
      {sortedDates.length > 0 ? (
        sortedDates.map(dateKey => {
          const dayEvents = eventsByDate[dateKey];
          const dateObj = parseDateString(dateKey);
          
          return (
            <div key={dateKey} className="mb-8 last:mb-0">
              <div className="flex items-center gap-3 mb-4 sticky top-0 bg-bg-secondary/80 backdrop-blur-md py-2 z-10">
                <span className="text-sm font-bold text-violet-400">
                  {formatWithLocale(dateObj, 'EEEE', lang).toUpperCase()}
                </span>
                <span className="text-sm font-medium text-text-muted">
                  {formatWithLocale(dateObj, 'd MMMM', lang)}
                </span>
                <div className="flex-1 h-px bg-border/50" />
              </div>

              <div className="space-y-3">
                {dayEvents.map(event => (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => onEventClick(event)}
                    className="group relative flex items-center justify-between p-4 bg-bg-tertiary border border-border rounded-2xl hover:border-violet-500/30 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-violet-500/5"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-1.5 h-10 rounded-full" 
                        style={{ backgroundColor: event.color }} 
                      />
                      <div>
                        <h4 className="font-bold text-text-primary group-hover:text-violet-400 transition-colors">
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                          <Clock size={12} />
                          <span>{event.startDate.split('T')[1].substring(0, 5)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteEvent(event.id); toast.success(t('calendar.eventDeleted')); }}
                        className="p-2 text-text-muted hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                      <ChevronRight size={18} className="text-text-muted opacity-20 group-hover:opacity-100 group-hover:text-violet-400 transition-all" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex h-[50vh] flex-col items-center justify-center text-center text-text-muted">
          <CalendarIcon size={48} className="mb-4" />
          <p className="text-lg font-bold text-text-primary">{t('calendar.noEvents')}</p>
          <p className="text-sm text-text-secondary">{t('calendar.planNext')}</p>
        </div>
      )}
    </div>
  );
});

AgendaView.displayName = 'AgendaView';
