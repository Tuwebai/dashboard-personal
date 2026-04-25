import type { ID, ISODateString } from './common';

export type NotificationType = 'task' | 'habit' | 'finance' | 'calendar' | 'system';

export interface AppNotification {
  id: ID;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: ISODateString;
}

export interface ActivityItem {
  id: ID;
  type: 'task_completed' | 'habit_checked' | 'note_created' | 'transaction_added' | 'goal_achieved' | 'routine_completed';
  title: string;
  description: string;
  icon: string;
  color: string;
  createdAt: ISODateString;
}
