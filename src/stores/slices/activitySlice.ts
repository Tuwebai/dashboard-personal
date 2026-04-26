import { StateCreator } from 'zustand';
import { ActivitySlice, AppStore } from '../types';
import { genId } from '../../shared/lib/id';
import { format } from 'date-fns';
import { shouldUseFirebasePersistence } from '../../core/persistence/config';
import type { AppNotification } from '../../shared/types';

function createNotificationId() {
  return genId();
}

function createNotificationPayload(
  notifData: Omit<AppNotification, 'id' | 'createdAt' | 'scope'> & { scope?: 'user' | 'system' },
  id = createNotificationId(),
): AppNotification {
  const createdAt = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");

  return {
    ...notifData,
    id,
    createdAt,
    scope: notifData.scope ?? 'user',
    channels: notifData.channels ?? ['in_app'],
    delivery: notifData.delivery ?? {
      inApp: notifData.isRead ? 'read' : 'queued',
      push: 'disabled',
    },
    isRead: notifData.isRead ?? false,
  };
}

export const createActivitySlice: StateCreator<
  AppStore,
  [["zustand/immer", never], ["zustand/persist", unknown]],
  [],
  ActivitySlice
> = (set, get) => ({
  notifications: [],
  systemNotifications: [],
  activities: [],

  setNotifications: (notifications) => set((state) => {
    state.notifications = notifications;
  }),

  upsertSystemNotification: (notifData) => set((state) => {
    const nextNotification = {
      ...createNotificationPayload({ ...notifData, scope: 'system' }, notifData.id ?? createNotificationId()),
      scope: 'system' as const,
      isEphemeral: notifData.isEphemeral ?? true,
    };
    const existingIndex = state.systemNotifications.findIndex((notification) => notification.id === nextNotification.id);

    if (existingIndex >= 0) {
      state.systemNotifications[existingIndex] = nextNotification;
    } else {
      state.systemNotifications.unshift(nextNotification);
    }

    if (state.systemNotifications.length > 20) {
      state.systemNotifications = state.systemNotifications.slice(0, 20);
    }
  }),

  dismissSystemNotification: (id) => set((state) => {
    state.systemNotifications = state.systemNotifications.filter((notification) => notification.id !== id);
  }),

  markNotificationRead: async (id) => {
    const now = new Date().toISOString();
    const { firebaseUid, authProvider, notifications, systemNotifications } = get();
    const systemNotification = systemNotifications.find((notification) => notification.id === id);

    if (systemNotification) {
      set((state) => {
        const notification = state.systemNotifications.find((item) => item.id === id);
        if (notification) {
          notification.isRead = true;
          notification.readAt = now;
          notification.delivery.inApp = 'read';
        }
      });
      return;
    }

    const notification = notifications.find((item) => item.id === id);
    if (!notification) {
      return;
    }

    set((state) => {
      const currentNotification = state.notifications.find((item) => item.id === id);
      if (currentNotification) {
        currentNotification.isRead = true;
        currentNotification.readAt = now;
        currentNotification.delivery.inApp = 'read';
      }
    });

    if (!shouldUseFirebasePersistence() || authProvider !== 'password' || !firebaseUid) {
      return;
    }

    const { markNotificationReadRemote } = await import('../../core/notifications/firestore');
    await markNotificationReadRemote(firebaseUid, id, now).catch(() => undefined);
  },

  markAllNotificationsRead: async () => {
    const now = new Date().toISOString();
    const { firebaseUid, authProvider, notifications } = get();

    set((state) => {
      state.notifications.forEach((notification) => {
        notification.isRead = true;
        notification.readAt = now;
        notification.delivery.inApp = 'read';
      });
      state.systemNotifications.forEach((notification) => {
        notification.isRead = true;
        notification.readAt = now;
        notification.delivery.inApp = 'read';
      });
    });

    if (!shouldUseFirebasePersistence() || authProvider !== 'password' || !firebaseUid || notifications.length === 0) {
      return;
    }

    const { markAllNotificationsReadRemote } = await import('../../core/notifications/firestore');
    await markAllNotificationsReadRemote(firebaseUid, notifications.map((notification) => notification.id), now).catch(() => undefined);
  },

  clearNotifications: async () => {
    const { firebaseUid, authProvider, notifications } = get();

    set((state) => {
      state.systemNotifications = [];
      if (!shouldUseFirebasePersistence() || authProvider !== 'password' || !firebaseUid) {
        state.notifications = [];
      }
    });

    if (!shouldUseFirebasePersistence() || authProvider !== 'password' || !firebaseUid || notifications.length === 0) {
      return;
    }

    const { clearNotificationInboxRemote } = await import('../../core/notifications/firestore');
    await clearNotificationInboxRemote(firebaseUid, notifications.map((notification) => notification.id)).catch(() => undefined);
  },

  addActivity: (activityData) => set(state => {
    state.activities.unshift({
      ...activityData,
      id: genId(),
      createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    });
    if (state.activities.length > 100) {
      state.activities = state.activities.slice(0, 80);
    }
  }),

  addNotification: async (notifData) => {
    const notification = createNotificationPayload(notifData);
    const { firebaseUid, authProvider } = get();

    if (notifData.scope === 'system' || !shouldUseFirebasePersistence() || authProvider !== 'password' || !firebaseUid) {
      set((state) => {
        state.systemNotifications.unshift({
          ...notification,
          scope: 'system',
          isEphemeral: true,
        });
        if (state.systemNotifications.length > 20) {
          state.systemNotifications = state.systemNotifications.slice(0, 20);
        }
      });
      return;
    }

    set((state) => {
      state.notifications.unshift(notification);
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 40);
      }
    });

    const { createNotificationRemote } = await import('../../core/notifications/firestore');
    await createNotificationRemote(firebaseUid, notification).catch(() => undefined);
  },
});
