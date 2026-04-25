import { motion } from 'framer-motion';
import { ArrowRight, CheckSquare } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { useI18n } from '../../../shared/i18n/useI18n';

interface TaskPriorityWidgetProps {
  tasksByPriority: { name: string; value: number; color: string }[];
  setActiveModule: (module: string) => void;
}

export function TaskPriorityWidget({ tasksByPriority, setActiveModule }: TaskPriorityWidgetProps) {
  const { t } = useI18n();
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div variants={itemVariants} className="bg-bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white text-sm">{t('dashboard.taskBreakdown')}</h3>
        <button onClick={() => setActiveModule('tasks')} className="text-violet-400 hover:text-violet-300 transition-colors cursor-pointer">
          <ArrowRight size={16} />
        </button>
      </div>
      {tasksByPriority.length > 0 ? (
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={100} height={100}>
            <PieChart>
              <Pie
                data={tasksByPriority}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={46}
                dataKey="value"
                strokeWidth={0}
              >
                {tasksByPriority.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-2">
            {tasksByPriority.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                <span className="text-xs text-white/60 flex-1">{item.name}</span>
                <span className="text-xs font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState icon={CheckSquare} message={t('dashboard.noTasks')} />
      )}
    </motion.div>
  );
}
