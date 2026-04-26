import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAppStore } from '../../stores/useAppStore';
import { shouldUseFirebasePersistence } from '../persistence/config';
import { disableNotificationDeviceRemote, upsertNotificationDeviceRemote } from './firestore';
import { ensurePushToken, getPushDeviceId, revokePushToken, subscribeToForegroundPush } from './push';
import { getBrowserPushSupportState } from './support';
import { useI18n } from '../../shared/i18n/useI18n';

export function usePushRegistration() {
  const { t } = useI18n();
  const authStatus = useAppStore((state) => state.authStatus);
  const authProvider = useAppStore((state) => state.authProvider);
  const firebaseUid = useAppStore((state) => state.firebaseUid);
  const settings = useAppStore((state) => state.settings);

  useEffect(() => {
    if (!shouldUseFirebasePersistence() || authStatus !== 'authenticated' || authProvider !== 'password' || !firebaseUid) {
      return;
    }

    const supportState = getBrowserPushSupportState();
    let unsubscribeForeground: () => void = () => undefined;
    let cancelled = false;

    const syncDevice = async () => {
      const updatedAt = new Date().toISOString();

      if (!supportState.supportsPush || supportState.permission !== 'granted' || !settings.notificationsEnabled || !settings.pushNotifications) {
        await disableNotificationDeviceRemote(firebaseUid, getPushDeviceId(), updatedAt).catch(() => undefined);
        await revokePushToken().catch(() => false);
        return;
      }

      const pushState = await ensurePushToken();
      if (!pushState || cancelled) {
        return;
      }

      await upsertNotificationDeviceRemote(firebaseUid, {
        id: pushState.deviceId,
        token: pushState.token,
        browser: pushState.browser,
        platform: pushState.platform,
        permission: supportState.permission,
        supportsPush: supportState.supportsPush,
        isActive: true,
        lastSeenAt: updatedAt,
        createdAt: updatedAt,
        updatedAt,
      }).catch(() => undefined);

      unsubscribeForeground = await subscribeToForegroundPush((payload) => {
        const message = payload.notification?.body ?? t('settings.notificationsEnabledBody');
        const title = payload.notification?.title ?? t('common.notifications');

        toast.info(title, {
          description: message,
        });
      });
    };

    void syncDevice();

    return () => {
      cancelled = true;
      unsubscribeForeground();
    };
  }, [authProvider, authStatus, firebaseUid, settings.notificationsEnabled, settings.pushNotifications, t]);
}
