import { useMemo } from 'react';
import { format } from 'date-fns';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { FinancialAccount, Transaction } from '../../../shared/types';
import { getDerivedAccounts } from '../../finances/lib/accounts';

export function useDashboardFinanceStats(accounts: FinancialAccount[], transactions: Transaction[]) {
  return useMemo(() => {
    const derivedAccounts = getDerivedAccounts(accounts, transactions);
    const netWorth = derivedAccounts.reduce((sum, account) => sum + account.derivedBalance, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentTransactions = transactions.filter((transaction) => new Date(transaction.date) >= thirtyDaysAgo);
    const netFlow30d = recentTransactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') return acc + transaction.amount;
      if (transaction.type === 'expense') return acc - transaction.amount;
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
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const balanceHistory = sortedTransactions.reduce<{ date: string; balance: number }[]>((history, transaction) => {
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
    }, []);

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
