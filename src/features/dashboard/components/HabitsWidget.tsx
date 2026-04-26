import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { ProgressRing } from '../../../shared/ui/ProgressRing';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { cn } from '../../../shared/lib/cn';
import { useI18n } from '../../../shared/i18n/useI18n';
import type { AppModule } from '../../../core/navigation/routes';
import type { Habit } from '../../../shared/types';

interface HabitsWidgetProps {
  habitCompletionRate: number;
  completedHabits: number;
  todayHabits: { habit: Habit; completed: boolean }[];
  today: string;
  setActiveModule: (module: AppModule) => void;
  logHabit: (habitId: string, date: string, completed: boolean) => void;
}

export function HabitsWidget({
  habitCompletionRate,
  completedHabits,
  todayHabits,
  today,
  setActiveModule,
  logHabit
}: HabitsWidgetProps) {
  const { t } = useI18n();
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div variants={itemVariants} className="bg-bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white text-sm">{t('dashboard.todayHabits')}</h3>
        <button onClick={() => setActiveModule('habits')} className="text-violet-400 hover:text-violet-300 transition-colors cursor-pointer">
          <ArrowRight size={16} />
        </button>
      </div>
      {todayHabits.length > 0 ? (
        <div className="flex items-center gap-5">
          <ProgressRing
            value={habitCompletionRate}
            size={80}
            strokeWidth={7}
            color="#7c3aed"
          >
            <div className="text-center">
              <p className="text-lg font-bold text-white">{completedHabits}</p>
              <p className="text-[9px] text-white/40">/{todayHabits.length}</p>
            </div>
          </ProgressRing>
          <div className="flex-1 space-y-2 min-w-0">
            {todayHabits.slice(0, 4).map(({ habit, completed }) => (
              <button
                key={habit.id}
                onClick={() => logHabit(habit.id, today, !completed)}
                className="w-full flex items-center gap-3 p-1.5 hover:bg-white/5 rounded-lg transition-colors group text-left cursor-pointer"
              >
                <div className={cn(
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer',
                  completed
                    ? 'bg-violet-500 border-violet-500'
                    : 'border-white/20 group-hover:border-violet-500/50'
                )}>
                  {completed && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className={cn(
                  "text-xs truncate transition-all",
                  completed ? "text-white/40 line-through" : "text-white/80 group-hover:text-white"
                )}>
                  {habit.name}
                </span>
                <span className="ml-auto text-sm opacity-80 group-hover:opacity-100 transition-opacity">{habit.icon}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState icon={Zap} message={t('dashboard.noHabits')} />
      )}
    </motion.div>
  );
}
