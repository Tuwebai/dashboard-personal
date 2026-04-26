import {
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import type { AppNotification, NotificationDevice, NotificationPreferences } from '../../shared/types';
import { getFirebaseFirestore } from '../persistence/firebase';

const NOTIFICATION_INBOX_COLLECTION = 'notificationInbox';
const NOTIFICATION_DEVICES_COLLECTION = 'notificationDevices';
const NOTIFICATION_PREFERENCES_COLLECTION = 'notificationPreferences';
const DEFAULT_NOTIFICATION_PREFERENCES_ID = 'default';

function stripUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefinedDeep(item)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((acc, [key, entry]) => {
      if (entry !== undefined) {
        acc[key] = stripUndefinedDeep(entry);
      }
      return acc;
    }, {}) as T;
  }

  return value;
}

function getUserInboxCollection(uid: string) {
  const firestore = getFirebaseFirestore();
  return firestore ? collection(firestore, 'users', uid, NOTIFICATION_INBOX_COLLECTION) : null;
}

function getUserNotificationDoc(uid: string, notificationId: string) {
  const firestore = getFirebaseFirestore();
  return firestore ? doc(firestore, 'users', uid, NOTIFICATION_INBOX_COLLECTION, notificationId) : null;
}

function getUserDeviceDoc(uid: string, deviceId: string) {
  const firestore = getFirebaseFirestore();
  return firestore ? doc(firestore, 'users', uid, NOTIFICATION_DEVICES_COLLECTION, deviceId) : null;
}

function getUserPreferenceDoc(uid: string) {
  const firestore = getFirebaseFirestore();
  return firestore ? doc(firestore, 'users', uid, NOTIFICATION_PREFERENCES_COLLECTION, DEFAULT_NOTIFICATION_PREFERENCES_ID) : null;
}

export function subscribeNotificationInbox(
  uid: string,
  callback: (notifications: AppNotification[]) => void,
): Unsubscribe {
  const inbox = getUserInboxCollection(uid);
  if (!inbox) {
    throw new Error('notifications/invalid-inbox-ref');
  }

  const inboxQuery = query(inbox, orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(inboxQuery, (snapshot) => {
    callback(
      snapshot.docs.map((item) => {
        const data = item.data() as AppNotification;
        return {
          ...data,
          id: item.id,
          isRead: Boolean(data.readAt),
          scope: 'user',
        };
      }),
    );
  });
}

export async function createNotificationRemote(uid: string, notification: AppNotification) {
  const ref = getUserNotificationDoc(uid, notification.id);
  if (!ref) {
    throw new Error('notifications/invalid-inbox-ref');
  }

  await setDoc(ref, stripUndefinedDeep({
    ...notification,
    scope: 'user',
  }));
}

export async function markNotificationReadRemote(uid: string, notificationId: string, readAt: string) {
  const ref = getUserNotificationDoc(uid, notificationId);
  if (!ref) {
    throw new Error('notifications/invalid-inbox-ref');
  }

  await updateDoc(ref, stripUndefinedDeep({
    isRead: true,
    readAt,
    seenAt: readAt,
    'delivery.inApp': 'read',
  }));
}

export async function markAllNotificationsReadRemote(uid: string, notificationIds: string[], readAt: string) {
  const firestore = getFirebaseFirestore();
  if (!firestore) {
    throw new Error('notifications/invalid-inbox-ref');
  }

  const batch = writeBatch(firestore);
  notificationIds.forEach((notificationId) => {
    const ref = getUserNotificationDoc(uid, notificationId);
    if (ref) {
      batch.update(ref, stripUndefinedDeep({
        isRead: true,
        readAt,
        seenAt: readAt,
        'delivery.inApp': 'read',
      }));
    }
  });
  await batch.commit();
}

export async function clearNotificationInboxRemote(uid: string, notificationIds: string[]) {
  const firestore = getFirebaseFirestore();
  if (!firestore) {
    throw new Error('notifications/invalid-inbox-ref');
  }

  const batch = writeBatch(firestore);
  notificationIds.forEach((notificationId) => {
    const ref = getUserNotificationDoc(uid, notificationId);
    if (ref) {
      batch.delete(ref);
    }
  });
  await batch.commit();
}

export async function upsertNotificationPreferencesRemote(uid: string, preferences: NotificationPreferences) {
  const ref = getUserPreferenceDoc(uid);
  if (!ref) {
    throw new Error('notifications/invalid-preferences-ref');
  }

  await setDoc(ref, stripUndefinedDeep(preferences), { merge: true });
}

export async function upsertNotificationDeviceRemote(uid: string, device: NotificationDevice) {
  const ref = getUserDeviceDoc(uid, device.id);
  if (!ref) {
    throw new Error('notifications/invalid-device-ref');
  }

  await setDoc(ref, stripUndefinedDeep(device), { merge: true });
}

export async function disableNotificationDeviceRemote(uid: string, deviceId: string, updatedAt: string) {
  const ref = getUserDeviceDoc(uid, deviceId);
  if (!ref) {
    throw new Error('notifications/invalid-device-ref');
  }

  await setDoc(ref, {
    isActive: false,
    updatedAt,
    lastSeenAt: updatedAt,
  }, { merge: true });
}

export async function removeNotificationDeviceRemote(uid: string, deviceId: string) {
  const ref = getUserDeviceDoc(uid, deviceId);
  if (!ref) {
    throw new Error('notifications/invalid-device-ref');
  }

  await deleteDoc(ref);
}
