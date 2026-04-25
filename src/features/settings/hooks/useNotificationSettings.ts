import { useState } from 'react';
import { useAppStore } from '../../../stores/useAppStore';
import { useI18n } from '../../../shared/i18n/useI18n';

export function useNotificationSettings() {
  const { t } = useI18n();
  const { settings, updateSettings } = useAppStore();
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );

  const toggleGlobal = (enabled: boolean) => {
    updateSettings({ notificationsEnabled: enabled });
  };

  const toggleFeature = (feature: keyof typeof settings, enabled: boolean) => {
    updateSettings({ [feature]: enabled });
  };

  const requestBrowserPermission = async () => {
    if (!('Notification' in window)) {
      alert(t('settings.browserNoNotifications'));
      return;
    }
    const permission = await Notification.requestPermission();
    setPermissionStatus(permission);
    
    if (permission === 'granted') {
      new Notification(t('settings.notificationsEnabledTitle'), {
        body: t('settings.notificationsEnabledBody'),
        icon: '/favicon.ico'
      });
    }
  };

  return {
    settings,
    permissionStatus,
    toggleGlobal,
    toggleFeature,
    requestBrowserPermission
  };
}
