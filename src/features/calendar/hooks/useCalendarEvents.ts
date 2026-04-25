import { useMemo, useCallback } from 'react';
import { useAppStore } from '../../../stores/useAppStore';
import { isSameDay, isAfter, startOfDay, parseISO } from 'date-fns';
import type { CalendarEvent } from '../../../shared/types';

export function useCalendarEvents() {
  const events = useAppStore(s => s.events);
  const addEvent = useAppStore(s => s.addEvent);
  const deleteEvent = useAppStore(s => s.deleteEvent);

  const eventsByDate = useMemo(() => {
    const groups: Record<string, CalendarEvent[]> = {};
    events.forEach(event => {
      const dateKey = event.startDate.split('T')[0];
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(event);
    });
    return groups;
  }, [events]);

  const getEventsForDay = useCallback((day: Date) => {
    const dateKey = day.toISOString().split('T')[0];
    return eventsByDate[dateKey] || [];
  }, [eventsByDate]);

  const sortedEvents = useMemo(() => 
    [...events].sort((a, b) => a.startDate.localeCompare(b.startDate)),
  [events]);

  const getUpcomingEvents = useCallback((date: Date, limit = 5) => {
    return events
      .filter(event => isAfter(parseISO(event.startDate), startOfDay(date)) && !isSameDay(parseISO(event.startDate), date))
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .slice(0, limit);
  }, [events]);

  const getEventsForDate = useCallback((date: Date) => {
    return events
      .filter(event => isSameDay(parseISO(event.startDate), date))
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [events]);

  return {
    events,
    eventsByDate,
    sortedEvents,
    addEvent,
    deleteEvent,
    getEventsForDay,
    getUpcomingEvents,
    getEventsForDate
  };
}
