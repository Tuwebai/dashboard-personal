import { StateCreator } from 'zustand';
import type { AppStore, WeeklyPlanningSlice } from '../types';

export const createWeeklyPlanningSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  WeeklyPlanningSlice
> = (set) => ({
  weeklyFocus: '',
  weeklyFocusGoalId: '',
  weeklyTopPriorities: ['', '', ''],
  weeklyPriorityTaskIds: ['', '', ''],
  weeklyNotes: '',
  dailyTop3: ['', '', ''],
  dailyHighlightedTaskIds: ['', '', ''],
  dailyIntention: '',
  dailyQuickNotes: '',
  setWeeklyFocus: (weeklyFocus) =>
    set((state) => {
      state.weeklyFocus = weeklyFocus;
    }),
  setWeeklyFocusGoal: (goalId) =>
    set((state) => {
      state.weeklyFocusGoalId = goalId;
      const goal = state.personalGoals.find((item) => item.id === goalId);
      if (goal) {
        state.weeklyFocus = goal.title;
      }
    }),
  setWeeklyPriority: (index, value) =>
    set((state) => {
      state.weeklyTopPriorities[index] = value;
    }),
  setWeeklyPriorityTask: (index, taskId) =>
    set((state) => {
      state.weeklyPriorityTaskIds[index] = taskId;
      const task = state.tasks.find((item) => item.id === taskId);
      if (task) {
        state.weeklyTopPriorities[index] = task.title;
      }
    }),
  setWeeklyNotes: (weeklyNotes) =>
    set((state) => {
      state.weeklyNotes = weeklyNotes;
    }),
  setDailyTop3: (index, value) =>
    set((state) => {
      state.dailyTop3[index] = value;
      if (!value.trim()) {
        state.dailyHighlightedTaskIds[index] = '';
      }
    }),
  setDailyHighlightedTask: (index, taskId) =>
    set((state) => {
      state.dailyHighlightedTaskIds[index] = taskId;
      const task = state.tasks.find((item) => item.id === taskId);
      state.dailyTop3[index] = task ? task.title : '';
    }),
  setDailyIntention: (dailyIntention) =>
    set((state) => {
      state.dailyIntention = dailyIntention;
    }),
  setDailyQuickNotes: (dailyQuickNotes) =>
    set((state) => {
      state.dailyQuickNotes = dailyQuickNotes;
    }),
  resetWeeklyPlanning: () =>
    set((state) => {
      state.weeklyFocus = '';
      state.weeklyFocusGoalId = '';
      state.weeklyTopPriorities = ['', '', ''];
      state.weeklyPriorityTaskIds = ['', '', ''];
      state.weeklyNotes = '';
      state.dailyTop3 = ['', '', ''];
      state.dailyHighlightedTaskIds = ['', '', ''];
      state.dailyIntention = '';
      state.dailyQuickNotes = '';
    }),
});
