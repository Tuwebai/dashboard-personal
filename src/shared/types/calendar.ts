import type { ID, ISODateString } from './common';

export type CalendarView = 'month' | 'week' | 'day' | 'agenda';
export type EventCategory = 'work' | 'personal' | 'health' | 'finance' | 'social';
export type EventRecurrence = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface CalendarEvent {
  id: ID;
  title: string;
  description?: string;
  startDate: ISODateString;
  endDate: ISODateString;
  isAllDay: boolean;
  location?: string;
  color: string;
  category: EventCategory;
  recurrence: EventRecurrence;
  reminders: number[];
  linkedTaskId?: ID;
  linkedRoutineId?: ID;
  createdAt: ISODateString;
}
