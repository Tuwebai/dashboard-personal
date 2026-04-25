import { useMemo } from 'react';
import { addDays, format } from 'date-fns';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { FinancialAccount, Transaction } from '../../../shared/types';
import { getDerivedAccounts } from '../../finances/lib/accounts';

export function useDashboardFinanceStats(accounts: FinancialAccount[], transactions: Transaction[]) {
  return useMemo(() => {
    const derivedAccounts = getDerivedAccounts(accounts, transactions);
    const netWorth = derivedAccounts.reduce((sum, account) => sum + account.derivedBalance, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const previousTransactions = transactions.filter((transaction) => new Date(transaction.date) < thirtyDaysAgo);
    const previousAccounts = getDerivedAccounts(accounts, previousTransactions);
    const previousNetWorth = previousAccounts.reduce((sum, account) => sum + account.derivedBalance, 0);

    const netWorthTrend =
      previousNetWorth === 0
        ? 0
        : ((netWorth - previousNetWorth) / Math.abs(previousNetWorth)) * 100;

    const isTrendPositive = netWorthTrend >= 0;
    const TrendIcon = isTrendPositive ? TrendingUp : TrendingDown;
    const recentTransactions = transactions
      .filter((transaction) => new Date(transaction.date) >= thirtyDaysAgo)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const balanceHistory: { date: string; balance: number }[] = [];
    let runningBalance = previousNetWorth;
    let cursor = new Date(thirtyDaysAgo);

    while (cursor <= today) {
      const dayKey = format(cursor, 'yyyy-MM-dd');
      const dayTransactions = recentTransactions.filter(
        (transaction) => format(new Date(transaction.date), 'yyyy-MM-dd') === dayKey,
      );

      runningBalance += dayTransactions.reduce((total, transaction) => {
        if (transaction.type === 'income') return total + transaction.amount;
        if (transaction.type === 'expense') return total - transaction.amount;
        return total;
      }, 0);

      balanceHistory.push({
        date: format(cursor, 'dd MMM'),
        balance: runningBalance,
      });

      cursor = addDays(cursor, 1);
    }

    const monthlyCashFlowMap = new Map<string, { month: string; income: number; expenses: number; savings: number }>();
    [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach((transaction) => {
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

    return {
      netWorth,
      netWorthTrend,
      isTrendPositive,
      TrendIcon,
      hasFinancialData: accounts.length > 0 || transactions.length > 0,
      balanceHistory,
      cashFlowData: [...monthlyCashFlowMap.values()],
    };
  }, [accounts, transactions]);
}
