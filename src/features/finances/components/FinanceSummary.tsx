import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, CreditCard } from 'lucide-react';
import { useAppStore } from '../../../stores/useAppStore';
import { cn } from '../../../shared/lib/cn';
import { parseStoredDate } from '../../../shared/lib/date';
import { useI18n } from '../../../shared/i18n/useI18n';
import { formatFinanceCurrency, getPrimaryFinanceCurrency } from '../lib/currency';

export function FinanceSummary() {
  const { t, lang } = useI18n();
  const transactions = useAppStore((state) => state.transactions);
  const accounts = useAppStore((state) => state.accounts);
  const defaultCurrency = getPrimaryFinanceCurrency(accounts);
  
  // Simple month-to-date income/expense logic
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthlyTx = transactions.filter(tx => {
    const d = parseStoredDate(tx.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  
  const income = monthlyTx.filter(tx => tx.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const expenses = monthlyTx.filter(tx => tx.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
  const savingsRateFormatted = `${Math.round(savingsRate)}%`;

  // Calculate trends (Current Month vs Previous Month)
  const lastMonth = new Date(currentYear, currentMonth - 1, 1);
  const lastMonthTx = transactions.filter(tx => {
    const d = parseStoredDate(tx.date);
    return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
  });

  const lastIncome = lastMonthTx.filter(tx => tx.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const lastExpenses = lastMonthTx.filter(tx => tx.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const currentBalance = income - expenses;
  const lastBalance = lastIncome - lastExpenses;
  const totalAvailable = currentBalance + expenses;

  const calculateTrend = (current: number, previous: number, invert = false) => {
    if (previous === 0) {
      if (current === 0) return '0%';
      const initialChange = current > 0 ? 100 : -100;
      const adjustedInitialChange = invert ? -initialChange : initialChange;
      return `${adjustedInitialChange >= 0 ? '+' : ''}${adjustedInitialChange.toFixed(0)}%`;
    }

    const rawChange = ((current - previous) / previous) * 100;
    const change = invert ? -rawChange : rawChange;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const balanceTrend = calculateTrend(currentBalance, lastBalance);
  const incomeTrend = calculateTrend(income, lastIncome);
  const expensesTrend = totalAvailable > 0 ? `-${((expenses / totalAvailable) * 100).toFixed(1)}%` : '0%';
  const savingsRateTrend = calculateTrend(savingsRate, lastIncome > 0 ? ((lastIncome - lastExpenses) / lastIncome) * 100 : 0);

  const stats = [
    { label: t('finances.currentBalance'), value: currentBalance, icon: <Wallet className="text-violet-400" />, trend: balanceTrend, isValue: true, valueClassName: 'text-text-primary' },
    { label: t('finances.monthlyIncome'), value: income, icon: <TrendingUp className="text-emerald-400" />, trend: incomeTrend, isValue: true, valueClassName: 'text-emerald-400' },
    { label: t('finances.monthlyExpenses'), value: expenses, icon: <TrendingDown className="text-rose-400" />, trend: expensesTrend, isValue: true, valueClassName: 'text-rose-400' },
    { label: t('finances.savingsRate'), value: savingsRateFormatted, icon: <CreditCard className="text-blue-400" />, trend: savingsRateTrend, isValue: false, valueClassName: 'text-text-primary' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-bg-secondary border border-border p-5 rounded-2xl glass hover:bg-bg-hover transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-xl bg-white/5">
              {stat.icon}
            </div>
            <span className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
              stat.trend.startsWith('+') ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"
            )}>
              {stat.trend}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{stat.label}</span>
            <div className={cn("text-2xl font-bold", stat.valueClassName)}>
              {stat.isValue ? formatFinanceCurrency(stat.value as number, defaultCurrency, lang) : stat.value}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
