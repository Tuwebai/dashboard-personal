import {
  deleteToken,
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
  type Messaging,
} from 'firebase/messaging';
import { getFirebaseAppInstance, getFirebaseClientConfig } from '../persistence/firebase';
import { getBrowserPushSupportState } from './support';

const DEVICE_ID_STORAGE_KEY = 'nexus-notification-device-id';
const PUSH_TOKEN_STORAGE_KEY = 'nexus-notification-token';
const FOREGROUND_NOTIFICATION_TTL_MS = 20_000;
const shownForegroundNotifications = new Map<string, number>();

function getVapidKey() {
  return import.meta.env.VITE_FIREBASE_VAPID_KEY ?? '';
}

function getServiceWorkerUrl() {
  const config = getFirebaseClientConfig();
  const params = new URLSearchParams({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
    measurementId: config.measurementId,
  });

  return `/firebase-messaging-sw.js?${params.toString()}`;
}

function getStoredDeviceId() {
  if (typeof window === 'undefined') {
    return '';
  }

  const existingId = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
  if (existingId) {
    return existingId;
  }

  const deviceId = `device-${crypto.randomUUID()}`;
  window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
  return deviceId;
}

export function getPushDeviceId() {
  return getStoredDeviceId();
}

export function getStoredPushToken() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(PUSH_TOKEN_STORAGE_KEY) ?? '';
}

function setStoredPushToken(token: string) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!token) {
    window.localStorage.removeItem(PUSH_TOKEN_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(PUSH_TOKEN_STORAGE_KEY, token);
}

async function getMessagingClient() {
  const firebaseApp = getFirebaseAppInstance();
  if (!firebaseApp || !getVapidKey()) {
    return null;
  }

  const supported = await isSupported().catch(() => false);
  if (!supported) {
    return null;
  }

  return getMessaging(firebaseApp);
}

export async function registerMessagingServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  return navigator.serviceWorker.register(getServiceWorkerUrl(), { scope: '/' });
}

export async function ensurePushToken() {
  const supportState = getBrowserPushSupportState();
  if (!supportState.supportsPush || supportState.permission !== 'granted') {
    return null;
  }

  const messaging = await getMessagingClient();
  const registration = await registerMessagingServiceWorker();

  if (!messaging || !registration) {
    return null;
  }

  const token = await getToken(messaging, {
    vapidKey: getVapidKey(),
    serviceWorkerRegistration: registration,
  }).catch(() => '');

  if (!token) {
    return null;
  }

  setStoredPushToken(token);

  return {
    browser: navigator.userAgent,
    deviceId: getStoredDeviceId(),
    platform: navigator.platform || 'unknown',
    token,
  };
}

export async function revokePushToken() {
  const messaging = await getMessagingClient();
  if (!messaging) {
    setStoredPushToken('');
    return false;
  }

  const currentToken = getStoredPushToken();
  if (!currentToken) {
    return true;
  }

  const deleted = await deleteToken(messaging).catch(() => false);
  if (deleted) {
    setStoredPushToken('');
  }

  return deleted;
}

export async function subscribeToForegroundPush(callback: (payload: MessagePayload) => void) {
  const messaging = await getMessagingClient();
  if (!messaging) {
    return () => undefined;
  }

  return onMessage(messaging as Messaging, callback);
}

function getForegroundNotificationId(payload: MessagePayload) {
  return payload.data?.notificationId
    ?? `${payload.notification?.title ?? 'notification'}:${payload.notification?.body ?? ''}`;
}

function shouldSkipForegroundNotification(notificationId: string) {
  const now = Date.now();
  const lastShownAt = shownForegroundNotifications.get(notificationId);
  shownForegroundNotifications.forEach((shownAt, key) => {
    if (now - shownAt > FOREGROUND_NOTIFICATION_TTL_MS) {
      shownForegroundNotifications.delete(key);
    }
  });

  if (lastShownAt && now - lastShownAt < FOREGROUND_NOTIFICATION_TTL_MS) {
    return true;
  }

  shownForegroundNotifications.set(notificationId, now);
  return false;
}

export async function showForegroundPushNotification(payload: MessagePayload) {
  if (typeof window === 'undefined' || Notification.permission !== 'granted') {
    return false;
  }

  const title = payload.notification?.title?.trim();
  if (!title) {
    return false;
  }

  const notificationId = getForegroundNotificationId(payload);
  if (shouldSkipForegroundNotification(notificationId)) {
    return false;
  }

  const body = payload.notification?.body ?? '';
  const actionUrl = payload.data?.actionUrl ?? '/dashboard';
  const options: NotificationOptions = {
    body,
    badge: '/favicon.ico',
    data: {
      actionUrl,
      notificationId,
    },
    icon: '/favicon.ico',
    tag: notificationId,
  };

  const registration = await navigator.serviceWorker.getRegistration().catch(() => undefined)
    ?? await registerMessagingServiceWorker().catch(() => null);

  if (registration?.showNotification) {
    await registration.showNotification(title, options);
    return true;
  }

  const notification = new Notification(title, options);
  notification.onclick = () => {
    window.focus();
    window.location.assign(actionUrl);
  };

  return true;
}

type BrowserNotificationInput = {
  actionUrl?: string;
  body: string;
  notificationId: string;
  title: string;
};

export async function showBrowserNotification({
  actionUrl = '/dashboard',
  body,
  notificationId,
  title,
}: BrowserNotificationInput) {
  if (typeof window === 'undefined' || Notification.permission !== 'granted' || !title.trim()) {
    return false;
  }

  if (shouldSkipForegroundNotification(notificationId)) {
    return false;
  }

  const options: NotificationOptions = {
    badge: '/favicon.ico',
    body,
    data: {
      actionUrl,
      notificationId,
    },
    icon: '/favicon.ico',
    tag: notificationId,
  };

  const registration = await navigator.serviceWorker.getRegistration().catch(() => undefined)
    ?? await registerMessagingServiceWorker().catch(() => null);

  if (registration?.showNotification) {
    await registration.showNotification(title, options);
    return true;
  }

  const notification = new Notification(title, options);
  notification.onclick = () => {
    window.focus();
    window.location.assign(actionUrl);
  };

  return true;
}
