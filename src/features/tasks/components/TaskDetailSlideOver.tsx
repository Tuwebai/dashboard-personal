import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle2, Circle, Clock, Edit3, Trash2 
} from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { Button } from '../../../shared/ui/Button';
import { Badge } from '../../../shared/ui/Badge';
import { cn } from '../../../shared/lib/cn';
import { useI18n } from '../../../shared/i18n/useI18n';
import { useAppStore } from '../../../stores/useAppStore';
import { 
  PRIORITY_BG, STATUS_BG, isOverdue 
} from '../../../shared/lib/helpers';
import type { Task } from '../../../shared/types';

interface TaskDetailSlideOverProps {
  task: Task | null;
  onClose: () => void;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export function TaskDetailSlideOver({
  task, onClose, onComplete, onEdit, onDelete, onToggleSubtask 
}: TaskDetailSlideOverProps) {
  const { t } = useI18n();
  const setActiveModule = useAppStore((state) => state.setActiveModule);
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
  const weeklyPriorityTaskIds = useAppStore((state) => state.weeklyPriorityTaskIds);
  const setWeeklyPriorityTask = useAppStore((state) => state.setWeeklyPriorityTask);
  const addFocusSession = useAppStore((state) => state.addFocusSession);
  const firstAvailablePrioritySlot = weeklyPriorityTaskIds.findIndex((taskId) => !taskId);
  const canPromoteToWeeklyPriority = firstAvailablePrioritySlot !== -1;
  return (
    <AnimatePresence>
      {task && (
        <motion.div
          className="fixed right-0 top-0 h-full w-96 bg-[#111] border-l border-border z-40 overflow-y-auto"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-semibold text-white">Task Details</h2>
              <button 
                onClick={onClose} 
                className="p-1.5 rounded-lg hover:bg-white/8 text-white/50 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div>
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onComplete(task.id)}
                    className="mt-0.5 text-white/40 hover:text-violet-400 transition-colors"
                  >
                    {task.status === 'done'
                      ? <CheckCircle2 size={20} className="text-green-500" />
                      : <Circle size={20} />}
                  </button>
                  <h3 className={cn(
                    'text-lg font-semibold text-white', 
                    task.status === 'done' && 'line-through text-white/50'
                  )}>
                    {task.title}
                  </h3>
                </div>
                {task.description && (
                  <p className="text-sm text-white/50 mt-2 ml-8">{task.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/4 rounded-lg p-3">
                  <p className="text-xs text-white/30 mb-1">Priority</p>
                  <span className={cn('text-xs px-2 py-0.5 rounded border font-medium', PRIORITY_BG[task.priority])}>
                    {priorityLabels[task.priority]}
                  </span>
                </div>
                <div className="bg-white/4 rounded-lg p-3">
                  <p className="text-xs text-white/30 mb-1">{t('tasks.fieldStatus')}</p>
                  <span className={cn('text-xs px-2 py-0.5 rounded font-medium', STATUS_BG[task.status])}>
                    {statusLabels[task.status]}
                  </span>
                </div>
                {task.dueDate && (
                  <div className="bg-white/4 rounded-lg p-3">
                    <p className="text-xs text-white/30 mb-1">{t('tasks.fieldDueDate')}</p>
                    <p className={cn(
                      'text-xs font-medium', 
                      isOverdue(task.dueDate) && task.status !== 'done' ? 'text-red-400' : 'text-white/70'
                    )}>
                      {format(parseISO(task.dueDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                )}
                {task.project && (
                  <div className="bg-white/4 rounded-lg p-3">
                    <p className="text-xs text-white/30 mb-1">{t('tasks.fieldProject')}</p>
                    <p className="text-xs font-medium text-white/70">{task.project}</p>
                  </div>
                )}
              </div>

              {task.subtasks.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                    Subtasks · {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                  </p>
                  <div className="h-1 bg-white/8 rounded-full mb-3">
                    <div 
                      className="h-full bg-violet-500 rounded-full" 
                      style={{ width: `${task.progress}%` }} 
                    />
                  </div>
                  <div className="space-y-2">
                    {task.subtasks.map(sub => (
                      <div 
                        key={sub.id} 
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/4 transition-colors"
                      >
                        <button
                          onClick={() => onToggleSubtask(task.id, sub.id)}
                          className="text-white/30 hover:text-violet-400 transition-colors"
                        >
                          {sub.completed
                            ? <CheckCircle2 size={16} className="text-green-500" />
                            : <Circle size={16} />}
                        </button>
                        <span className={cn(
                          'text-sm text-white/70', 
                          sub.completed && 'line-through text-white/30'
                        )}>
                          {sub.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {task.estimatedTime && (
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Clock size={14} />
                  <span>{task.estimatedTime}min estimated</span>
                  {task.trackedTime ? <span>· {task.trackedTime}min tracked</span> : null}
                </div>
              )}

              {task.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {task.tags.map(tag => (
                    <Badge key={tag.id} color={tag.color}>{tag.name}</Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-5 border-t border-border flex gap-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => {
                  if (task && canPromoteToWeeklyPriority) {
                    setWeeklyPriorityTask(firstAvailablePrioritySlot, task.id);
                  }
                }}
                disabled={!canPromoteToWeeklyPriority}
              >
                {t('weeklyPlanning.addAsPriority')}
              </Button>
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => {
                  const now = new Date();
                  addFocusSession({
                    title: task.title,
                    mode: 'pomodoro',
                    plannedMinutes: 25,
                    linkedTaskId: task.id,
                    status: 'active',
                    interruptionCount: 0,
                    interruptionNotes: [],
                    linkedDate: now.toISOString().split('T')[0],
                    elapsedSeconds: 0,
                    startedAt: now.toISOString(),
                    lastResumedAt: now.toISOString(),
                  });
                  toast.success(t('focus.created'));
                  onClose();
                  setActiveModule('focus');
                }}
                disabled={task.status === 'done'}
              >
                {t('tasks.startFocus')}
              </Button>
              <Button 
                variant="secondary" 
                className="flex-1" 
                onClick={() => onEdit(task)} 
                leftIcon={<Edit3 size={14} />}
              >
                {t('common.edit')}
              </Button>
              <Button 
                variant="danger" 
                size="icon" 
                onClick={() => { onDelete(task.id); onClose(); }}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
