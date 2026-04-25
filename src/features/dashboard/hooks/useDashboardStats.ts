import { useMemo } from 'react';
import { format, isToday, parseISO } from 'date-fns';
import { useAppStore } from '../../../stores/useAppStore';
import { getHabitStats, PRIORITY_COLORS } from '../../../shared/lib/helpers';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getDerivedAccounts } from '../../finances/lib/accounts';

const PRIORITY_ORDER = ['critical', 'high', 'medium', 'low'] as const;

export function useDashboardStats() {
  const { tasks, habits, habitLogs, accounts, transactions, notes, events, activities, setActiveModule, logHabit } = useAppStore();

  const stats = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');

    // Tasks
    const tasksToday = tasks.filter(t => t.dueDate === today);
    const tasksCompletedToday = tasks.filter(t => t.completedAt && isToday(parseISO(t.completedAt))).length;
    const totalTasksToday = tasksToday.length;

    // Habits
    const todayHabits = habits.filter(h => !h.isArchived).map(h => {
      const log = habitLogs.find(l => l.habitId === h.id && l.date === today);
      return { habit: h, completed: log?.completed ?? false };
    });
    const completedHabits = todayHabits.filter(h => h.completed).length;
    const habitCompletionRate = todayHabits.length > 0 ? (completedHabits / todayHabits.length) * 100 : 0;

    const allStats = habits.map(h => getHabitStats(h.id, habitLogs));
    const maxStreak = Math.max(...allStats.map(s => s.currentStreak), 0);
    const longestEver = Math.max(...allStats.map(s => s.longestStreak), 0);

    // Finances
    const derivedAccounts = getDerivedAccounts(accounts, transactions);
    const netWorth = derivedAccounts.reduce((sum, account) => sum + account.derivedBalance, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentTransactions = transactions.filter(t => new Date(t.date) >= thirtyDaysAgo);

    const netFlow30d = recentTransactions.reduce((acc, tx) => {
      if (tx.type === 'income') return acc + tx.amount;
      if (tx.type === 'expense') return acc - tx.amount;
      return acc;
    }, 0);

    const pastNetWorth = netWorth - netFlow30d;
    let netWorthTrend = 0;
    if (pastNetWorth > 0) {
      netWorthTrend = (netFlow30d / pastNetWorth) * 100;
    } else if (netWorth > 0) {
      netWorthTrend = 100;
    }

    const isTrendPositive = netWorthTrend >= 0;
    const TrendIcon = isTrendPositive ? TrendingUp : TrendingDown;

    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const balanceHistory = sortedTransactions.reduce<{ date: string; balance: number }[]>(
      (history, transaction) => {
        const previousBalance = history[history.length - 1]?.balance ?? 0;
        const nextBalance =
          transaction.type === 'income'
            ? previousBalance + transaction.amount
            : transaction.type === 'expense'
              ? previousBalance - transaction.amount
              : previousBalance;

        history.push({
          date: format(new Date(transaction.date), 'dd MMM'),
          balance: nextBalance,
        });

        return history;
      },
      [],
    );

    const monthlyCashFlowMap = new Map<string, { month: string; income: number; expenses: number; savings: number }>();
    sortedTransactions.forEach((transaction) => {
      const monthKey = format(new Date(transaction.date), 'MMM');
      const current = monthlyCashFlowMap.get(monthKey) ?? {
        month: monthKey,
        income: 0,
        expenses: 0,
        savings: 0,
      };

      if (transaction.type === 'income') {
        current.income += transaction.amount;
      } else if (transaction.type === 'expense') {
        current.expenses += transaction.amount;
      }

      current.savings = current.income - current.expenses;
      monthlyCashFlowMap.set(monthKey, current);
    });
    const cashFlowData = [...monthlyCashFlowMap.values()];

    // Notes
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const notesThisWeek = notes.filter(n => new Date(n.createdAt) >= weekAgo).length;

    // Productivity Score
    const weeklyScore = Math.min(100, Math.round(
      (tasksCompletedToday * 10) + (habitCompletionRate * 0.5) + (notesThisWeek * 5)
    ));

    // Upcoming Events
    const upcomingEvents = events
      .filter(e => new Date(e.startDate) >= new Date())
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 3);

    // Task Priorities
    const tasksByPriority = PRIORITY_ORDER.map(p => ({
      name: p.charAt(0).toUpperCase() + p.slice(1),
      value: tasks.filter(t => t.priority === p && t.status !== 'done').length,
      color: PRIORITY_COLORS[p],
    })).filter(p => p.value > 0);

    const hasFinancialData = accounts.length > 0 || transactions.length > 0;

    return {
      today,
      tasksCompletedToday,
      totalTasksToday,
      todayHabits,
      completedHabits,
      habitCompletionRate,
      maxStreak,
      longestEver,
      netWorth,
      netWorthTrend,
      isTrendPositive,
      TrendIcon,
      hasFinancialData,
      balanceHistory,
      cashFlowData,
      notesThisWeek,
      weeklyScore,
      upcomingEvents,
      tasksByPriority,
    };
  }, [tasks, habits, habitLogs, accounts, transactions, notes, events]);

  return {
    ...stats,
    activities,
    setActiveModule,
    logHabit,
  };
}
