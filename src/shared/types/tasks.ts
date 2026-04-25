import type { ID, ISODateString } from './common';

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
export type TaskView = 'kanban' | 'list' | 'matrix' | 'table';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface Task {
  id: ID;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  goalId?: ID;
  dueDate?: ISODateString;
  dueTime?: string;
  tags: Tag[];
  subtasks: Subtask[];
  estimatedTime?: number;
  trackedTime?: number;
  recurrence: RecurrenceType;
  project?: string;
  progress: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  completedAt?: ISODateString;
  isArchived: boolean;
}

export interface Subtask {
  id: ID;
  taskId: ID;
  title: string;
  completed: boolean;
  order: number;
  subtasks?: Subtask[];
}

export interface Tag {
  id: ID;
  name: string;
  color: string;
}
