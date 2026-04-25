import { 
  CheckCircle2, Circle, AlertCircle, Edit3, Trash2, Table2 
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '../../../shared/lib/cn';
import { useI18n } from '../../../shared/i18n/useI18n';
import { 
  PRIORITY_BG, STATUS_BG, isOverdue 
} from '../../../shared/lib/helpers';
import type { Task } from '../../../shared/types';

interface TableViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

export function TableView({ tasks, onEdit, onDelete, onComplete }: TableViewProps) {
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
  return (
    <div className="overflow-auto h-full border border-white/5 rounded-2xl bg-white/[0.01] scrollbar-hide">
      <table className="w-full text-sm border-collapse">
        <thead className="sticky top-0 bg-[#0f0f0f] border-b border-white/10 z-10">
          <tr>
            <th className="text-left px-5 py-4 text-white/30 font-bold text-[10px] uppercase tracking-[0.2em] w-12"></th>
            <th className="text-left px-5 py-4 text-white/30 font-bold text-[10px] uppercase tracking-[0.2em]">{t('tasks.fieldTitle')}</th>
            <th className="text-left px-5 py-4 text-white/30 font-bold text-[10px] uppercase tracking-[0.2em]">{t('tasks.fieldPriority')}</th>
            <th className="text-left px-5 py-4 text-white/30 font-bold text-[10px] uppercase tracking-[0.2em]">{t('tasks.fieldStatus')}</th>
            <th className="text-left px-5 py-4 text-white/30 font-bold text-[10px] uppercase tracking-[0.2em]">{t('tasks.fieldDueDate')}</th>
            <th className="text-left px-5 py-4 text-white/30 font-bold text-[10px] uppercase tracking-[0.2em]">{t('tasks.fieldProject')}</th>
            <th className="text-left px-5 py-4 text-white/30 font-bold text-[10px] uppercase tracking-[0.2em]">{t('tasks.fieldProgress')}</th>
            <th className="px-5 py-4 w-24"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.03]">
          {tasks.map(task => {
            const overdue = isOverdue(task.dueDate) && task.status !== 'done';
            return (
              <tr key={task.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-5 py-4">
                  <button onClick={() => onComplete(task.id)} className="text-white/20 hover:text-violet-400 transition-colors">
                    {task.status === 'done'
                      ? <CheckCircle2 size={18} className="text-green-500" />
                      : <Circle size={18} />}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <p className={cn('font-semibold text-white/80', task.status === 'done' && 'line-through text-white/30')}>
                    {task.title}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-md border font-bold uppercase tracking-wider', PRIORITY_BG[task.priority])}>
                    {priorityLabels[task.priority]}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider', STATUS_BG[task.status])}>
                    {statusLabels[task.status]}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {task.dueDate ? (
                    <span className={cn('text-xs font-medium flex items-center gap-1.5', overdue ? 'text-red-400' : 'text-white/40')}>
                      {overdue && <AlertCircle size={11} />}
                      {format(parseISO(task.dueDate), 'MMM d, yyyy')}
                    </span>
                  ) : <span className="text-white/10 text-xs">—</span>}
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs font-bold text-white/20 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md">
                     {task.project || t('tasks.noProject')}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full transition-all duration-700"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-white/30">{task.progress}%</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/80">
                      <Edit3 size={15} />
                    </button>
                    <button onClick={() => onDelete(task.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-white/20">
          <Table2 size={48} className="mb-4 opacity-10" />
          <p className="text-sm font-bold uppercase tracking-[0.2em]">{t('tasks.emptyTable')}</p>
        </div>
      )}
    </div>
  );
}
