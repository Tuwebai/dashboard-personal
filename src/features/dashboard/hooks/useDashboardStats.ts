import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../../stores/useAppStore';
import { useDashboardTaskStats } from './useDashboardTaskStats';
import { useDashboardHabitStats } from './useDashboardHabitStats';
import { useDashboardFinanceStats } from './useDashboardFinanceStats';
import { useDashboardActivityStats } from './useDashboardActivityStats';

export function useDashboardStats() {
  const { tasks, habits, habitLogs, accounts, transactions, notes, events, personalGoals, journalEntries, focusSessions, setActiveModule, setSelectedTask, logHabit } = useAppStore(
    useShallow((state) => ({
      tasks: state.tasks,
      habits: state.habits,
      habitLogs: state.habitLogs,
      accounts: state.accounts,
      transactions: state.transactions,
      notes: state.notes,
      events: state.events,
      personalGoals: state.personalGoals,
      journalEntries: state.journalEntries,
      focusSessions: state.focusSessions,
      setActiveModule: state.setActiveModule,
      setSelectedTask: state.setSelectedTask,
      logHabit: state.logHabit,
    }))
  );

  const taskStats = useDashboardTaskStats(tasks);
  const habitStats = useDashboardHabitStats(habits, habitLogs);
  const financeStats = useDashboardFinanceStats(accounts, transactions);
  const activityStats = useDashboardActivityStats(
    tasks,
    habits,
    habitLogs,
    transactions,
    notes,
    events,
    personalGoals,
    journalEntries,
    focusSessions,
  );

  const weeklyScore = useMemo(
    () =>
      Math.min(
        100,
        Math.round(
          taskStats.tasksCompletedToday * 10 +
            habitStats.habitCompletionRate * 0.5 +
            activityStats.notesThisWeek * 5
        )
      ),
    [activityStats.notesThisWeek, habitStats.habitCompletionRate, taskStats.tasksCompletedToday]
  );

  return {
    ...taskStats,
    ...habitStats,
    ...financeStats,
    ...activityStats,
    weeklyScore,
    setActiveModule,
    setSelectedTask,
    logHabit,
  };
}
