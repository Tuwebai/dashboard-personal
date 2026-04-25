import { motion } from 'framer-motion';
import { Activity as ActivityIcon } from 'lucide-react';
import { format } from 'date-fns';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { useI18n } from '../../../shared/i18n/useI18n';
import type { ActivityItem } from '../../../shared/types';

interface ActivityWidgetProps {
  activities: ActivityItem[];
}

import { memo } from 'react';

export const ActivityWidget = memo(function ActivityWidget({ activities }: ActivityWidgetProps) {
  const { t } = useI18n();
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div variants={itemVariants} className="bg-bg-card border border-border rounded-xl p-5">
      <h3 className="font-semibold text-white text-sm mb-4">{t('dashboard.recentActivity')}</h3>
      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.slice(0, 6).map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-sm"
                style={{ background: `${activity.color}20` }}
              >
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/80 truncate">{activity.description}</p>
                <p className="text-xs text-white/30">{activity.title}</p>
              </div>
              <span className="text-[10px] text-white/25 shrink-0">
                {format(new Date(activity.createdAt), 'h:mm a')}
              </span>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState icon={ActivityIcon} message={t('dashboard.noActivity')} />
      )}
    </motion.div>
  );
});
