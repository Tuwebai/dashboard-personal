import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../shared/ui/Button';
import { useI18n } from '../../../shared/i18n/useI18n';
import { useCalendarView } from '../hooks/useCalendarView';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { formatWithLocale } from '../utils/dateUtils';
import { cn } from '../../../shared/lib/cn';
import { CalendarEvent } from '../../../shared/types';
import { 
  MonthView, 
  AgendaView, 
  AgendaSidePanel, 
  EventDetailModal, 
  AddEventModal 
} from '../components';

export default function Calendar() {
  const { 
    currentDate, 
    viewType, 
    setViewType, 
    handlePrevMonth, 
    handleNextMonth, 
    handleToday 
  } = useCalendarView();

  const { addEvent } = useCalendarEvents();
  const { t, lang } = useI18n();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const handleConfirmAdd = useCallback((eventData: { title: string; startDate: string; startTime: string; duration: string; color: string }) => {
    const start = `${eventData.startDate}T${eventData.startTime}:00`;
    const end = new Date(new Date(start).getTime() + parseInt(eventData.duration) * 60000).toISOString();
    
    addEvent({
      title: eventData.title,
      startDate: start,
      endDate: end,
      color: eventData.color,
      category: 'personal',
      recurrence: 'none',
      reminders: [],
      isAllDay: false,
    });
    setIsAddModalOpen(false);
  }, [addEvent]);

  return (
    <div className="h-full flex flex-col space-y-6 page-enter pb-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">{t('calendar.title')}</h1>
          <div className="flex items-center bg-bg-secondary border border-border rounded-2xl p-1.5 shadow-2xl glass-strong">
            <button 
              onClick={() => setViewType('month')} 
              className={cn(
                "p-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer", 
                viewType === 'month' 
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30 scale-105" 
                  : "text-text-muted hover:text-text-primary hover:bg-white/5"
              )}
              aria-label={t('calendar.month')}
            >
              <CalendarIcon size={18} />
              {viewType === 'month' && <span className="text-xs font-bold pr-1">{t('calendar.month')}</span>}
            </button>
            <button 
              onClick={() => setViewType('agenda')} 
              className={cn(
                "p-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer", 
                viewType === 'agenda' 
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30 scale-105" 
                  : "text-text-muted hover:text-text-primary hover:bg-white/5"
              )}
              aria-label={t('calendar.agenda')}
            >
              <List size={18} />
              {viewType === 'agenda' && <span className="text-xs font-bold pr-1">{t('calendar.agenda')}</span>}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-bg-secondary border border-border rounded-xl overflow-hidden shadow-sm">
            <button onClick={handlePrevMonth} className="p-2.5 hover:bg-white/5 text-text-muted transition-colors border-r border-border cursor-pointer"><ChevronLeft size={18} /></button>
            <button onClick={handleToday} className="px-4 py-2 text-sm font-bold text-text-primary hover:bg-white/5 transition-colors cursor-pointer">{t('calendar.today')}</button>
            <button onClick={handleNextMonth} className="p-2.5 hover:bg-white/5 text-text-muted transition-colors border-l border-border cursor-pointer"><ChevronRight size={18} /></button>
          </div>
          <Button 
            variant="primary" 
            className="shadow-lg shadow-violet/20 h-11 px-6 font-bold" 
            leftIcon={<Plus size={18} />} 
            onClick={() => setIsAddModalOpen(true)}
          >
            {t('calendar.newEvent')}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="popLayout">
          {viewType === 'month' ? (
            <motion.div 
              key="month"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full"
            >
              <div className="xl:col-span-3 h-full">
                <div className="bg-bg-secondary border border-border rounded-3xl overflow-hidden glass h-full flex flex-col shadow-2xl relative">
                  <div className="p-6 border-b border-border flex items-center justify-between bg-white/2">
                    <h2 className="text-xl font-bold text-text-primary">
                      {formatWithLocale(currentDate, 'MMMM yyyy', lang)}
                    </h2>
                  </div>
                  <div className="flex-1 min-h-0">
                    <MonthView onEventClick={setSelectedEvent} />
                  </div>
                </div>
              </div>
              <div className="xl:col-span-1 h-full min-h-[400px]">
                <AgendaSidePanel />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="agenda"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.15 }}
              className="bg-bg-secondary border border-border rounded-3xl overflow-hidden glass h-full flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-white/2">
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                  {t('calendar.upcoming')}
                </h2>
              </div>
              <div className="flex-1 min-h-0">
                <AgendaView onEventClick={setSelectedEvent} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AddEventModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleConfirmAdd} 
      />

      <EventDetailModal 
        event={selectedEvent} 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />
    </div>
  );
}
