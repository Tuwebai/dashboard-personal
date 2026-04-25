import { StateCreator } from 'zustand';
import { RoutineSlice, AppStore } from '../types';
import { genId } from '../../shared/lib/id';

import { format } from 'date-fns';

export const createRoutineSlice: StateCreator<
  AppStore,
  [["zustand/immer", never], ["zustand/persist", unknown]],
  [],
  RoutineSlice
> = (set) => ({
  routines: [],
  activeRoutineSession: null,

  addRoutine: (routineData) => set(state => {
    state.routines.push({
      ...routineData,
      id: genId(),
      createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    });
  }),

  updateRoutine: (id, updates) => set(state => {
    const idx = state.routines.findIndex(r => r.id === id);
    if (idx !== -1) Object.assign(state.routines[idx], updates);
  }),

  deleteRoutine: (id) => set(state => {
    state.routines = state.routines.filter(r => r.id !== id);
  }),

  reorderRoutineSteps: (routineId, steps) => set(state => {
    const routine = state.routines.find(r => r.id === routineId);
    if (routine) routine.steps = steps;
  }),

  startRoutineSession: (routineId) => set(state => {
    state.activeRoutineSession = { routineId, currentStepIndex: 0, startTime: Date.now() };
  }),

  completeRoutineStep: (routineId, stepIndex) => set(state => {
    const routine = state.routines.find(r => r.id === routineId);
    if (routine && routine.steps[stepIndex]) {
      routine.steps[stepIndex].completed = true;
    }
    if (state.activeRoutineSession) {
      state.activeRoutineSession.currentStepIndex = stepIndex + 1;
    }
  }),

  endRoutineSession: () => set(state => {
    state.activeRoutineSession = null;
  }),
});
