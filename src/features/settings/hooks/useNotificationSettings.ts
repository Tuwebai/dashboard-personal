import { useState } from 'react';
import { useAppStore } from '../../../stores/useAppStore';
import { useI18n } from '../../../shared/i18n/useI18n';
import { useShallow } from 'zustand/react/shallow';

export function useNotificationSettings() {
  const { t } = useI18n();
  const { notificationsEnabled, taskNotifications, habitNotifications, financeAlerts, calendarNotifications, updateSettings } =
    useAppStore(
      useShallow((state) => ({
        notificationsEnabled: state.settings.notificationsEnabled,
        taskNotifications: state.settings.taskNotifications,
        habitNotifications: state.settings.habitNotifications,
        financeAlerts: state.settings.financeAlerts,
        calendarNotifications: state.settings.calendarNotifications,
        updateSettings: state.updateSettings,
      })),
    );
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );
  const settings = {
    notificationsEnabled,
    taskNotifications,
    habitNotifications,
    financeAlerts,
    calendarNotifications,
  };

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
