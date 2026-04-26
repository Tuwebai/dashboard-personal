import type { Tag, User, UserSettings } from '../shared/types';

export const TAGS: Tag[] = [
  { id: 'tag_1', name: 'urgent', color: '#ef4444' },
  { id: 'tag_2', name: 'personal', color: '#8b5cf6' },
  { id: 'tag_3', name: 'work', color: '#3b82f6' },
  { id: 'tag_4', name: 'health', color: '#22c55e' },
  { id: 'tag_5', name: 'finance', color: '#f59e0b' },
  { id: 'tag_6', name: 'learning', color: '#06b6d4' },
  { id: 'tag_7', name: 'creative', color: '#ec4899' },
];

export const CURRENT_USER: User = {
  id: 'user_1',
  name: 'Juanchii Dev',
  email: 'juanchidev@nexuscrm.io',
  avatar: '',
  timezone: 'UTC',
  createdAt: new Date().toISOString(),
};

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  accentColor: '#8b5cf6',
  sidebarCollapsed: false,
  compactMode: false,
  weekStartsMonday: true,
  defaultTaskView: 'kanban',
  notificationsEnabled: true,
  pushNotifications: false,
  taskNotifications: true,
  habitNotifications: true,
  financeAlerts: true,
  calendarNotifications: true,
  language: 'es',
};
