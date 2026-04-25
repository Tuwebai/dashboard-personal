import type { ID, ISODateString } from './common';

export type HabitFrequency = 'daily' | 'specific_days' | 'x_per_week';
export type HabitCategory = 'health' | 'mind' | 'work' | 'social' | 'finance' | 'other';

export interface Habit {
  id: ID;
  name: string;
  description?: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  specificDays?: number[];
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
