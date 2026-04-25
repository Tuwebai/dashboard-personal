import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { cn } from '../../../shared/lib/cn';
import { getTodayQuote } from '../../../shared/lib/helpers';
import { useI18n } from '../../../shared/i18n/useI18n';

interface AchievementsWidgetProps {
  maxStreak: number;
  tasksCompletedToday: number;
  notesThisWeek: number;
  netWorth: number;
  completedHabits: number;
  weeklyScore: number;
}

export function AchievementsWidget({
  maxStreak,
  tasksCompletedToday,
  notesThisWeek,
  netWorth,
  completedHabits,
  weeklyScore
}: AchievementsWidgetProps) {
  const { t, lang } = useI18n();
  const quote = getTodayQuote(lang);
  
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div variants={itemVariants} className="space-y-4">
      {/* Quote */}
      <div className="bg-linear-to-br from-violet-600/10 to-cyan-600/10 border border-violet-500/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Award size={20} className="text-violet-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white/80 italic leading-relaxed">"{quote.text}"</p>
            <p className="text-xs text-white/40 mt-2">— {quote.author}</p>
          </div>
        </div>
      </div>

      {/* Quick Achievements */}
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-white text-sm mb-3">{t('dashboard.achievements')}</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: '🔥', label: t('dashboard.achievement14DayStreak'), unlocked: maxStreak >= 14 },
            { icon: '✅', label: t('dashboard.achievementTaskMaster'), unlocked: tasksCompletedToday >= 3 },
            { icon: '📚', label: t('dashboard.achievementNoteTaker'), unlocked: notesThisWeek >= 3 },
            { icon: '💰', label: t('dashboard.achievementSaver'), unlocked: netWorth > 50000 },
            { icon: '🧘', label: t('dashboard.achievementMindful'), unlocked: completedHabits >= 5 },
            { icon: '⭐', label: t('dashboard.achievementOverachiever'), unlocked: weeklyScore >= 80 },
          ].map((a, i) => (
            <div
              key={i}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-lg border transition-all relative overflow-hidden',
                a.unlocked
                  ? 'bg-violet-500/10 border-violet-500/30 badge-shine'
                  : 'bg-white/3 border-white/8 opacity-40'
              )}
            >
              <span className="text-xl">{a.icon}</span>
              <span className="text-[9px] text-center text-white/50 leading-tight">{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
