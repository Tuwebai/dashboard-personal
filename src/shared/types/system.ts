import type { ID, ISODateString } from './common';

export type NotificationType = 'task' | 'habit' | 'finance' | 'calendar' | 'system';
export type NotificationChannel = 'in_app' | 'push';
export type NotificationStatus = 'queued' | 'delivered' | 'read' | 'failed' | 'disabled' | 'unsupported';

export interface NotificationDeliveryState {
  inApp: NotificationStatus;
  push: NotificationStatus;
}

export interface NotificationPreferences {
  inAppEnabled: boolean;
  pushEnabled: boolean;
  taskNotifications: boolean;
  habitNotifications: boolean;
  financeAlerts: boolean;
  calendarNotifications: boolean;
  systemNotifications: boolean;
  updatedAt: ISODateString;
}

export interface NotificationDevice {
  id: ID;
  token: string;
  browser: string;
  platform: string;
  permission: NotificationPermission | 'unsupported';
  supportsPush: boolean;
  isActive: boolean;
  lastSeenAt: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface AppNotification {
  id: ID;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: ISODateString;
  channels: NotificationChannel[];
  delivery: NotificationDeliveryState;
  scope: 'user' | 'system';
  actionUrl?: string;
  originModule?: string;
  dedupeKey?: string;
  sourceEventId?: string;
  readAt?: ISODateString | null;
  seenAt?: ISODateString | null;
  deliveredAt?: ISODateString | null;
  scheduledFor?: ISODateString | null;
  expiresAt?: ISODateString | null;
  isEphemeral?: boolean;
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
