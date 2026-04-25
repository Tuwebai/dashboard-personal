import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, List } from 'lucide-react';
import { toast } from 'sonner';
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
import {
  buildCalendarEventSchedule,
  mapCalendarEventToFormValues,
  type CalendarEventFormValues,
} from '../lib/eventForm';

export default function Calendar() {
  const { 
    currentDate, 
    viewType, 
    setViewType, 
    handlePrevMonth, 
    handleNextMonth, 
    handleToday 
  } = useCalendarView();

  const { addEvent, updateEvent } = useCalendarEvents();
  const { t, lang } = useI18n();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
    setEditingEvent(null);
  }, []);

  const handleConfirmAdd = useCallback((eventData: CalendarEventFormValues) => {
    const duration = Number.parseInt(eventData.duration, 10);
    const title = eventData.title.trim();
    if (!title || Number.isNaN(duration)) {
      return;
    }

    const schedule = buildCalendarEventSchedule(eventData);

    if (editingEvent) {
      updateEvent(editingEvent.id, {
        title,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        color: eventData.color,
      });
      toast.success(t('calendar.updated'));
      handleCloseAddModal();
      return;
    }

    addEvent({
      title,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      color: eventData.color,
      category: 'personal',
      recurrence: 'none',
      reminders: [],
      isAllDay: false,
    });
    toast.success(t('calendar.created'));
    handleCloseAddModal();
  }, [addEvent, editingEvent, handleCloseAddModal, t, updateEvent]);

  const handleStartCreate = useCallback(() => {
    setEditingEvent(null);
    setIsAddModalOpen(true);
  }, []);

  const handleStartEdit = useCallback((event: CalendarEvent) => {
    setSelectedEvent(null);
    setEditingEvent(event);
    setIsAddModalOpen(true);
  }, []);

  return (
    <div className="flex h-full flex-col space-y-4 pb-6 page-enter md:space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <h1 className="truncate text-2xl font-bold tracking-tight text-text-primary md:text-3xl">{t('calendar.title')}</h1>
            <div className="flex w-full items-center rounded-2xl border border-border bg-bg-secondary p-1.5 shadow-2xl glass-strong sm:w-auto">
              <button 
                onClick={() => setViewType('month')} 
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl p-2.5 transition-all duration-300 cursor-pointer sm:flex-none", 
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
                  "flex flex-1 items-center justify-center gap-2 rounded-xl p-2.5 transition-all duration-300 cursor-pointer sm:flex-none", 
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
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center overflow-hidden rounded-xl border border-border bg-bg-secondary shadow-sm">
            <button onClick={handlePrevMonth} className="p-2.5 hover:bg-white/5 text-text-muted transition-colors border-r border-border cursor-pointer"><ChevronLeft size={18} /></button>
            <button onClick={handleToday} className="flex-1 px-4 py-2 text-sm font-bold text-text-primary hover:bg-white/5 transition-colors cursor-pointer sm:flex-none">{t('calendar.today')}</button>
            <button onClick={handleNextMonth} className="p-2.5 hover:bg-white/5 text-text-muted transition-colors border-l border-border cursor-pointer"><ChevronRight size={18} /></button>
          </div>
          <Button 
            variant="primary" 
            className="h-11 w-full px-6 font-bold shadow-lg shadow-violet/20 sm:w-auto" 
            leftIcon={<Plus size={18} />} 
            onClick={handleStartCreate}
          >
            {t('calendar.newEvent')}
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="popLayout">
          {viewType === 'month' ? (
            <motion.div 
              key="month"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="grid h-full grid-cols-1 gap-4 md:gap-6 xl:grid-cols-4"
            >
              <div className="h-full xl:col-span-3">
                <div className="bg-bg-secondary border border-border rounded-3xl overflow-hidden glass h-full flex flex-col shadow-2xl relative">
                  <div className="flex items-center justify-between border-b border-border bg-white/2 p-4 md:p-6">
                    <h2 className="text-lg font-bold text-text-primary md:text-xl">
                      {formatWithLocale(currentDate, 'MMMM yyyy', lang)}
                    </h2>
                  </div>
                  <div className="flex-1 min-h-0">
                    <MonthView onEventClick={setSelectedEvent} />
                  </div>
                </div>
              </div>
              <div className="h-64 min-h-[256px] md:h-72 xl:col-span-1 xl:h-full xl:min-h-[400px]">
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
        mode={editingEvent ? 'edit' : 'create'}
        initialValues={editingEvent ? mapCalendarEventToFormValues(editingEvent) : undefined}
        onClose={handleCloseAddModal} 
        onAdd={handleConfirmAdd} 
      />

      <EventDetailModal 
        event={selectedEvent} 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
        onEdit={handleStartEdit}
      />
    </div>
  );
}
