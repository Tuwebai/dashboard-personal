import { Circle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '../../../shared/lib/cn';
import type { Task, TaskPriority } from '../../../shared/types';
import { useI18n } from '../../../shared/i18n/useI18n';

interface MatrixViewProps {
  tasks: Task[];
  onSelect: (task: Task) => void;
  onComplete: (id: string) => void;
}

export function MatrixView({ tasks, onSelect, onComplete }: MatrixViewProps) {
  const { t } = useI18n();
  const quadrants = [
    { 
      label: 'Urgent & Important', 
      subtitle: 'Do First', 
      color: '#ef4444', 
      bg: 'from-red-500/10', 
      priorities: ['critical'] as TaskPriority[] 
    },
    { 
      label: 'Not Urgent & Important', 
      subtitle: 'Schedule', 
      color: '#3b82f6', 
      bg: 'from-blue-500/10', 
      priorities: ['high'] as TaskPriority[] 
    },
    { 
      label: 'Urgent & Not Important', 
      subtitle: 'Delegate', 
      color: '#f59e0b', 
      bg: 'from-amber-500/10', 
      priorities: ['medium'] as TaskPriority[] 
    },
    { 
      label: 'Not Urgent & Not Important', 
      subtitle: 'Eliminate', 
      color: '#6b7280', 
      bg: 'from-gray-500/10', 
      priorities: ['low'] as TaskPriority[] 
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-full overflow-y-auto pb-10 scrollbar-hide">
      {quadrants.map(q => {
        const qTasks = tasks.filter(t => q.priorities.includes(t.priority) && t.status !== 'done');
        return (
          <div 
            key={q.label} 
            className={cn(
              'bg-gradient-to-br to-transparent border border-white/5 rounded-2xl p-5 shadow-xl transition-all hover:border-white/10 group',
              q.bg
            )} 
            style={{ borderColor: `${q.color}20` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 opacity-50" style={{ color: q.color }}>{q.label}</p>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{q.subtitle}</p>
              </div>
              <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] font-bold text-white/30">
                {qTasks.length}
              </div>
            </div>
            
            <div className="space-y-2.5">
              {qTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-20 group-hover:opacity-30 transition-opacity">
                   <div className="w-10 h-10 rounded-full border border-dashed border-white/40 mb-2" />
                   <p className="text-[10px] font-bold uppercase tracking-widest">{t('tasks.emptyMatrix')}</p>
                </div>
              ) : (
                qTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => onSelect(task)}
                    className="group/item flex items-center gap-3 p-3 bg-black/20 border border-white/5 rounded-xl cursor-pointer hover:bg-black/40 hover:border-white/10 transition-all duration-300"
                  >
                    <button
                      onClick={e => { e.stopPropagation(); onComplete(task.id); }}
                      className="text-white/20 hover:text-green-400 transition-colors"
                    >
                      <Circle size={16} strokeWidth={2.5} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white/80 group-hover/item:text-white transition-colors truncate">{task.title}</p>
                      {task.dueDate && (
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-0.5">
                          Due: {format(parseISO(task.dueDate), 'MMM d')}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
