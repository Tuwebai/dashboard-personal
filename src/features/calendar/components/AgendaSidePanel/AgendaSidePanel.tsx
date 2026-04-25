import { memo } from 'react';
import { Calendar as CalendarIcon, Clock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCalendarView } from '../../hooks/useCalendarView';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import { useI18n } from '../../../../shared/i18n/useI18n';
import { formatWithLocale } from '../../utils/dateUtils';
import { isSameDay } from 'date-fns';

export const AgendaSidePanel = memo(() => {
  const { currentDate } = useCalendarView();
  const { events, deleteEvent } = useCalendarEvents();
  const { t, lang } = useI18n();

  const dayEvents = events
    .filter(e => isSameDay(new Date(e.startDate), currentDate))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  return (
    <div className="bg-bg-secondary border border-border rounded-3xl overflow-hidden glass h-full flex flex-col shadow-2xl">
      <div className="p-6 border-b border-border bg-white/2">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          {formatWithLocale(currentDate, 'd MMMM', lang)}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none">
        {dayEvents.length > 0 ? (
          dayEvents.map(event => (
            <div 
              key={event.id}
              className="group p-4 bg-bg-tertiary border border-border rounded-2xl hover:border-violet-500/30 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="w-1 h-8 rounded-full mt-1" style={{ backgroundColor: event.color }} />
                  <div>
                    <h4 className="font-bold text-sm text-text-primary group-hover:text-violet-400 transition-colors">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-text-muted">
                      <Clock size={10} />
                      <span>{event.startDate.split('T')[1].substring(0, 5)}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => { deleteEvent(event.id); toast.success(t('calendar.eventDeleted')); }}
                  className="p-1.5 text-text-muted hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-20 py-10">
            <CalendarIcon size={32} className="mb-2" />
            <p className="text-xs font-bold">{t('calendar.noEvents')}</p>
          </div>
        )}
      </div>
    </div>
  );
});

AgendaSidePanel.displayName = 'AgendaSidePanel';
