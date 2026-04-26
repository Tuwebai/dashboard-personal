export interface WorkspaceNotificationSettings {
  notificationsEnabled?: boolean;
  pushNotifications?: boolean;
  taskNotifications?: boolean;
  habitNotifications?: boolean;
  financeAlerts?: boolean;
  calendarNotifications?: boolean;
}

export interface NotificationPreferencesDoc {
  inAppEnabled?: boolean;
  pushEnabled?: boolean;
  taskNotifications?: boolean;
  habitNotifications?: boolean;
  financeAlerts?: boolean;
  calendarNotifications?: boolean;
  systemNotifications?: boolean;
}

export interface WorkspaceTask {
  id: string;
  title: string;
  status: string;
  dueDate?: string;
  isArchived?: boolean;
}

export interface WorkspaceEvent {
  id: string;
  title: string;
  startDate: string;
  reminders?: number[];
}

export interface WorkspaceHabit {
  id: string;
  name: string;
  reminderTime?: string;
  isArchived?: boolean;
}

export interface WorkspaceHabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
}

export interface WorkspaceBudget {
  id: string;
  category: string;
  amount: number;
  alertThreshold: number;
}

export interface WorkspaceTransaction {
  id: string;
  type: string;
  amount: number;
  category: string;
  date: string;
}

export interface WorkspaceSnapshot {
  settings?: WorkspaceNotificationSettings;
  tasks?: WorkspaceTask[];
  events?: WorkspaceEvent[];
  habits?: WorkspaceHabit[];
  habitLogs?: WorkspaceHabitLog[];
  budgets?: WorkspaceBudget[];
  transactions?: WorkspaceTransaction[];
}

export interface UserNotificationDoc {
  id: string;
  type: 'task' | 'habit' | 'finance' | 'calendar' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  channels: Array<'in_app' | 'push'>;
  delivery: {
    inApp: 'queued' | 'delivered' | 'read' | 'failed' | 'disabled' | 'unsupported';
    push: 'queued' | 'delivered' | 'read' | 'failed' | 'disabled' | 'unsupported';
  };
  scope: 'user';
  actionUrl?: string;
  originModule?: string;
  dedupeKey?: string;
  sourceEventId?: string;
  scheduledFor?: string | null;
  expiresAt?: string | null;
}
