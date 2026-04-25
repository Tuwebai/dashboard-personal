import { useMemo } from 'react';
import { format } from 'date-fns';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { FinancialAccount, Transaction } from '../../../shared/types';
import { getDerivedAccounts } from '../../finances/lib/accounts';

export function useDashboardFinanceStats(accounts: FinancialAccount[], transactions: Transaction[]) {
  return useMemo(() => {
    const derivedAccounts = getDerivedAccounts(accounts, transactions);
    const netWorth = derivedAccounts.reduce((sum, account) => sum + account.derivedBalance, 0);
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const previousTransactions = sortedTransactions.filter((transaction) => new Date(transaction.date) < thirtyDaysAgo);
    const previousAccounts = getDerivedAccounts(accounts, previousTransactions);
    const previousNetWorth = previousAccounts.reduce((sum, account) => sum + account.derivedBalance, 0);

    const balanceHistory: { date: string; balance: number }[] = [];
    let runningBalance = 0;

    sortedTransactions.forEach((transaction) => {
      if (transaction.type === 'income') {
        runningBalance += transaction.amount;
      } else if (transaction.type === 'expense') {
        runningBalance -= transaction.amount;
      }

      if (new Date(transaction.date) >= thirtyDaysAgo) {
        balanceHistory.push({
          date: format(new Date(transaction.date), 'dd MMM'),
          balance: runningBalance,
        });
      }
    });

    if (balanceHistory.length === 0 || balanceHistory[0].date !== format(thirtyDaysAgo, 'dd MMM')) {
      balanceHistory.unshift({
        date: format(thirtyDaysAgo, 'dd MMM'),
        balance: previousNetWorth,
      });
    }

    const trendBase = balanceHistory[0]?.balance ?? 0;
    const trendCurrent = balanceHistory[balanceHistory.length - 1]?.balance ?? netWorth;
    const netWorthTrend =
      trendBase === 0
        ? 0
        : ((trendCurrent - trendBase) / Math.abs(trendBase)) * 100;

    const isTrendPositive = netWorthTrend >= 0;
    const TrendIcon = isTrendPositive ? TrendingUp : TrendingDown;

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
