import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../../shared/lib/cn';
import { formatCurrency } from '../../../shared/lib/helpers';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { useI18n } from '../../../shared/i18n/useI18n';

interface FinanceWidgetsProps {
  isTrendPositive: boolean;
  netWorthTrend: number;
  TrendIcon: LucideIcon;
  balanceHistory: { date: string; balance: number }[];
  setActiveModule: (module: string) => void;
}

export function FinanceWidgets({ isTrendPositive, netWorthTrend, TrendIcon, balanceHistory, setActiveModule }: FinanceWidgetsProps) {
  const { t } = useI18n();
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <motion.button
        type="button"
        variants={itemVariants}
        onClick={() => setActiveModule('finances')}
        className="w-full rounded-xl border border-border bg-bg-card p-5 text-left transition-all hover:border-white/10"
      >
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
      </motion.button>
    </div>
  );
}
