import { StateCreator } from 'zustand';
import { HabitSlice, AppStore } from '../types';
import { genId } from '../../shared/lib/id';

import { format } from 'date-fns';

export const createHabitSlice: StateCreator<
  AppStore,
  [["zustand/immer", never], ["zustand/persist", unknown]],
  [],
  HabitSlice
> = (set, get) => ({
  habits: [],
  habitLogs: [],
  todayDate: format(new Date(), 'yyyy-MM-dd'),

  addHabit: (habitData) => set(state => {
    state.habits.push({
      ...habitData,
      id: genId(),
      createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    });
  }),

  updateHabit: (id, updates) => set(state => {
    const idx = state.habits.findIndex(h => h.id === id);
    if (idx !== -1) Object.assign(state.habits[idx], updates);
  }),

  deleteHabit: (id) => set(state => {
    state.habits = state.habits.filter(h => h.id !== id);
  }),

  logHabit: (habitId, date, completed, value) => set(state => {
    const existingIdx = state.habitLogs.findIndex(l => l.habitId === habitId && l.date === date);
    if (existingIdx !== -1) {
      state.habitLogs[existingIdx].completed = completed;
      state.habitLogs[existingIdx].value = value;
    } else {
      state.habitLogs.push({
        id: genId(),
        habitId,
        date,
        completed,
        value,
        createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      });
    }
  }),

  getTodayHabitLog: (habitId) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return get().habitLogs.find(l => l.habitId === habitId && l.date === today);
  },
});
