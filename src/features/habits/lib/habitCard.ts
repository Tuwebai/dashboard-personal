import type { HabitLog } from '../../../shared/types';
import { formatLocalDateKey } from '../../../shared/lib/date';

type HabitDayItem = {
  date: string;
  dayName: string;
  completed: boolean;
  isToday: boolean;
};

const WEEK_WINDOW_DAYS = 7;

export function getHabitWeekDays(habitId: string, habitLogs: HabitLog[], locale: string): HabitDayItem[] {
  const logsByDate = new Map(
    habitLogs
      .filter((log) => log.habitId === habitId)
      .map((log) => [log.date, log.completed]),
  );
  const today = new Date();

  return Array.from({ length: WEEK_WINDOW_DAYS }, (_, index) => {
    const day = new Date(today);
    day.setHours(12, 0, 0, 0);
    day.setDate(today.getDate() - (WEEK_WINDOW_DAYS - 1 - index));
    const date = formatLocalDateKey(day);

    return {
      date,
      dayName: day.toLocaleDateString(locale, { weekday: 'narrow' }),
      completed: logsByDate.get(date) ?? false,
      isToday: index === WEEK_WINDOW_DAYS - 1,
    };
  });
}

export function getCurrentHabitStreak(habitId: string, habitLogs: HabitLog[]) {
  const completedDates = new Set(
    habitLogs
      .filter((log) => log.habitId === habitId && log.completed)
      .map((log) => log.date),
  );
  const today = new Date();
  let streak = 0;

  for (let offset = 0; ; offset += 1) {
    const day = new Date(today);
    day.setHours(12, 0, 0, 0);
    day.setDate(today.getDate() - offset);
    const date = formatLocalDateKey(day);

    if (!completedDates.has(date)) {
      break;
    }

    streak += 1;
  }

  return streak;
}
