import {
  DndContext, closestCenter, DragEndEvent, useSensors
} from '@dnd-kit/core';
import {
  SortableContext, useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format, parseISO } from 'date-fns';
import { 
  CheckCircle2, Circle, MoreVertical, AlertCircle, Calendar 
} from 'lucide-react';
import { Badge } from '../../../shared/ui/Badge';
import { cn } from '../../../shared/lib/cn';
import { 
  PRIORITY_BG, KANBAN_COLUMNS, isOverdue, getDaysUntilDue 
} from '../../../shared/lib/helpers';
import type { Task, TaskStatus } from '../../../shared/types';
import { useI18n } from '../../../shared/i18n/useI18n';

interface KanbanViewProps {
  tasksByStatus: Record<TaskStatus, Task[]>;
  sensors: ReturnType<typeof useSensors>;
  onDragEnd: (event: DragEndEvent) => void;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onSelect: (task: Task) => void;
}

export function KanbanView({
  tasksByStatus, sensors, onDragEnd, onComplete, onEdit, onSelect
}: KanbanViewProps) {
  const { t } = useI18n();
  const statusLabels = {
    backlog: t('tasks.statusBacklog'),
    todo: t('tasks.statusTodo'),
    in_progress: t('tasks.statusInProgress'),
    review: t('tasks.statusReview'),
    done: t('tasks.statusDone'),
  } as const;
  const priorityLabels = {
    critical: t('tasks.priorityCritical'),
    high: t('tasks.priorityHigh'),
    medium: t('tasks.priorityMedium'),
    low: t('tasks.priorityLow'),
  } as const;
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <div className="flex h-full gap-4 overflow-x-auto pb-4 scrollbar-hide [touch-action:pan-x]">
        {KANBAN_COLUMNS.map(col => (
          <div key={col.id} className="flex h-full min-w-[280px] shrink-0 flex-col rounded-2xl border border-white/5 bg-white/2 p-4 md:w-80">
            <div className="flex items-center gap-2 mb-4 px-1">
              <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
              <span className="text-sm font-semibold text-white/70">{statusLabels[col.id]}</span>
              <span className="text-xs text-white/30 ml-auto bg-white/5 px-2 py-0.5 rounded-full">
                {tasksByStatus[col.id].length}
              </span>
            </div>
            
            <SortableContext
              items={tasksByStatus[col.id].map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div
                className="flex-1 space-y-3 min-h-[200px] overflow-y-auto pr-1"
                style={{ background: `${col.color}05` }}
              >
                {tasksByStatus[col.id].map(task => (
                  <SortableTaskCard
                    key={task.id}
                    task={task}
                    onComplete={onComplete}
                    onEdit={onEdit}
                    onSelect={onSelect}
                    priorityLabel={priorityLabels[task.priority]}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  );
}

function SortableTaskCard({ 
  task, onComplete, onEdit, onSelect, priorityLabel
}: {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onSelect: (task: Task) => void;
  priorityLabel: string;
}) {
  const { t } = useI18n();
  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const overdue = isOverdue(task.dueDate) && task.status !== 'done';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onSelect(task)}
      className={cn(
        'bg-white/2 border border-white/5 rounded-xl p-3.5 cursor-pointer',
        'hover:border-white/15 hover:bg-[#1e1e1e] transition-all',
        isDragging && 'opacity-50 rotate-2 shadow-xl z-50',
        task.status === 'done' && 'opacity-60',
        overdue && 'border-red-500/30'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <button
            onClick={e => { e.stopPropagation(); onComplete(task.id); }}
            className="mt-0.5 shrink-0 text-white/30 hover:text-violet-400 transition-colors"
            aria-label={t('tasks.complete')}
          >
            {task.status === 'done'
              ? <CheckCircle2 size={16} className="text-green-500" />
              : <Circle size={16} />}
          </button>
          <p className={cn(
            'text-sm font-medium text-white/90 leading-snug',
            task.status === 'done' && 'line-through text-white/40'
          )}>
            {task.title}
          </p>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onEdit(task); }}
          className="text-white/20 hover:text-white/60 transition-colors shrink-0"
        >
          <MoreVertical size={14} />
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-white/40 mt-2 line-clamp-2 ml-6 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 mt-3 ml-6 flex-wrap">
        <span className={cn(
          'text-[10px] px-1.5 py-0.5 rounded-md border font-medium uppercase tracking-wider', 
          PRIORITY_BG[task.priority]
        )}>
          {priorityLabel}
        </span>
        {task.dueDate && (
          <span className={cn(
            'flex items-center gap-1 text-[10px] font-medium',
            overdue ? 'text-red-400' : 'text-white/30'
          )}>
            {overdue && <AlertCircle size={10} />}
            <Calendar size={10} strokeWidth={2.5} />
            {overdue ? `${Math.abs(getDaysUntilDue(task.dueDate))}${t('tasks.overdueDays')}` : format(parseISO(task.dueDate), 'MMM d')}
          </span>
        )}
      </div>

      {task.subtasks.length > 0 && (
        <div className="mt-2.5 ml-6">
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${task.progress}%` }}
            />
          </div>
          <p className="text-[10px] text-white/20 mt-1 font-medium">
            {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks
          </p>
        </div>
      )}

      {task.tags.length > 0 && (
        <div className="flex gap-1 mt-2.5 ml-6 flex-wrap">
          {task.tags.slice(0, 2).map(tag => (
            <Badge key={tag.id} color={tag.color} size="sm">{tag.name}</Badge>
          ))}
        </div>
      )}
    </div>
  );
}
