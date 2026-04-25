export type FocusMode = 'pomodoro' | 'deep_work';

export type FocusSessionStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';

export interface FocusSession {
  id: string;
  title: string;
  mode: FocusMode;
  plannedMinutes: number;
  status: FocusSessionStatus;
  linkedTaskId: string;
  interruptionCount: number;
  interruptionNotes: string[];
  linkedDate: string;
  elapsedSeconds: number;
  createdAt: string;
  startedAt?: string;
  lastResumedAt?: string;
  endedAt?: string;
}
