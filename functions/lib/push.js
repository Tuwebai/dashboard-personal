"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPushForNotification = sendPushForNotification;
const messaging_1 = require("firebase-admin/messaging");
const firestore_1 = require("firebase-admin/firestore");
const firebase_functions_1 = require("firebase-functions");
async function sendPushForNotification(userId, notificationId, notification) {
    if (!notification.channels.includes('push')) {
        return;
    }
    const db = (0, firestore_1.getFirestore)();
    const devicesSnapshot = await db.collection(`users/${userId}/notificationDevices`).where('isActive', '==', true).get();
    const tokens = devicesSnapshot.docs
        .map((device) => device.get('token'))
        .filter((token) => typeof token === 'string' && token.length > 0);
    if (tokens.length === 0) {
        return;
    }
    const response = await (0, messaging_1.getMessaging)().sendEachForMulticast({
        tokens,
        notification: {
            title: notification.title,
            body: notification.message,
        },
        data: {
            actionUrl: notification.actionUrl ?? '/dashboard',
            notificationId,
        },
        webpush: {
            notification: {
                icon: '/favicon.svg',
                badge: '/favicon.svg',
            },
            fcmOptions: {
                link: notification.actionUrl ?? '/dashboard',
            },
        },
    });
    const invalidTokenIndexes = response.responses
        .map((item, index) => item.success ? -1 : index)
        .filter((index) => index >= 0);
    if (invalidTokenIndexes.length > 0) {
        const batch = db.batch();
        invalidTokenIndexes.forEach((index) => {
            const invalidToken = tokens[index];
            const device = devicesSnapshot.docs.find((doc) => doc.get('token') === invalidToken);
            if (device) {
                batch.set(device.ref, {
                    isActive: false,
                    updatedAt: new Date().toISOString(),
                }, { merge: true });
            }
        });
        await batch.commit();
    }
    const deliveredAt = new Date().toISOString();
    await db.doc(`users/${userId}/notificationInbox/${notificationId}`).set({
        deliveredAt,
        delivery: {
            ...notification.delivery,
            push: response.successCount > 0 ? 'delivered' : 'failed',
            inApp: notification.delivery.inApp === 'queued' ? 'delivered' : notification.delivery.inApp,
        },
    }, { merge: true });
    firebase_functions_1.logger.info('notification push processed', {
        userId,
        notificationId,
        successCount: response.successCount,
        failureCount: response.failureCount,
    });
}
