import { motion } from 'framer-motion';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../../shared/lib/cn';
import { formatCurrency } from '../../../shared/lib/helpers';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { useI18n } from '../../../shared/i18n/useI18n';
import type { CashFlowEntry } from '../../../shared/types';

interface FinanceWidgetsProps {
  isTrendPositive: boolean;
  netWorthTrend: number;
  TrendIcon: LucideIcon;
  balanceHistory: { date: string; balance: number }[];
  cashFlowData: CashFlowEntry[];
  setActiveModule: (module: string) => void;
}

export function FinanceWidgets({ isTrendPositive, netWorthTrend, TrendIcon, balanceHistory, cashFlowData, setActiveModule }: FinanceWidgetsProps) {
  const { t } = useI18n();
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Balance Chart */}
      <motion.div variants={itemVariants} className="bg-bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white text-sm">{t('dashboard.netWorth')}</h3>
            <p className="text-xs text-white/40 mt-0.5">{t('dashboard.trend30d')}</p>
          </div>
          <div className={cn("flex items-center gap-1.5", isTrendPositive ? "text-green-400" : "text-red-400")}>
            <TrendIcon size={14} />
            <span className="text-xs font-semibold">
              {isTrendPositive ? '+' : ''}{netWorthTrend.toFixed(1)}%
            </span>
          </div>
        </div>
        {balanceHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={balanceHistory}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#666' }} tickLine={false} axisLine={false} interval={9} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#888' }}
                itemStyle={{ color: '#a78bfa' }}
                formatter={(v: unknown) => [formatCurrency(Number(v)), 'Balance']}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#7c3aed"
                strokeWidth={2}
                fill="url(#balanceGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState icon={TrendIcon} message={t('dashboard.noFinances')} minHeight={120} />
        )}
      </motion.div>

      {/* Cash Flow Chart */}
      <motion.div variants={itemVariants} className="bg-bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white text-sm">{t('dashboard.cashFlow')}</h3>
            <p className="text-xs text-white/40 mt-0.5">{t('dashboard.incomeVsExpenses')}</p>
          </div>
          <button onClick={() => setActiveModule('finances')} className="text-violet-400 hover:text-violet-300 transition-colors cursor-pointer">
            <ArrowRight size={16} />
          </button>
        </div>
        {cashFlowData.length > 0 ? (
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={cashFlowData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#666' }} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, fontSize: 12 }}
                formatter={(v: unknown) => [formatCurrency(Number(v))]}
              />
              <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} fill="url(#incomeGrad)" name="Income" />
              <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="url(#expenseGrad)" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState icon={TrendIcon} message={t('dashboard.noCashFlow')} minHeight={120} />
        )}
      </motion.div>
    </div>
  );
}
