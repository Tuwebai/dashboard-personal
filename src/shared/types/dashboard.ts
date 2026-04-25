import type { CalendarEvent } from './calendar';
import type { CashFlowEntry } from './finances';
import type { Habit } from './habits';
import type { ActivityItem } from './system';
import type { TaskPriority } from './tasks';

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
  cashFlowData: CashFlowEntry[];
}
