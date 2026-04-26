import { motion } from 'framer-motion';
import { CheckSquare, Flame, DollarSign, FileText, Target } from 'lucide-react';
import { AnimatedCounter } from '../../../shared/ui/AnimatedCounter';
import { useI18n } from '../../../shared/i18n/useI18n';
import { PRIORITY_BG } from '../../../shared/lib/helpers';
import { cn } from '../../../shared/lib/cn';
import type { AppModule } from '../../../core/navigation/routes';

interface KPIGridProps {
  tasksCompletedToday: number;
  totalTasksToday: number;
  topTasks: Array<{ id: string; title: string; priority: 'critical' | 'high' | 'medium' | 'low' }>;
  maxStreak: number;
  longestEver: number;
  netWorth: number;
  notesThisWeek: number;
  setActiveModule: (module: AppModule) => void;
  setSelectedTask: (id: string | null) => void;
}

export function KPIGrid({
  tasksCompletedToday,
  totalTasksToday,
  topTasks,
  maxStreak,
  longestEver,
  netWorth,
  notesThisWeek,
  setActiveModule,
  setSelectedTask,
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
        taskItems={topTasks.map((task) => ({
          id: task.id,
          title: task.title,
          priorityKey: task.priority,
          priority: t(`tasks.priority${task.priority.charAt(0).toUpperCase()}${task.priority.slice(1)}`),
        }))}
        onTaskClick={(taskId) => {
          setSelectedTask(taskId);
          setActiveModule('tasks');
        }}
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
  taskItems,
  onTaskClick,
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
  taskItems?: Array<{ id: string; title: string; priority: string; priorityKey: 'critical' | 'high' | 'medium' | 'low' }>;
  onTaskClick?: (id: string) => void;
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
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-2xl font-bold text-white">
            {prefix}
            <AnimatedCounter value={value} decimals={decimals} />
            {suffix}
          </p>
          <p className="text-xs text-white/40 mt-1">{label}</p>
          <p className="text-xs text-white/25 mt-0.5">{subtitle}</p>
        </div>
        {taskItems && taskItems.length > 0 ? (
          <div className="hidden min-w-0 flex-1 space-y-1.5 lg:block">
            {taskItems.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onTaskClick?.(task.id);
                }}
                className="flex w-full items-center justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-2 text-left transition-all hover:border-white/10 hover:bg-white/[0.04]"
              >
                <p className="truncate text-[11px] font-medium text-white/80">{task.title}</p>
                <span
                  className={cn(
                    'shrink-0 rounded-md border px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider',
                    PRIORITY_BG[task.priorityKey],
                  )}
                >
                  {task.priority}
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
