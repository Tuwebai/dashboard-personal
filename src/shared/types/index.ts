// ═══════════════════════════════════════════
// CORE TYPES
// ═══════════════════════════════════════════

export type ID = string;
export type ISODateString = string;

// ═══════════════════════════════════════════
// USER & PROFILE
// ═══════════════════════════════════════════

export interface User {
  id: ID;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  timezone: string;
  createdAt: ISODateString;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  accentColor: string;
  sidebarCollapsed: boolean;
  compactMode: boolean;
  weekStartsMonday: boolean;
  defaultTaskView: TaskView;
  notificationsEnabled: boolean;
  taskNotifications: boolean;
  habitNotifications: boolean;
  financeAlerts: boolean;
  calendarNotifications: boolean;
  language: 'en' | 'es';
}

// ═══════════════════════════════════════════
// TASKS
// ═══════════════════════════════════════════

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
export type TaskView = 'kanban' | 'list' | 'matrix' | 'table';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface Task {
  id: ID;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  goalId?: ID;
  dueDate?: ISODateString;
  dueTime?: string;
  tags: Tag[];
  subtasks: Subtask[];
  estimatedTime?: number; // minutes
  trackedTime?: number; // minutes
  recurrence: RecurrenceType;
  project?: string;
  progress: number; // 0-100
  createdAt: ISODateString;
  updatedAt: ISODateString;
  completedAt?: ISODateString;
  isArchived: boolean;
}

export interface Subtask {
  id: ID;
  taskId: ID;
  title: string;
  completed: boolean;
  order: number;
  subtasks?: Subtask[];
}

export interface Tag {
  id: ID;
  name: string;
  color: string;
}

// ═══════════════════════════════════════════
// HABITS
// ═══════════════════════════════════════════

export type HabitFrequency = 'daily' | 'specific_days' | 'x_per_week';
export type HabitCategory = 'health' | 'mind' | 'work' | 'social' | 'finance' | 'other';

export interface Habit {
  id: ID;
  name: string;
  description?: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  specificDays?: number[]; // 0=Sun, 1=Mon ... 6=Sat
  timesPerWeek?: number;
  targetValue?: number;
  isBoolean: boolean;
  category: HabitCategory;
  reminderTime?: string;
  startDate: ISODateString;
  endDate?: ISODateString;
  createdAt: ISODateString;
  isArchived: boolean;
}

export interface HabitLog {
  id: ID;
  habitId: ID;
  date: ISODateString;
  completed: boolean;
  value?: number;
  note?: string;
  createdAt: ISODateString;
}

export interface HabitStats {
  habitId: ID;
  currentStreak: number;
  longestStreak: number;
  completionRateWeek: number;
  completionRateMonth: number;
  completionRateYear: number;
  totalCompletions: number;
  heatmapData: HeatmapEntry[];
}

export interface HeatmapEntry {
  date: ISODateString;
  count: number;
  completed: boolean;
}

// ═══════════════════════════════════════════
// ROUTINES
// ═══════════════════════════════════════════

export type RoutineType = 'morning' | 'evening' | 'workout' | 'work' | 'weekend' | 'custom';

export interface Routine {
  id: ID;
  name: string;
  type: RoutineType;
  startTime?: string;
  endTime?: string;
  steps: RoutineStep[];
  totalDuration: number; // minutes
  createdAt: ISODateString;
  isActive: boolean;
}

export interface RoutineStep {
  id: ID;
  routineId: ID;
  title: string;
  duration: number; // minutes
  order: number;
  habitId?: ID;
  taskId?: ID;
  completed?: boolean;
}

export interface RoutineLog {
  id: ID;
  routineId: ID;
  date: ISODateString;
  completed: boolean;
  actualDuration?: number;
  stepsCompleted: number;
  totalSteps: number;
}

// ═══════════════════════════════════════════
// FINANCES
// ═══════════════════════════════════════════

export type TransactionType = 'income' | 'expense' | 'transfer';
export type AccountType = 'checking' | 'savings' | 'credit' | 'cash' | 'investment';

export interface FinancialAccount {
  id: ID;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  color: string;
  icon: string;
  isDefault: boolean;
  createdAt: ISODateString;
}

export interface Transaction {
  id: ID;
  type: TransactionType;
  amount: number;
  category: string;
  subcategory?: string;
  description: string;
  date: ISODateString;
  accountId: ID;
  toAccountId?: ID; // for transfers
  tags: string[];
  isRecurring: boolean;
  recurrenceType?: RecurrenceType;
  receiptUrl?: string;
  createdAt: ISODateString;
}

export interface Budget {
  id: ID;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  color: string;
  rollover: boolean;
  alertThreshold: number; // percentage (e.g., 80)
  createdAt: ISODateString;
}

export interface FinancialGoal {
  id: ID;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: ISODateString;
  color: string;
  icon: string;
  createdAt: ISODateString;
}

export interface FinancialSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  cashFlow: CashFlowEntry[];
}

export interface CashFlowEntry {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

// ═══════════════════════════════════════════
// CALENDAR
// ═══════════════════════════════════════════

export type CalendarView = 'month' | 'week' | 'day' | 'agenda';
export type EventCategory = 'work' | 'personal' | 'health' | 'finance' | 'social';
export type EventRecurrence = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface CalendarEvent {
  id: ID;
  title: string;
  description?: string;
  startDate: ISODateString;
  endDate: ISODateString;
  isAllDay: boolean;
  location?: string;
  color: string;
  category: EventCategory;
  recurrence: EventRecurrence;
  reminders: number[]; // minutes before
  linkedTaskId?: ID;
  linkedRoutineId?: ID;
  createdAt: ISODateString;
}

// ═══════════════════════════════════════════
// NOTES
// ═══════════════════════════════════════════

export interface Note {
  id: ID;
  title: string;
  content: string; // JSON content from Tiptap
  folderId?: ID;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  wordCount: number;
  readingTime: number; // minutes
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt?: ISODateString;
}

export interface NoteFolder {
  id: ID;
  name: string;
  parentId?: ID;
  color: string;
  icon: string;
  noteCount: number;
  children?: NoteFolder[];
  createdAt: ISODateString;
}

export interface NoteVersion {
  id: ID;
  noteId: ID;
  content: string;
  createdAt: ISODateString;
}

// ═══════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════

export type NotificationType = 'task' | 'habit' | 'finance' | 'calendar' | 'system';

export interface AppNotification {
  id: ID;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: ISODateString;
}

// ═══════════════════════════════════════════
// ACTIVITY
// ═══════════════════════════════════════════

export interface ActivityItem {
  id: ID;
  type: 'task_completed' | 'habit_checked' | 'note_created' | 'transaction_added' | 'goal_achieved' | 'routine_completed';
  title: string;
  description: string;
  icon: string;
  color: string;
  createdAt: ISODateString;
}

// ═══════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════

export interface DashboardStats {
  tasksCompletedToday: number;
  tasksTotal: number;
  currentStreak: number;
  longestStreak: number;
  netWorth: number;
  notesThisWeek: number;
  weeklyScore: number;
  upcomingEvents: CalendarEvent[];
  recentActivity: ActivityItem[];
  todayHabits: { habit: Habit; completed: boolean }[];
  tasksByPriority: { priority: TaskPriority; count: number }[];
  balanceHistory: { date: string; balance: number }[];
}

// ═══════════════════════════════════════════
// COMMAND PALETTE
// ═══════════════════════════════════════════

export interface CommandItem {
  id: ID;
  title: string;
  description?: string;
  icon: string;
  category: 'navigation' | 'action' | 'recent';
  action: () => void;
  shortcut?: string;
}
