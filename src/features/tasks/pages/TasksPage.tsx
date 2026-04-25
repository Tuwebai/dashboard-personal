import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { 
  useSensor, useSensors, PointerSensor, type DragEndEvent 
} from '@dnd-kit/core';
import { useAppStore } from '../../../stores/useAppStore';
import { Button } from '../../../shared/ui/Button';
import { KANBAN_COLUMNS } from '../../../shared/lib/helpers';
import type { Task, TaskStatus } from '../../../shared/types';
import { useI18n } from '../../../shared/i18n/useI18n';

// Subcomponents
import { TaskToolbar } from '../components/TaskToolbar';
import { KanbanView } from '../components/KanbanView';
import { ListView } from '../components/ListView';
import { MatrixView } from '../components/MatrixView';
import { TableView } from '../components/TableView';
import { TaskDetailSlideOver } from '../components/TaskDetailSlideOver';
import { TaskModal } from '../components/TaskModal';

export function Tasks() {
  const {
    tasks, taskView, setTaskView, deleteTask,
    completeTask, moveTask, taskFilters, setTaskFilters, toggleSubtask,
    selectedTaskId, setSelectedTask,
  } = useAppStore();
  const { t } = useI18n();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const filteredTasks = useMemo(() => tasks.filter(t => {
    if (t.isArchived) return false;
    if (taskFilters.priority && t.priority !== taskFilters.priority) return false;
    if (taskFilters.status && t.status !== taskFilters.status) return false;
    if (taskFilters.search && !t.title.toLowerCase().includes(taskFilters.search.toLowerCase())) return false;
    return true;
  }), [tasks, taskFilters]);

  const tasksByStatus = useMemo(() => KANBAN_COLUMNS.reduce<Record<TaskStatus, Task[]>>((acc, col) => {
    acc[col.id] = filteredTasks.filter(t => t.status === col.id);
    return acc;
  }, {} as Record<TaskStatus, Task[]>), [filteredTasks]);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId],
  );

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setAddModalOpen(true);
  };

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task.id);
  };

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
    toast.success(t('tasks.completed'));
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    toast.success(t('tasks.deleted'));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const overId = over.id as string;
    if (KANBAN_COLUMNS.some(c => c.id === overId)) {
      moveTask(active.id as string, overId as TaskStatus);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col page-enter">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t('tasks.title')}</h1>
          <p className="text-sm font-medium text-white/30 uppercase tracking-[0.2em] mt-1">
            {filteredTasks.filter(t => t.status !== 'done').length} {t('tasks.active')} · {filteredTasks.filter(t => t.status === 'done').length} {t('tasks.done')}
          </p>
        </div>
        <Button 
          variant="primary" 
          className="h-11 px-6 shadow-xl shadow-violet-500/20"
          leftIcon={<Plus size={18} strokeWidth={2.5} />} 
          onClick={() => { setEditTask(null); setAddModalOpen(true); }}
        >
          {t('tasks.createNew')}
        </Button>
      </div>

      {/* Toolbar */}
      <TaskToolbar 
        view={taskView} 
        setView={setTaskView} 
        filters={taskFilters} 
        setFilters={setTaskFilters} 
      />

      {/* View Content */}
      <div className="flex-1 overflow-hidden min-h-0">
        {taskView === 'kanban' && (
          <KanbanView
            tasksByStatus={tasksByStatus}
            sensors={sensors}
            onDragEnd={handleDragEnd}
            onComplete={handleCompleteTask}
            onEdit={handleEdit}
            onSelect={handleSelectTask}
          />
        )}
        {taskView === 'list' && (
          <ListView
            tasks={filteredTasks}
            onComplete={handleCompleteTask}
            onEdit={handleEdit}
            onDelete={handleDeleteTask}
            onSelect={handleSelectTask}
            onToggleSubtask={toggleSubtask}
          />
        )}
        {taskView === 'matrix' && (
          <MatrixView
            tasks={filteredTasks}
            onSelect={handleSelectTask}
            onComplete={handleCompleteTask}
          />
        )}
        {taskView === 'table' && (
          <TableView
            tasks={filteredTasks}
            onEdit={handleEdit}
            onDelete={handleDeleteTask}
            onComplete={handleCompleteTask}
          />
        )}
      </div>

      {/* Modal & Sidepanel */}
      <TaskModal 
        isOpen={addModalOpen} 
        onClose={() => { setAddModalOpen(false); setEditTask(null); }} 
        task={editTask}
      />

      <TaskDetailSlideOver
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onComplete={handleCompleteTask}
        onEdit={handleEdit}
        onDelete={handleDeleteTask}
        onToggleSubtask={toggleSubtask}
      />
    </div>
  );
}
