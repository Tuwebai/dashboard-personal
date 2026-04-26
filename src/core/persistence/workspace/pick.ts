import type { AppStore } from '../../../stores/types';
import type { PersistedWorkspaceSnapshot } from './types';

export function pickPersistedWorkspace(state: AppStore): PersistedWorkspaceSnapshot {
  return {
    user: state.user,
    settings: state.settings,
    taskView: state.taskView,
    calendarView: state.calendarView,
    tasks: state.tasks,
    tags: state.tags,
    habits: state.habits,
    habitLogs: state.habitLogs,
    routines: state.routines,
    accounts: state.accounts,
    transactions: state.transactions,
    budgets: state.budgets,
    goals: state.goals,
    personalGoals: state.personalGoals,
    goalView: state.goalView,
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
    focusSessions: state.focusSessions,
    folders: state.folders,
  };
}
