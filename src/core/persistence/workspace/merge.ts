import { CURRENT_USER, DEFAULT_SETTINGS } from '../../constants';
import type { AppStore } from '../../../stores/types';
import type { PersistedWorkspaceSnapshot } from './types';

export function mergePersistedWorkspace(
  currentState: AppStore,
  snapshot: PersistedWorkspaceSnapshot,
): Partial<AppStore> {
  const legacySnapshot = snapshot as PersistedWorkspaceSnapshot & {
    theme?: AppStore['settings']['theme'];
    sidebarCollapsed?: boolean;
  };

  return {
    user: {
      ...currentState.user,
      ...snapshot.user,
      id: snapshot.user.id || currentState.user.id,
      name: snapshot.user.name || CURRENT_USER.name,
      email: snapshot.user.email || '',
      avatar: snapshot.user.avatar ?? '',
      bio: snapshot.user.bio ?? '',
      timezone: snapshot.user.timezone || CURRENT_USER.timezone,
    },
    settings: {
      ...DEFAULT_SETTINGS,
      ...currentState.settings,
      ...snapshot.settings,
      theme: legacySnapshot.theme ?? snapshot.settings.theme ?? currentState.settings.theme,
      sidebarCollapsed: legacySnapshot.sidebarCollapsed ?? snapshot.settings.sidebarCollapsed ?? currentState.settings.sidebarCollapsed,
    },
    taskView: snapshot.taskView,
    calendarView: snapshot.calendarView,
    tasks: snapshot.tasks,
    tags: snapshot.tags,
    habits: snapshot.habits,
    habitLogs: snapshot.habitLogs,
    routines: snapshot.routines,
    accounts: snapshot.accounts,
    transactions: snapshot.transactions,
    budgets: snapshot.budgets,
    goals: snapshot.goals,
    personalGoals: snapshot.personalGoals,
    goalView: snapshot.goalView,
    events: snapshot.events,
    weeklyFocus: snapshot.weeklyFocus,
    weeklyFocusGoalId: snapshot.weeklyFocusGoalId,
    weeklyTopPriorities: snapshot.weeklyTopPriorities,
    weeklyPriorityTaskIds: snapshot.weeklyPriorityTaskIds,
    weeklyNotes: snapshot.weeklyNotes,
    dailyTop3: snapshot.dailyTop3,
    dailyHighlightedTaskIds: snapshot.dailyHighlightedTaskIds,
    dailyIntention: snapshot.dailyIntention,
    dailyQuickNotes: snapshot.dailyQuickNotes,
    notes: snapshot.notes,
    journalEntries: snapshot.journalEntries,
    focusSessions: snapshot.focusSessions,
    folders: snapshot.folders,
  };
}
