import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProgressRing } from '../../../shared/ui/ProgressRing';
import { getTimeBasedGreeting } from '../../../shared/lib/helpers';
import { useAppStore } from '../../../stores/useAppStore';
import { useI18n } from '../../../shared/i18n/useI18n';

interface DashboardHeaderProps {
  weeklyScore: number;
}

export function DashboardHeader({ weeklyScore }: DashboardHeaderProps) {
  const user = useAppStore((state) => state.user);
  const { t, lang } = useI18n();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const locale = lang === 'es' ? 'es-ES' : 'en-US';
  const dateStr = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(currentTime);
  const capitalizedDateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  const timeStr = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(currentTime);

  return (
    <motion.div variants={itemVariants} className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">
          {getTimeBasedGreeting(user.name.split(' ')[0], lang)}
        </h1>
        <p className="text-white/40 text-sm capitalize">
          {capitalizedDateStr} · {timeStr}
        </p>
      </div>
      <div className="flex items-center gap-3 bg-bg-card border border-border rounded-xl px-4 py-3">
        <ProgressRing value={weeklyScore} size={44} strokeWidth={4} color="#7c3aed" showValue />
        <div>
          <p className="text-xs text-white/40">{t('dashboard.weeklyScore')}</p>
          <p className="text-sm font-semibold text-white">{weeklyScore}/100</p>
        </div>
      </div>
    </motion.div>
  );
}
