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
import {
  createAppPersistenceStorage,
  LOCAL_WORKSPACE_STORAGE_VERSION,
  type PersistedAppStore,
  STORE_STORAGE_KEY,
} from '../core/persistence/storage';
import { isPersistedWorkspaceSnapshot, pickPersistedWorkspace } from '../core/persistence/workspace';
import { shouldUseFirebasePersistence } from '../core/persistence/config';
import { emitWorkspaceReadonlyBlockedEvent } from '../core/persistence/workspaceReadonly';

function isPersistedAppStore(value: unknown): value is PersistedAppStore {
  return isPersistedWorkspaceSnapshot(value);
}

export const useAppStore = create<AppStore>()(
  immer(
    persist(
      (set, get, api) => {
        const guardedSet = ((...args: Parameters<typeof set>) => {
          if (shouldUseFirebasePersistence() && useAppStore.getState().workspaceReadOnly) {
            emitWorkspaceReadonlyBlockedEvent();
            return;
          }

          return set(...args);
        }) as typeof set;

        return {
          ...createAuthSlice(set, get, api),
          ...createUISlice(set, get, api),
          ...createTaskSlice(guardedSet, get, api),
          ...createHabitSlice(guardedSet, get, api),
          ...createRoutineSlice(guardedSet, get, api),
          ...createFinanceSlice(guardedSet, get, api),
          ...createCalendarSlice(guardedSet, get, api),
          ...createWeeklyPlanningSlice(guardedSet, get, api),
          ...createNoteSlice(guardedSet, get, api),
          ...createJournalingSlice(guardedSet, get, api),
          ...createFocusSlice(guardedSet, get, api),
          ...createActivitySlice(guardedSet, get, api),
          ...createPersonalGoalSlice(guardedSet, get, api),
        };
      },
      {
        name: STORE_STORAGE_KEY,
        storage: createAppPersistenceStorage(),
        version: LOCAL_WORKSPACE_STORAGE_VERSION,
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
          if (version < 9 && isPersistedAppStore(state)) {
            state = {
              ...state,
              settings: {
                ...state.settings,
                theme: typeof (persistedState as { theme?: unknown }).theme === 'string'
                  ? (persistedState as { theme?: AppStore['settings']['theme'] }).theme ?? state.settings.theme
                  : state.settings.theme,
                sidebarCollapsed: typeof (persistedState as { sidebarCollapsed?: unknown }).sidebarCollapsed === 'boolean'
                  ? (persistedState as { sidebarCollapsed?: boolean }).sidebarCollapsed ?? state.settings.sidebarCollapsed
                  : state.settings.sidebarCollapsed,
              },
            };
          }
          return state as AppStore;
        },
        partialize: (state) => pickPersistedWorkspace(state),
      }
    )
  )
);
