import { getFirestore } from 'firebase-admin/firestore';
import type { NotificationPreferencesDoc, UserNotificationDoc, WorkspaceNotificationSettings } from './types';

function sanitizeIdPart(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 120);
}

export function createNotificationId(type: UserNotificationDoc['type'], dedupeKey: string) {
  return `${type}-${sanitizeIdPart(dedupeKey)}`;
}

export function buildChannels(settings: WorkspaceNotificationSettings | undefined) {
  const inAppEnabled = settings?.notificationsEnabled !== false;
  const pushEnabled = inAppEnabled && settings?.pushNotifications === true;

  return {
    inAppEnabled,
    pushEnabled,
    channels: [
      ...(inAppEnabled ? ['in_app' as const] : []),
      ...(pushEnabled ? ['push' as const] : []),
    ],
  };
}

export function resolveNotificationSettings(
  workspaceSettings: WorkspaceNotificationSettings | undefined,
  remotePreferences: NotificationPreferencesDoc | undefined,
): WorkspaceNotificationSettings {
  return {
    notificationsEnabled: remotePreferences?.inAppEnabled ?? workspaceSettings?.notificationsEnabled ?? true,
    pushNotifications: remotePreferences?.pushEnabled ?? workspaceSettings?.pushNotifications ?? false,
    taskNotifications: remotePreferences?.taskNotifications ?? workspaceSettings?.taskNotifications ?? true,
    habitNotifications: remotePreferences?.habitNotifications ?? workspaceSettings?.habitNotifications ?? true,
    financeAlerts: remotePreferences?.financeAlerts ?? workspaceSettings?.financeAlerts ?? true,
    calendarNotifications: remotePreferences?.calendarNotifications ?? workspaceSettings?.calendarNotifications ?? true,
  };
}

export function buildNotification(
  type: UserNotificationDoc['type'],
  title: string,
  message: string,
  dedupeKey: string,
  actionUrl: string,
  originModule: UserNotificationDoc['originModule'],
  channels: Array<'in_app' | 'push'>,
): UserNotificationDoc {
  const createdAt = new Date().toISOString();
  const pushStatus = channels.includes('push') ? 'queued' : 'disabled';

  return {
    id: createNotificationId(type, dedupeKey),
    type,
    title,
    message,
    isRead: false,
    createdAt,
    channels,
    delivery: {
      inApp: channels.includes('in_app') ? 'queued' : 'disabled',
      push: pushStatus,
    },
    scope: 'user',
    actionUrl,
    originModule,
    dedupeKey,
    sourceEventId: dedupeKey,
  };
}

export async function upsertNotification(userId: string, notification: UserNotificationDoc) {
  const db = getFirestore();
  await db.doc(`users/${userId}/notificationInbox/${notification.id}`).set(notification, { merge: true });
}
