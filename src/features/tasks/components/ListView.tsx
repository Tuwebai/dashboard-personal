import { useState } from 'react';
import { 
  CheckCircle2, Circle, AlertCircle, Calendar, 
  ChevronDown, Edit3, Trash2 
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '../../../shared/lib/cn';
import { useI18n } from '../../../shared/i18n/useI18n';
import { 
  PRIORITY_COLORS, PRIORITY_BG, STATUS_BG, isOverdue 
} from '../../../shared/lib/helpers';
import type { Task, TaskPriority } from '../../../shared/types';

interface ListViewProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onSelect: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export function ListView({ 
  tasks, onComplete, onEdit, onDelete, onSelect, onToggleSubtask 
}: ListViewProps) {
  const { t } = useI18n();
  const priorityLabels = {
    critical: t('tasks.priorityCritical'),
    high: t('tasks.priorityHigh'),
    medium: t('tasks.priorityMedium'),
    low: t('tasks.priorityLow'),
  } as const;
  const statusLabels = {
    backlog: t('tasks.statusBacklog'),
    todo: t('tasks.statusTodo'),
    in_progress: t('tasks.statusInProgress'),
    review: t('tasks.statusReview'),
    done: t('tasks.statusDone'),
  } as const;
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const sorted = [...tasks].sort((a, b) => {
    const priorityOrder: Record<TaskPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-white/30 border border-dashed border-white/5 rounded-2xl">
        <CheckCircle2 size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-medium">{t('tasks.emptyTitle')}</p>
        <p className="text-sm mt-1">{t('tasks.emptyDescription')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-y-auto h-full pr-1 pb-10 scrollbar-hide">
      {sorted.map(task => {
        const expanded = expandedIds.has(task.id);
        const overdue = isOverdue(task.dueDate) && task.status !== 'done';
        return (
          <div 
            key={task.id} 
            className={cn(
              'group relative bg-bg-card border border-border rounded-2xl overflow-hidden',
              'hover:border-white/10 hover:bg-bg-tertiary transition-all duration-300',
              overdue && 'border-red-500/20'
            )}
          >
            <div className="flex items-center gap-4 p-4">
              <button
                onClick={() => onComplete(task.id)}
                className="text-white/30 hover:text-violet-400 transition-colors flex-shrink-0"
              >
                {task.status === 'done'
                  ? <CheckCircle2 size={20} className="text-green-500" />
                  : <Circle size={20} />}
              </button>

              <div
                className="w-1.5 h-10 rounded-full flex-shrink-0"
                style={{ background: PRIORITY_COLORS[task.priority] }}
              />

              <div className="flex-1 min-w-0" onClick={() => onSelect(task)}>
                <p className={cn(
                  'text-[15px] font-semibold text-white/90 cursor-pointer group-hover:text-violet-300 transition-colors',
                  task.status === 'done' && 'line-through text-white/30'
                )}>
                  {task.title}
                </p>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className={cn(
                    'text-[10px] px-2 py-0.5 rounded-md border font-bold uppercase tracking-wider', 
                    PRIORITY_BG[task.priority]
                  )}>
                    {priorityLabels[task.priority]}
                  </span>
                  <span className={cn(
                    'text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider', 
                    STATUS_BG[task.status]
                  )}>
                    {statusLabels[task.status]}
                  </span>
                  {task.dueDate && (
                    <span className={cn(
                      'text-xs font-medium flex items-center gap-1.5', 
                      overdue ? 'text-red-400' : 'text-white/30'
                    )}>
                      {overdue && <AlertCircle size={11} />}
                      <Calendar size={11} strokeWidth={2.5} />
                      {format(parseISO(task.dueDate), 'MMM d, yyyy')}
                    </span>
                  )}
                  {task.project && (
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md">
                      {task.project}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                {task.subtasks.length > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleExpand(task.id); }}
                    className="p-2 rounded-xl hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors"
                  >
                    <ChevronDown size={18} className={cn('block transition-transform duration-300', expanded && 'rotate-180')} />
                  </button>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(task); }} 
                  className="p-2 rounded-xl hover:bg-white/5 text-white/30 hover:text-white/80 transition-all"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} 
                  className="p-2 rounded-xl hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {expanded && task.subtasks.length > 0 && (
              <div className="px-5 pb-4 space-y-2 border-t border-border pt-4 bg-black/10">
                <div className="flex items-center justify-between mb-2">
                   <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Subtasks Progression</p>
                   <span className="text-[10px] font-bold text-violet-400">{task.progress}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-violet-500 rounded-full transition-all duration-700" 
                    style={{ width: `${task.progress}%` }} 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  {task.subtasks.map(sub => (
                    <div 
                      key={sub.id} 
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group/sub"
                    >
                      <button
                        onClick={() => onToggleSubtask(task.id, sub.id)}
                        className="text-white/20 hover:text-violet-400 transition-colors"
                      >
                        {sub.completed
                          ? <CheckCircle2 size={16} className="text-green-500" />
                          : <Circle size={16} />}
                      </button>
                      <span className={cn(
                        'text-sm font-medium text-white/60',
                        sub.completed && 'line-through text-white/20'
                      )}>
                        {sub.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
