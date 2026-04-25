import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { AppStore } from './types';

import { createAuthSlice } from './slices/authSlice';
import { createUISlice } from './slices/uiSlice';
import { createTaskSlice } from './slices/taskSlice';
import { createHabitSlice } from './slices/habitSlice';
import { createRoutineSlice } from './slices/routineSlice';
import { createFinanceSlice } from './slices/financeSlice';
import { createCalendarSlice } from './slices/calendarSlice';
import { createNoteSlice } from './slices/noteSlice';
import { createActivitySlice } from './slices/activitySlice';
import { createPersonalGoalSlice } from './slices/personalGoalSlice';
import { createWeeklyPlanningSlice } from './slices/weeklyPlanningSlice';
import { createJournalingSlice } from './slices/journalingSlice';
import { createFocusSlice } from './slices/focusSlice';
import { createAppPersistenceStorage, type PersistedAppStore, STORE_STORAGE_KEY } from '../core/persistence/storage';

function isPersistedAppStore(value: unknown): value is PersistedAppStore {
  return typeof value === 'object' && value !== null;
}

export const useAppStore = create<AppStore>()(
  immer(
    persist(
      (...a) => ({
        ...createAuthSlice(...a),
        ...createUISlice(...a),
        ...createTaskSlice(...a),
        ...createHabitSlice(...a),
        ...createRoutineSlice(...a),
        ...createFinanceSlice(...a),
        ...createCalendarSlice(...a),
        ...createWeeklyPlanningSlice(...a),
        ...createNoteSlice(...a),
        ...createJournalingSlice(...a),
        ...createFocusSlice(...a),
        ...createActivitySlice(...a),
        ...createPersonalGoalSlice(...a),
      }),
      {
        name: STORE_STORAGE_KEY,
        storage: createAppPersistenceStorage(),
        version: 8,
        migrate: (persistedState: unknown, version) => {
          let state = isPersistedAppStore(persistedState) ? persistedState : {};

          if (version < 2) {
            state = {
              ...state,
              personalGoals: [],
              goalView: 'kanban',
              goalFilters: { horizon: '', status: '', priority: '' },
            };
          }
          if (version < 3) {
            state = {
              ...state,
              weeklyFocus: '',
              weeklyFocusGoalId: '',
              weeklyTopPriorities: ['', '', ''],
              weeklyPriorityTaskIds: ['', '', ''],
              weeklyNotes: '',
            };
          }
          if (version < 4) {
            state = {
              ...state,
              dailyTop3: ['', '', ''],
              dailyIntention: '',
              dailyQuickNotes: '',
            };
          }
          if (version < 5) {
            state = {
              ...state,
              dailyHighlightedTaskIds: ['', '', ''],
            };
          }
          if (version < 6) {
            state = {
              ...state,
              journalEntries: [],
            };
          }
          if (version < 7) {
            state = {
              ...state,
              journalingContextDate: '',
            };
          }
          if (version < 8) {
            state = {
              ...state,
              focusSessions: [],
              selectedFocusSessionId: null,
            };
          }
          return state as AppStore;
        },
        partialize: (state) => ({
          user: state.user,
          settings: state.settings,
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
          taskView: state.taskView,
          taskFilters: state.taskFilters,
          calendarView: state.calendarView,
          tasks: state.tasks,
          tags: state.tags,
          habits: state.habits,
          habitLogs: state.habitLogs,
          routines: state.routines,
          activeRoutineSession: state.activeRoutineSession,
          accounts: state.accounts,
          transactions: state.transactions,
          budgets: state.budgets,
          goals: state.goals,
          personalGoals: state.personalGoals,
          goalView: state.goalView,
          goalFilters: state.goalFilters,
          events: state.events,
          weeklyFocus: state.weeklyFocus,
          weeklyFocusGoalId: state.weeklyFocusGoalId,
          weeklyTopPriorities: state.weeklyTopPriorities,
          weeklyPriorityTaskIds: state.weeklyPriorityTaskIds,
          weeklyNotes: state.weeklyNotes,
          dailyTop3: state.dailyTop3,
          dailyHighlightedTaskIds: state.dailyHighlightedTaskIds,
          dailyIntention: state.dailyIntention,
          dailyQuickNotes: state.dailyQuickNotes,
          notes: state.notes,
          journalEntries: state.journalEntries,
          journalingContextDate: state.journalingContextDate,
          focusSessions: state.focusSessions,
          selectedFocusSessionId: state.selectedFocusSessionId,
          folders: state.folders,
          notifications: state.notifications,
          activities: state.activities,
        }),
      }
    )
  )
);
