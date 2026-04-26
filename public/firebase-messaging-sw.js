/* global importScripts, firebase */

const params = new URL(self.location.href).searchParams;

const firebaseConfig = {
  apiKey: params.get('apiKey') || '',
  authDomain: params.get('authDomain') || '',
  projectId: params.get('projectId') || '',
  storageBucket: params.get('storageBucket') || '',
  messagingSenderId: params.get('messagingSenderId') || '',
  appId: params.get('appId') || '',
  measurementId: params.get('measurementId') || '',
};

const hasMessagingConfig = firebaseConfig.apiKey
  && firebaseConfig.projectId
  && firebaseConfig.messagingSenderId
  && firebaseConfig.appId;

if (hasMessagingConfig) {
  importScripts('https://www.gstatic.com/firebasejs/12.12.1/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/12.12.1/firebase-messaging-compat.js');

  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || 'Nexus';
    const body = payload.notification?.body || '';
    const icon = payload.notification?.image || '/favicon.ico';
    const actionUrl = payload.data?.actionUrl || '/';

    self.registration.showNotification(title, {
      body,
      icon,
      badge: '/favicon.ico',
      data: {
        actionUrl,
        notificationId: payload.data?.notificationId || '',
      },
    });
  });
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const actionUrl = event.notification.data?.actionUrl || '/';
  const absoluteUrl = new URL(actionUrl, self.location.origin).toString();

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const matchingClient = clients.find((client) => client.url === absoluteUrl);
      if (matchingClient) {
        return matchingClient.focus();
      }

      return self.clients.openWindow(absoluteUrl);
    }),
  );
});
