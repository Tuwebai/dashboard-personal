import { StateCreator } from 'zustand';
import { format } from 'date-fns';
import type { AppStore, JournalingSlice } from '../types';
import type { JournalEntry } from '../../features/journaling/types';
import { genId } from '../../shared/lib/id';

export const createJournalingSlice: StateCreator<
  AppStore,
  [['zustand/immer', never], ['zustand/persist', unknown]],
  [],
  JournalingSlice
> = (set) => ({
  journalEntries: [],
  journalingContextDate: '',
  addJournalEntry: (entryData) =>
    set((state) => {
      const now = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
      const newEntry: JournalEntry = {
        ...entryData,
        id: genId(),
        createdAt: now,
      };

      state.journalEntries.unshift(newEntry);
    }),
  updateJournalEntry: (id, updates) =>
    set((state) => {
      const index = state.journalEntries.findIndex((entry) => entry.id === id);
      if (index !== -1) {
        Object.assign(state.journalEntries[index], updates);
      }
    }),
  deleteJournalEntry: (id) =>
    set((state) => {
      state.journalEntries = state.journalEntries.filter((entry) => entry.id !== id);
    }),
  setJournalingContextDate: (date) =>
    set((state) => {
      state.journalingContextDate = date;
    }),
});
