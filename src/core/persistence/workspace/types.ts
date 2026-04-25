import { CURRENT_USER, DEFAULT_SETTINGS } from '../../constants';
import type { AppStore } from '../../../stores/types';

export interface PersistedWorkspaceSnapshot {
  user: AppStore['user'];
  settings: AppStore['settings'];
  theme: AppStore['theme'];
  sidebarCollapsed: AppStore['sidebarCollapsed'];
  taskView: AppStore['taskView'];
  taskFilters: AppStore['taskFilters'];
  calendarView: AppStore['calendarView'];
  tasks: AppStore['tasks'];
  tags: AppStore['tags'];
  habits: AppStore['habits'];
  habitLogs: AppStore['habitLogs'];
  routines: AppStore['routines'];
  activeRoutineSession: AppStore['activeRoutineSession'];
  accounts: AppStore['accounts'];
  transactions: AppStore['transactions'];
  budgets: AppStore['budgets'];
  goals: AppStore['goals'];
  personalGoals: AppStore['personalGoals'];
  goalView: AppStore['goalView'];
  goalFilters: AppStore['goalFilters'];
  events: AppStore['events'];
  weeklyFocus: AppStore['weeklyFocus'];
  weeklyFocusGoalId: AppStore['weeklyFocusGoalId'];
  weeklyTopPriorities: AppStore['weeklyTopPriorities'];
  weeklyPriorityTaskIds: AppStore['weeklyPriorityTaskIds'];
  weeklyNotes: AppStore['weeklyNotes'];
  dailyTop3: AppStore['dailyTop3'];
  dailyHighlightedTaskIds: AppStore['dailyHighlightedTaskIds'];
  dailyIntention: AppStore['dailyIntention'];
  dailyQuickNotes: AppStore['dailyQuickNotes'];
  notes: AppStore['notes'];
  journalEntries: AppStore['journalEntries'];
  journalingContextDate: AppStore['journalingContextDate'];
  focusSessions: AppStore['focusSessions'];
  selectedFocusSessionId: AppStore['selectedFocusSessionId'];
  folders: AppStore['folders'];
  notifications: AppStore['notifications'];
  activities: AppStore['activities'];
}

export function getDefaultPersistedWorkspaceSnapshot(): PersistedWorkspaceSnapshot {
  return {
    user: { ...CURRENT_USER, createdAt: new Date().toISOString() },
    settings: { ...DEFAULT_SETTINGS },
    theme: 'dark',
    sidebarCollapsed: false,
    taskView: 'kanban',
    taskFilters: { priority: '', status: '', tags: [], search: '' },
    calendarView: 'month',
    tasks: [],
    tags: [],
    habits: [],
    habitLogs: [],
    routines: [],
    activeRoutineSession: null,
    accounts: [],
    transactions: [],
    budgets: [],
    goals: [],
    personalGoals: [],
    goalView: 'kanban',
    goalFilters: { horizon: '', status: '', priority: '' },
    events: [],
    weeklyFocus: '',
    weeklyFocusGoalId: '',
    weeklyTopPriorities: ['', '', ''],
    weeklyPriorityTaskIds: ['', '', ''],
    weeklyNotes: '',
    dailyTop3: ['', '', ''],
    dailyHighlightedTaskIds: ['', '', ''],
    dailyIntention: '',
    dailyQuickNotes: '',
    notes: [],
    journalEntries: [],
    journalingContextDate: '',
    focusSessions: [],
    selectedFocusSessionId: null,
    folders: [],
    notifications: [],
    activities: [],
  };
}
