import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, CreditCard } from 'lucide-react';
import { useAppStore } from '../../../stores/useAppStore';
import { cn } from '../../../shared/lib/cn';

export function FinanceSummary() {
  const { accounts, transactions } = useAppStore();
  
  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  
  // Simple month-to-date income/expense logic
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthlyTx = transactions.filter(tx => {
    const d = new Date(tx.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  
  const income = monthlyTx.filter(tx => tx.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const expenses = monthlyTx.filter(tx => tx.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
  const savingsRateFormatted = `${Math.round(savingsRate)}%`;

  // Calculate trends (Current Month vs Previous Month)
  const lastMonth = new Date(currentYear, currentMonth - 1, 1);
  const lastMonthTx = transactions.filter(tx => {
    const d = new Date(tx.date);
    return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
  });

  const lastIncome = lastMonthTx.filter(tx => tx.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const lastExpenses = lastMonthTx.filter(tx => tx.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return '+0%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const incomeTrend = calculateTrend(income, lastIncome);
  const expensesTrend = calculateTrend(expenses, lastExpenses);
  const savingsRateTrend = calculateTrend(savingsRate, lastIncome > 0 ? ((lastIncome - lastExpenses) / lastIncome) * 100 : 0);

  const stats = [
    { label: 'Net Worth', value: totalBalance, icon: <Wallet className="text-violet-400" />, trend: '+0%', isValue: true }, // Net worth trend would need historical balance data
    { label: 'Monthly Income', value: income, icon: <TrendingUp className="text-emerald-400" />, trend: incomeTrend, isValue: true },
    { label: 'Monthly Expenses', value: expenses, icon: <TrendingDown className="text-rose-400" />, trend: expensesTrend, isValue: true },
    { label: 'Savings Rate', value: savingsRateFormatted, icon: <CreditCard className="text-blue-400" />, trend: savingsRateTrend, isValue: false },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

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
            <div className="text-2xl font-bold text-text-primary">
              {stat.isValue ? formatCurrency(stat.value as number) : stat.value}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
