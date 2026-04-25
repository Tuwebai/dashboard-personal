import type { ID, ISODateString } from './common';
import type { TaskView } from './tasks';

export interface User {
  id: ID;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  timezone: string;
  createdAt: ISODateString;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  accentColor: string;
  sidebarCollapsed: boolean;
  compactMode: boolean;
  weekStartsMonday: boolean;
  defaultTaskView: TaskView;
  notificationsEnabled: boolean;
  taskNotifications: boolean;
  habitNotifications: boolean;
  financeAlerts: boolean;
  calendarNotifications: boolean;
  language: 'en' | 'es';
}
