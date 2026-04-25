import { motion } from 'framer-motion';
import { Zap, Target, Award, Calendar } from 'lucide-react';
import { useAppStore } from '../../../stores/useAppStore';
import { useI18n } from '../../../shared/i18n/useI18n';
import { formatLocalDateKey } from '../../../shared/lib/date';
import { getCurrentHabitStreak } from '../lib/habitCard';

export function HabitStats() {
  const { t } = useI18n();
  const habitLogs = useAppStore((state) => state.habitLogs);
  
  const totalCompletions = habitLogs.filter(l => l.completed).length;
  const completedLogs = habitLogs.filter((log) => log.completed).length;
  const habitIds = [...new Set(habitLogs.map((log) => log.habitId))];
  const currentStreak = habitIds.length > 0
    ? Math.max(...habitIds.map((habitId) => getCurrentHabitStreak(habitId, habitLogs)))
    : 0;
  
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    return formatLocalDateKey(d);
  });
  
  const weeklyMatches = habitLogs.filter(l => last7Days.includes(l.date));
  const weeklyRate = weeklyMatches.length > 0 
    ? Math.round((weeklyMatches.filter(l => l.completed).length / weeklyMatches.length) * 100)
    : 0;
  const completionRate = habitLogs.length > 0 ? Math.round((completedLogs / habitLogs.length) * 100) : 0;

  const stats = [
    { label: t('habits.weeklyScore'), value: `${weeklyRate}%`, icon: <Target className="text-violet-400" />, colorClassName: 'bg-violet-500/10' },
    { label: t('habits.currentStreak'), value: `${currentStreak} ${t(currentStreak === 1 ? 'habits.day' : 'habits.days')}`, icon: <Zap className="text-amber-400" />, colorClassName: 'bg-amber-500/10' },
    { label: t('habits.totalLogs'), value: totalCompletions, icon: <Award className="text-emerald-400" />, colorClassName: 'bg-emerald-500/10' },
    { label: t('habits.completionRate'), value: `${completionRate}%`, icon: <Calendar className="text-blue-400" />, colorClassName: 'bg-blue-500/10' },
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
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-xl ${stat.colorClassName}`}>
              {stat.icon}
            </div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{stat.label}</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
        </motion.div>
      ))}
    </div>
  );
}
