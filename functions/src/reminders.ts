import { getFirestore } from 'firebase-admin/firestore';
import type { NotificationPreferencesDoc, WorkspaceSnapshot } from './types';
import { buildChannels, buildNotification, resolveNotificationSettings, upsertNotification } from './notifications';

function isDateInNextWindow(dateValue: string, windowMinutes: number) {
  const now = Date.now();
  const target = new Date(dateValue).getTime();
  const diffMinutes = (target - now) / 60000;
  return diffMinutes > 0 && diffMinutes <= windowMinutes;
}

function isSameLocalDay(dateValue: string, currentDate = new Date()) {
  const date = new Date(dateValue);
  return date.getFullYear() === currentDate.getFullYear()
    && date.getMonth() === currentDate.getMonth()
    && date.getDate() === currentDate.getDate();
}

function getMonthKey(dateValue: string) {
  const date = new Date(dateValue);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export async function generateScheduledNotifications() {
  const db = getFirestore();
  const usersSnapshot = await db.collection('users').get();

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const workspaceDoc = await db.doc(`users/${userId}/crm/dashboard`).get();
    if (!workspaceDoc.exists) {
      continue;
    }

    const workspace = (workspaceDoc.data()?.state ?? {}) as WorkspaceSnapshot;
    const preferencesDoc = await db.doc(`users/${userId}/notificationPreferences/default`).get();
    const settings = resolveNotificationSettings(
      workspace.settings,
      (preferencesDoc.data() ?? undefined) as NotificationPreferencesDoc | undefined,
    );
    const { channels } = buildChannels(settings);

    if (channels.length === 0) {
      continue;
    }

    for (const task of workspace.tasks ?? []) {
      if (!settings?.taskNotifications || task.status === 'done' || task.isArchived || !task.dueDate || !isDateInNextWindow(task.dueDate, 60 * 24)) {
        continue;
      }

      const notification = buildNotification(
        'task',
        'Tarea por vencer',
        `${task.title} vence pronto.`,
        `task-${task.id}-${getMonthKey(task.dueDate)}`,
        '/tasks',
        'tasks',
        channels,
      );
      await upsertNotification(userId, notification);
    }

    for (const event of workspace.events ?? []) {
      const reminders = event.reminders ?? [];
      for (const reminderMinutes of reminders) {
        const startAt = new Date(event.startDate).getTime();
        const reminderAt = new Date(startAt - reminderMinutes * 60000).toISOString();
        if (!isDateInNextWindow(reminderAt, 20)) {
          continue;
        }

        const notification = buildNotification(
          'calendar',
          'Evento próximo',
          `${event.title} empieza en ${reminderMinutes} min.`,
          `event-${event.id}-${reminderMinutes}-${getMonthKey(event.startDate)}`,
          '/calendar',
          'calendar',
          channels,
        );
        await upsertNotification(userId, notification);
      }
    }

    for (const habit of workspace.habits ?? []) {
      if (!settings?.habitNotifications || habit.isArchived || !habit.reminderTime) {
        continue;
      }

      const now = new Date();
      const [hour, minute] = habit.reminderTime.split(':').map((value) => Number(value));
      const reminderDate = new Date(now);
      reminderDate.setHours(hour, minute, 0, 0);

      const completedToday = (workspace.habitLogs ?? []).some(
        (log) => log.habitId === habit.id && log.completed && isSameLocalDay(log.date, now),
      );

      if (completedToday || !isDateInNextWindow(reminderDate.toISOString(), 20)) {
        continue;
      }

      const notification = buildNotification(
        'habit',
        'Hábito pendiente',
        `Todavía no registraste ${habit.name}.`,
        `habit-${habit.id}-${getMonthKey(reminderDate.toISOString())}-${now.getDate()}`,
        '/habits',
        'habits',
        channels,
      );
      await upsertNotification(userId, notification);
    }

    const monthKey = getMonthKey(new Date().toISOString());
    const monthlyExpenses = (workspace.transactions ?? [])
      .filter((transaction) => transaction.type === 'expense' && getMonthKey(transaction.date) === monthKey)
      .reduce<Record<string, number>>((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] ?? 0) + Math.abs(transaction.amount);
        return acc;
      }, {});

    for (const budget of workspace.budgets ?? []) {
      if (!settings?.financeAlerts || budget.amount <= 0) {
        continue;
      }

      const spent = monthlyExpenses[budget.category] ?? 0;
      const threshold = budget.amount * (budget.alertThreshold / 100);
      if (spent < threshold) {
        continue;
      }

      const notification = buildNotification(
        'finance',
        'Alerta de presupuesto',
        `${budget.category} alcanzó ${Math.round((spent / budget.amount) * 100)}% del presupuesto.`,
        `budget-${budget.id}-${monthKey}`,
        '/finances',
        'finances',
        channels,
      );
      await upsertNotification(userId, notification);
    }
  }
}
