import { useMemo } from 'react';
import { format } from 'date-fns';
import { getHabitStats } from '../../../shared/lib/helpers';
import type { Habit, HabitLog } from '../../../shared/types';

export function useDashboardHabitStats(habits: Habit[], habitLogs: HabitLog[]) {
  return useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayHabits = habits.filter((habit) => !habit.isArchived).map((habit) => {
      const log = habitLogs.find((entry) => entry.habitId === habit.id && entry.date === today);
      return { habit, completed: log?.completed ?? false };
    });
    const completedHabits = todayHabits.filter((habit) => habit.completed).length;
    const habitCompletionRate = todayHabits.length > 0 ? (completedHabits / todayHabits.length) * 100 : 0;
    const allStats = habits.map((habit) => getHabitStats(habit.id, habitLogs));
    const maxStreak = Math.max(...allStats.map((stat) => stat.currentStreak), 0);
    const longestEver = Math.max(...allStats.map((stat) => stat.longestStreak), 0);

    return {
      todayHabits,
      completedHabits,
      habitCompletionRate,
      maxStreak,
      longestEver,
    };
  }, [habits, habitLogs]);
}
