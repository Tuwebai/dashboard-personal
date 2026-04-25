import { useMemo } from 'react';
import { format, isToday, parseISO } from 'date-fns';
import { PRIORITY_COLORS } from '../../../shared/lib/helpers';
import type { Task } from '../../../shared/types';

const PRIORITY_ORDER = ['critical', 'high', 'medium', 'low'] as const;

export function useDashboardTaskStats(tasks: Task[]) {
  return useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const activeTasks = tasks.filter((task) => !task.isArchived);
    const tasksToday = activeTasks.filter((task) => task.dueDate && isToday(parseISO(task.dueDate)));
    const tasksCompletedToday = activeTasks.filter((task) => task.completedAt && isToday(parseISO(task.completedAt))).length;
    const totalTasksToday =
      tasksToday.length > 0
        ? tasksToday.length
        : activeTasks.filter((task) => task.status !== 'done').length;
    const tasksByPriority = PRIORITY_ORDER.map((priority) => ({
      name: priority.charAt(0).toUpperCase() + priority.slice(1),
      value: activeTasks.filter((task) => task.priority === priority && task.status !== 'done').length,
      color: PRIORITY_COLORS[priority],
    })).filter((priority) => priority.value > 0);

    return {
      today,
      tasksCompletedToday,
      totalTasksToday,
      tasksByPriority,
    };
  }, [tasks]);
}
