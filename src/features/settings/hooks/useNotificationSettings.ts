import { useState } from 'react';
import { toast } from 'sonner';
import { useAppStore } from '../../../stores/useAppStore';
import { useI18n } from '../../../shared/i18n/useI18n';
import { useShallow } from 'zustand/react/shallow';
import { shouldUseFirebasePersistence } from '../../../core/persistence/config';
import { upsertNotificationPreferencesRemote } from '../../../core/notifications/firestore';
import { getBrowserPushSupportState } from '../../../core/notifications/support';

export function useNotificationSettings() {
  const { t } = useI18n();
  const {
    notificationsEnabled,
    pushNotifications,
    taskNotifications,
    habitNotifications,
    financeAlerts,
    calendarNotifications,
    updateSettings,
    authProvider,
    firebaseUid,
  } =
    useAppStore(
      useShallow((state) => ({
        notificationsEnabled: state.settings.notificationsEnabled,
        pushNotifications: state.settings.pushNotifications,
        taskNotifications: state.settings.taskNotifications,
        habitNotifications: state.settings.habitNotifications,
        financeAlerts: state.settings.financeAlerts,
        calendarNotifications: state.settings.calendarNotifications,
        updateSettings: state.updateSettings,
        authProvider: state.authProvider,
        firebaseUid: state.firebaseUid,
      })),
    );
  const supportState = getBrowserPushSupportState();
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    supportState.permission === 'unsupported' ? 'denied' : supportState.permission
  );
  const settings = {
    notificationsEnabled,
    pushNotifications,
    taskNotifications,
    habitNotifications,
    financeAlerts,
    calendarNotifications,
  };

  const syncNotificationPreferences = async (nextSettings: typeof settings) => {
    if (!shouldUseFirebasePersistence() || authProvider !== 'password' || !firebaseUid) {
      return;
    }

    await upsertNotificationPreferencesRemote(firebaseUid, {
      inAppEnabled: nextSettings.notificationsEnabled,
      pushEnabled: nextSettings.notificationsEnabled && nextSettings.pushNotifications && permissionStatus === 'granted',
      taskNotifications: nextSettings.taskNotifications,
      habitNotifications: nextSettings.habitNotifications,
      financeAlerts: nextSettings.financeAlerts,
      calendarNotifications: nextSettings.calendarNotifications,
      systemNotifications: true,
      updatedAt: new Date().toISOString(),
    }).catch(() => undefined);
  };

  const toggleGlobal = (enabled: boolean) => {
    const nextSettings = { ...settings, notificationsEnabled: enabled };
    updateSettings({ notificationsEnabled: enabled });
    void syncNotificationPreferences(nextSettings);
  };

  const toggleFeature = (feature: keyof typeof settings, enabled: boolean) => {
    updateSettings({ [feature]: enabled });
    void syncNotificationPreferences({ ...settings, [feature]: enabled });
  };

  const togglePush = async (enabled: boolean) => {
    if (!supportState.supportsPush) {
      toast.error(t('settings.pushUnsupported'));
      return;
    }

    if (enabled && permissionStatus !== 'granted') {
      const granted = await requestBrowserPermission();
      if (!granted) {
        return;
      }
    }

    const nextSettings = { ...settings, pushNotifications: enabled };
    updateSettings({ pushNotifications: enabled });
    void syncNotificationPreferences(nextSettings);
  };

  const requestBrowserPermission = async () => {
    if (!supportState.supportsNotifications) {
      toast.error(t('settings.browserNoNotifications'));
      return false;
    }

    if (permissionStatus === 'denied') {
      toast.error(t('settings.notificationsDenied'));
      return false;
    }

    const permission = await Notification.requestPermission();
    setPermissionStatus(permission);
    
    if (permission === 'granted') {
      new Notification(t('settings.notificationsEnabledTitle'), {
        body: t('settings.notificationsEnabledBody'),
        icon: '/favicon.ico'
      });
      updateSettings({ pushNotifications: true });
      void syncNotificationPreferences({ ...settings, pushNotifications: true });
      toast.success(t('settings.notificationsGranted'));
      return true;
    }

    if (permission === 'denied') {
      toast.error(t('settings.notificationsDenied'));
      return false;
    }

    toast.info(t('settings.notificationsDefault'));
    return false;
  };

  return {
    settings,
    permissionStatus,
    supportState,
    authProvider,
    toggleGlobal,
    togglePush,
    toggleFeature,
    requestBrowserPermission
  };
}
