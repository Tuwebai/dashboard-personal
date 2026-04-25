import { StateCreator } from 'zustand';
import { genId } from '../../shared/lib/id';
import type { AppStore, PersonalGoalSlice } from '../types';

export const createPersonalGoalSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  PersonalGoalSlice
> = (set) => ({
  personalGoals: [],
  goalView: 'kanban',
  goalFilters: {
    horizon: '',
    status: '',
    priority: '',
  },
  addPersonalGoal: (goal) =>
    set((state) => {
      state.personalGoals.unshift({ ...goal, id: genId(), createdAt: new Date().toISOString() });
    }),
  updatePersonalGoal: (id, updates) =>
    set((state) => {
      const goal = state.personalGoals.find((item) => item.id === id);
      if (goal) Object.assign(goal, updates);
    }),
  deletePersonalGoal: (id) =>
    set((state) => {
      state.personalGoals = state.personalGoals.filter((item) => item.id !== id);
    }),
  setGoalView: (view) =>
    set((state) => {
      state.goalView = view;
    }),
  setGoalFilters: (filters) =>
    set((state) => {
      state.goalFilters = { ...state.goalFilters, ...filters };
    }),
});
