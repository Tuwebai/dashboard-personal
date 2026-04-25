import { StateCreator } from 'zustand';
import { CalendarSlice, AppStore } from '../types';
import { genId } from '../../shared/lib/id';

import { format } from 'date-fns';

export const createCalendarSlice: StateCreator<
  AppStore,
  [["zustand/immer", never], ["zustand/persist", unknown]],
  [],
  CalendarSlice
> = (set) => ({
  events: [],
  calendarView: 'month',
  calendarDate: format(new Date(), 'yyyy-MM-dd'),

  addEvent: (eventData) => set(state => {
    state.events.push({
      ...eventData,
      id: genId(),
      createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    });
  }),

  updateEvent: (id, updates) => set(state => {
    const idx = state.events.findIndex(e => e.id === id);
    if (idx !== -1) Object.assign(state.events[idx], updates);
  }),

  deleteEvent: (id) => set(state => {
    state.events = state.events.filter(e => e.id !== id);
  }),

  setCalendarView: (view) => set(state => { state.calendarView = view; }),
  setCalendarDate: (date) => set(state => { state.calendarDate = date; }),
});
