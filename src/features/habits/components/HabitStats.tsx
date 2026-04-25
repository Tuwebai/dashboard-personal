import { motion } from 'framer-motion';
import { Zap, Target, Award, Calendar } from 'lucide-react';
import { useAppStore } from '../../../stores/useAppStore';

export function HabitStats() {
  const { habitLogs } = useAppStore();
  
  // Calculate aggregate stats (in a real enterprise app, this might be a hook)
  const totalCompletions = habitLogs.filter(l => l.completed).length;
  
  // Simple success rate calculation for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  });
  
  const weeklyMatches = habitLogs.filter(l => last7Days.includes(l.date));
  const weeklyRate = weeklyMatches.length > 0 
    ? Math.round((weeklyMatches.filter(l => l.completed).length / weeklyMatches.length) * 100)
    : 0;

  const stats = [
    { label: 'Weekly Score', value: `${weeklyRate}%`, icon: <Target className="text-violet-400" />, color: 'violet' },
    { label: 'Current Streak', value: '12 days', icon: <Zap className="text-amber-400" />, color: 'amber' },
    { label: 'Total Logs', value: totalCompletions, icon: <Award className="text-emerald-400" />, color: 'emerald' },
    { label: 'Completion', value: '92%', icon: <Calendar className="text-blue-400" />, color: 'blue' },
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
            <div className={`p-2 rounded-xl bg-${stat.color}-500/10`}>
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
