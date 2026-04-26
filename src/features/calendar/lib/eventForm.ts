import { format } from 'date-fns';
import type { CalendarEvent } from '../../../shared/types';

export interface CalendarEventFormValues {
  title: string;
  startDate: string;
  startTime: string;
  duration: string;
  color: string;
  reminder: string;
}

function padTimeUnit(value: number) {
  return String(value).padStart(2, '0');
}

function toLocalDateTimeString(date: Date) {
  return `${date.getFullYear()}-${padTimeUnit(date.getMonth() + 1)}-${padTimeUnit(date.getDate())}T${padTimeUnit(date.getHours())}:${padTimeUnit(date.getMinutes())}:00`;
}

function parseLocalDateTime(startDate: string, startTime: string) {
  const [year, month, day] = startDate.split('-').map(Number);
  const [hours, minutes] = startTime.split(':').map(Number);

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

export function createDefaultCalendarEventFormValues(): CalendarEventFormValues {
  return {
    title: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    duration: '60',
    color: '#8b5cf6',
    reminder: 'none',
  };
}

export function buildCalendarEventSchedule(values: Pick<CalendarEventFormValues, 'startDate' | 'startTime' | 'duration'>) {
  const durationMinutes = Number.parseInt(values.duration, 10);
  const startAt = parseLocalDateTime(values.startDate, values.startTime);
  const endAt = new Date(startAt.getTime() + durationMinutes * 60_000);

  return {
    startDate: toLocalDateTimeString(startAt),
    endDate: toLocalDateTimeString(endAt),
  };
}

export function mapCalendarEventToFormValues(event: CalendarEvent): CalendarEventFormValues {
  const startAt = new Date(event.startDate);
  const endAt = new Date(event.endDate);
  const durationMinutes = Math.max(
    15,
    Math.round((endAt.getTime() - startAt.getTime()) / 60_000) || 60,
  );

  return {
    title: event.title,
    startDate: format(startAt, 'yyyy-MM-dd'),
    startTime: format(startAt, 'HH:mm'),
    duration: String(durationMinutes),
    color: event.color,
    reminder: event.reminders[0] ? String(event.reminders[0]) : 'none',
  };
}

export function parseCalendarEventReminders(reminder: string) {
  const reminderMinutes = Number.parseInt(reminder, 10);
  if (Number.isNaN(reminderMinutes) || reminderMinutes <= 0) {
    return [] as number[];
  }

  return [reminderMinutes];
}
