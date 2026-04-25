import { motion } from 'framer-motion';
import { CheckSquare, Flame, DollarSign, FileText, Target } from 'lucide-react';
import { AnimatedCounter } from '../../../shared/ui/AnimatedCounter';
import { useI18n } from '../../../shared/i18n/useI18n';

interface KPIGridProps {
  tasksCompletedToday: number;
  totalTasksToday: number;
  maxStreak: number;
  longestEver: number;
  netWorth: number;
  notesThisWeek: number;
  setActiveModule: (module: string) => void;
}

export function KPIGrid({
  tasksCompletedToday,
  totalTasksToday,
  maxStreak,
  longestEver,
  netWorth,
  notesThisWeek,
  setActiveModule
}: KPIGridProps) {
  const { t } = useI18n();

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        icon={<CheckSquare size={20} className="text-blue-400" />}
        label={t('dashboard.tasksToday')}
        value={tasksCompletedToday}
        subtitle={`${t('common.of')} ${totalTasksToday} ${t('common.total')}`}
        color="#3b82f6"
        onClick={() => setActiveModule('tasks')}
      />
      <KPICard
        icon={<Flame size={20} className="text-orange-400" />}
        label={t('dashboard.currentStreak')}
        value={maxStreak}
        subtitle={`${t('common.best')}: ${longestEver} ${t('dashboard.days')}`}
        color="#f97316"
        suffix=" days"
        onClick={() => setActiveModule('habits')}
      />
      <KPICard
        icon={<DollarSign size={20} className="text-green-400" />}
        label={t('dashboard.netWorth')}
        value={netWorth}
        prefix="$"
        subtitle={t('dashboard.allAccounts')}
        color="#22c55e"
        decimals={0}
        onClick={() => setActiveModule('finances')}
      />
      <KPICard
        icon={<FileText size={20} className="text-cyan-400" />}
        label={t('dashboard.notesWeek')}
        value={notesThisWeek}
        subtitle={t('dashboard.createdWeek')}
        color="#06b6d4"
        onClick={() => setActiveModule('notes')}
      />
    </motion.div>
  );
}

function KPICard({
  icon,
  label,
  value,
  subtitle,
  color,
  prefix = '',
  suffix = '',
  decimals = 0,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  subtitle: string;
  color: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  onClick?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="bg-bg-card border border-border rounded-xl p-5 cursor-pointer hover:border-white/10 transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          {icon}
        </div>
        <Target size={14} className="text-white/20 group-hover:text-white/40 transition-colors" />
      </div>
      <p className="text-2xl font-bold text-white">
        {prefix}
        <AnimatedCounter value={value} decimals={decimals} />
        {suffix}
      </p>
      <p className="text-xs text-white/40 mt-1">{label}</p>
      <p className="text-xs text-white/25 mt-0.5">{subtitle}</p>
    </motion.div>
  );
}
