import type {
  Task, Habit, HabitLog, Routine, RoutineStep,
  FinancialAccount, Transaction, Budget, FinancialGoal,
  CalendarEvent, Note, NoteFolder,
  AppNotification, ActivityItem, UserSettings,
  TaskView, CalendarView, Tag, Subtask
} from '../shared/types';
import type { PersonalGoal } from '../features/goals/types';
import type { WeeklyPlanningState } from '../features/weekly-planning/types';
import type { JournalEntry } from '../features/journaling/types';
import type { FocusSession } from '../features/focus/types';
import { CURRENT_USER } from '../core/constants';

export type {
  Task, Habit, HabitLog, Routine, RoutineStep,
  FinancialAccount, Transaction, Budget, FinancialGoal,
  CalendarEvent, Note, NoteFolder,
  AppNotification, ActivityItem, UserSettings,
  TaskView, CalendarView, Tag, Subtask
};
export type { PersonalGoal };
export type { WeeklyPlanningState };
export type { JournalEntry };
export type { FocusSession };

export interface AuthSlice {
  user: typeof CURRENT_USER;
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  updateUser: (updates: Partial<typeof CURRENT_USER>) => void;
}

export interface UISlice {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  activeModule: string;
  theme: 'dark' | 'light';
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setActiveModule: (module: string) => void;
  toggleTheme: () => void;
}

export interface TaskSlice {
  tasks: Task[];
  taskView: TaskView;
  selectedTaskId: string | null;
  taskFilters: { priority: string; status: string; tags: string[]; search: string };
  tags: Tag[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  setTaskView: (view: TaskView) => void;
  setSelectedTask: (id: string | null) => void;
  setTaskFilters: (filters: Partial<TaskSlice['taskFilters']>) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  moveTask: (taskId: string, newStatus: Task['status']) => void;
  bulkUpdateTasks: (ids: string[], updates: Partial<Task>) => void;
}

export interface HabitSlice {
  habits: Habit[];
  habitLogs: HabitLog[];
  todayDate: string;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  logHabit: (habitId: string, date: string, completed: boolean, value?: number) => void;
  getTodayHabitLog: (habitId: string) => HabitLog | undefined;
}

export interface RoutineSlice {
  routines: Routine[];
  activeRoutineSession: { routineId: string; currentStepIndex: number; startTime: number } | null;
  addRoutine: (routine: Omit<Routine, 'id' | 'createdAt'>) => void;
  updateRoutine: (id: string, updates: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  reorderRoutineSteps: (routineId: string, steps: RoutineStep[]) => void;
  startRoutineSession: (routineId: string) => void;
  completeRoutineStep: (routineId: string, stepIndex: number) => void;
  endRoutineSession: () => void;
}

export interface FinanceSlice {
  accounts: FinancialAccount[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: FinancialGoal[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addAccount: (account: Omit<FinancialAccount, 'id' | 'createdAt'>) => void;
  updateAccount: (id: string, updates: Partial<FinancialAccount>) => void;
  deleteAccount: (id: string) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  addGoal: (goal: Omit<FinancialGoal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<FinancialGoal>) => void;
}

export interface PersonalGoalSlice {
  personalGoals: PersonalGoal[];
  goalView: TaskView;
  goalFilters: {
    horizon: string;
    status: string;
    priority: string;
  };
  addPersonalGoal: (goal: Omit<PersonalGoal, 'id' | 'createdAt'>) => void;
  updatePersonalGoal: (id: string, updates: Partial<PersonalGoal>) => void;
  deletePersonalGoal: (id: string) => void;
  setGoalView: (view: TaskView) => void;
  setGoalFilters: (filters: Partial<PersonalGoalSlice['goalFilters']>) => void;
}

export interface CalendarSlice {
  events: CalendarEvent[];
  calendarView: CalendarView;
  calendarDate: string;
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  setCalendarView: (view: CalendarView) => void;
  setCalendarDate: (date: string) => void;
}

export interface WeeklyPlanningSlice extends WeeklyPlanningState {
  setWeeklyFocus: (weeklyFocus: string) => void;
  setWeeklyFocusGoal: (goalId: string) => void;
  setWeeklyPriority: (index: number, value: string) => void;
  setWeeklyPriorityTask: (index: number, value: string) => void;
  setWeeklyNotes: (weeklyNotes: string) => void;
  setDailyTop3: (index: number, value: string) => void;
  setDailyHighlightedTask: (index: number, taskId: string) => void;
  setDailyIntention: (dailyIntention: string) => void;
  setDailyQuickNotes: (dailyQuickNotes: string) => void;
  resetWeeklyPlanning: () => void;
}

export interface NoteSlice {
  notes: Note[];
  folders: NoteFolder[];
  selectedNoteId: string | null;
  selectedFolderId: string | null;
  noteSearch: string;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setSelectedNote: (id: string | null) => void;
  setSelectedFolder: (id: string | null) => void;
  setNoteSearch: (search: string) => void;
  addFolder: (folder: Omit<NoteFolder, 'id' | 'createdAt' | 'noteCount'>) => void;
  updateFolder: (id: string, updates: Partial<NoteFolder>) => void;
  deleteFolder: (id: string) => void;
}

export interface JournalingSlice {
  journalEntries: JournalEntry[];
  journalingContextDate: string;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;
  setJournalingContextDate: (date: string) => void;
}

export interface FocusSlice {
  focusSessions: FocusSession[];
  selectedFocusSessionId: string | null;
  addFocusSession: (session: Omit<FocusSession, 'id' | 'createdAt'>) => void;
  updateFocusSession: (id: string, updates: Partial<FocusSession>) => void;
  deleteFocusSession: (id: string) => void;
  setSelectedFocusSession: (id: string | null) => void;
  pauseFocusSession: (id: string) => void;
  resumeFocusSession: (id: string) => void;
  finishFocusSession: (id: string) => void;
}

export interface ActivitySlice {
  notifications: AppNotification[];
  activities: ActivityItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addActivity: (activity: Omit<ActivityItem, 'id' | 'createdAt'>) => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'createdAt'>) => void;
}

export type AppStore = AuthSlice & UISlice & TaskSlice & HabitSlice & RoutineSlice & FinanceSlice & CalendarSlice & WeeklyPlanningSlice & NoteSlice & JournalingSlice & FocusSlice & ActivitySlice & PersonalGoalSlice;
