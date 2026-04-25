import { StateCreator } from 'zustand';
import { format } from 'date-fns';
import { genId } from '../../shared/lib/id';
import type { FocusSession } from '../../features/focus/types';
import type { AppStore, FocusSlice } from '../types';

export const createFocusSlice: StateCreator<
  AppStore,
  [['zustand/immer', never], ['zustand/persist', unknown]],
  [],
  FocusSlice
> = (set) => ({
  focusSessions: [],
  selectedFocusSessionId: null,
  addFocusSession: (sessionData) =>
    set((state) => {
      const now = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
      const session: FocusSession = {
        ...sessionData,
        id: genId(),
        createdAt: now,
      };

      state.focusSessions.unshift(session);
      state.selectedFocusSessionId = session.id;
    }),
  updateFocusSession: (id, updates) =>
    set((state) => {
      const index = state.focusSessions.findIndex((session) => session.id === id);
      if (index !== -1) {
        Object.assign(state.focusSessions[index], updates);
      }
    }),
  deleteFocusSession: (id) =>
    set((state) => {
      state.focusSessions = state.focusSessions.filter((session) => session.id !== id);
      if (state.selectedFocusSessionId === id) {
        state.selectedFocusSessionId = null;
      }
    }),
  setSelectedFocusSession: (id) =>
    set((state) => {
      state.selectedFocusSessionId = id;
    }),
  pauseFocusSession: (id) =>
    set((state) => {
      const session = state.focusSessions.find((item) => item.id === id);
      if (!session || session.status !== 'active' || !session.lastResumedAt) return;

      const elapsedDelta = Math.max(
        0,
        Math.floor((new Date().getTime() - new Date(session.lastResumedAt).getTime()) / 1000),
      );

      session.elapsedSeconds += elapsedDelta;
      session.status = 'paused';
      delete session.lastResumedAt;
    }),
  resumeFocusSession: (id) =>
    set((state) => {
      const session = state.focusSessions.find((item) => item.id === id);
      if (!session || session.status !== 'paused') return;

      session.status = 'active';
      session.lastResumedAt = new Date().toISOString();
    }),
  finishFocusSession: (id) =>
    set((state) => {
      const session = state.focusSessions.find((item) => item.id === id);
      if (!session || (session.status !== 'active' && session.status !== 'paused')) return;

      if (session.status === 'active' && session.lastResumedAt) {
        const elapsedDelta = Math.max(
          0,
          Math.floor((new Date().getTime() - new Date(session.lastResumedAt).getTime()) / 1000),
        );
        session.elapsedSeconds += elapsedDelta;
      }

      session.status = 'completed';
      delete session.lastResumedAt;
      session.endedAt = new Date().toISOString();
      if (state.selectedFocusSessionId === id) {
        state.selectedFocusSessionId = null;
      }
    }),
});
