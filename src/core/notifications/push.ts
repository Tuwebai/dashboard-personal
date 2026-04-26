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
