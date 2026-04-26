import { initializeApp } from 'firebase-admin/app';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions';
import type { UserNotificationDoc } from './types';
import { sendPushForNotification } from './push';
import { generateScheduledNotifications } from './reminders';

initializeApp();

export const sendPushOnNotificationCreate = onDocumentCreated(
  {
    document: 'users/{userId}/notificationInbox/{notificationId}',
    region: 'us-central1',
  },
  async (event) => {
    const notification = event.data?.data() as UserNotificationDoc | undefined;
    const userId = event.params.userId;
    const notificationId = event.params.notificationId;

    if (!notification || !userId || !notificationId) {
      return;
    }

    await sendPushForNotification(userId, notificationId, notification);
  },
);

export const generateNotificationReminders = onSchedule(
  {
    schedule: 'every 5 minutes',
    region: 'us-central1',
    timeZone: 'America/Argentina/Buenos_Aires',
  },
  async () => {
    await generateScheduledNotifications();
    logger.info('scheduled notification generation completed');
  },
);
