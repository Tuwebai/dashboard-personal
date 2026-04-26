import { useEffect } from 'react';
import { useI18n } from '../../shared/i18n/useI18n';
import { useAppStore } from '../../stores/useAppStore';
import { shouldUseFirebasePersistence } from '../persistence/config';
import { buildLiveNotificationPlans } from './liveNotificationPlans';
import { showBrowserNotification } from './push';

const LIVE_NOTIFICATION_POLL_MS = 30_000;

export function useLiveNotificationProducer() {
  const { t } = useI18n();
  const authStatus = useAppStore((state) => state.authStatus);
  const settings = useAppStore((state) => state.settings);
  const tasks = useAppStore((state) => state.tasks);
  const events = useAppStore((state) => state.events);
  const habits = useAppStore((state) => state.habits);
  const habitLogs = useAppStore((state) => state.habitLogs);
  const budgets = useAppStore((state) => state.budgets);
  const transactions = useAppStore((state) => state.transactions);
  const notifications = useAppStore((state) => state.notifications);
  const systemNotifications = useAppStore((state) => state.systemNotifications);
  const addNotification = useAppStore((state) => state.addNotification);

  useEffect(() => {
    if (!shouldUseFirebasePersistence() || authStatus !== 'authenticated') {
      return;
    }

    const existingIds = new Set([
      ...notifications.map((notification) => notification.id),
      ...systemNotifications.map((notification) => notification.id),
    ]);
    let cancelled = false;

    const dispatchPlans = async () => {
      const plans = buildLiveNotificationPlans({
        budgets,
        events,
        habitLogs,
        habits,
        settings,
        tasks,
        transactions,
      });

      for (const plan of plans) {
        if (cancelled || existingIds.has(plan.id)) {
          continue;
        }

        existingIds.add(plan.id);

        const title =
          plan.type === 'task' ? t('notifications.taskDueSoonTitle')
            : plan.type === 'calendar' ? t('notifications.calendarSoonTitle')
              : plan.type === 'habit' ? t('notifications.habitPendingTitle')
                : t('notifications.financeBudgetTitle');

        const message =
          plan.type === 'task'
            ? t('notifications.taskDueSoonBody').replace('{title}', String(plan.meta.title ?? ''))
            : plan.type === 'calendar'
              ? t('notifications.calendarSoonBody')
                .replace('{title}', String(plan.meta.title ?? ''))
                .replace('{minutes}', String(plan.meta.reminderMinutes ?? ''))
              : plan.type === 'habit'
                ? t('notifications.habitPendingBody').replace('{title}', String(plan.meta.title ?? ''))
                : t('notifications.financeBudgetBody')
                  .replace('{category}', String(plan.meta.category ?? ''))
                  .replace('{percentage}', String(plan.meta.percentage ?? ''));

        await addNotification({
          actionUrl: plan.actionUrl,
          channels: settings.pushNotifications ? ['in_app', 'push'] : ['in_app'],
          dedupeKey: plan.dedupeKey,
          delivery: {
            inApp: 'queued',
            push: settings.pushNotifications ? 'queued' : 'disabled',
          },
          id: plan.id,
          isRead: false,
          message,
          originModule: plan.originModule,
          scheduledFor: plan.scheduledFor,
          sourceEventId: plan.sourceEventId,
          title,
          type: plan.type,
        });

        if (settings.notificationsEnabled) {
          await showBrowserNotification({
            actionUrl: plan.actionUrl,
            body: message,
            notificationId: plan.id,
            title,
          });
        }
      }
    };

    void dispatchPlans();
    const intervalId = window.setInterval(() => {
      void dispatchPlans();
    }, LIVE_NOTIFICATION_POLL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [
    addNotification,
    authStatus,
    budgets,
    events,
    habitLogs,
    habits,
    notifications,
    settings,
    systemNotifications,
    t,
    tasks,
    transactions,
  ]);
}
