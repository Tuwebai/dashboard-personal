import type { ID, ISODateString } from './common';

export type RoutineType = 'morning' | 'evening' | 'workout' | 'work' | 'weekend' | 'custom';

export interface Routine {
  id: ID;
  name: string;
  type: RoutineType;
  startTime?: string;
  endTime?: string;
  steps: RoutineStep[];
  totalDuration: number;
  createdAt: ISODateString;
  isActive: boolean;
}

export interface RoutineStep {
  id: ID;
  routineId: ID;
  title: string;
  duration: number;
  order: number;
  habitId?: ID;
  taskId?: ID;
  completed?: boolean;
}

export interface RoutineLog {
  id: ID;
  routineId: ID;
  date: ISODateString;
  completed: boolean;
  actualDuration?: number;
  stepsCompleted: number;
  totalSteps: number;
}
