import type { Budget, CalendarEvent, Habit, HabitLog, Task, Transaction, UserSettings } from '../../shared/types';

const LOOKAHEAD_TASK_MS = 60 * 60 * 1000;
const RUNTIME_WINDOW_MS = 60 * 1000;

type LiveNotificationPlanBase = {
  actionUrl: string;
  dedupeKey: string;
  id: string;
  scheduledFor: string | null;
  sourceEventId: string;
};

export type LiveNotificationPlan =
  | (LiveNotificationPlanBase & {
    meta: { title: string };
    originModule: 'tasks';
    type: 'task';
  })
  | (LiveNotificationPlanBase & {
    meta: { reminderMinutes: number; title: string };
    originModule: 'calendar';
    type: 'calendar';
  })
  | (LiveNotificationPlanBase & {
    meta: { title: string };
    originModule: 'habits';
    type: 'habit';
  })
  | (LiveNotificationPlanBase & {
    meta: { category: string; percentage: number };
    originModule: 'finances';
    type: 'finance';
  });

type BuildPlansArgs = {
  budgets: Budget[];
  events: CalendarEvent[];
  habitLogs: HabitLog[];
  habits: Habit[];
  now?: Date;
  settings: UserSettings;
  tasks: Task[];
  transactions: Transaction[];
};

function createNotificationId(type: LiveNotificationPlan['type'], dedupeKey: string) {
  return `${type}-${dedupeKey.replace(/[^a-zA-Z0-9-_]/g, '-')}`;
}

function isWithinUpcomingWindow(dateValue: string, now: Date, lookAheadMs: number) {
  const target = new Date(dateValue).getTime();
  if (Number.isNaN(target)) {
    return false;
  }

  const diffMs = target - now.getTime();
  return diffMs >= 0 && diffMs <= lookAheadMs;
}

function isWithinRuntimeWindow(targetDate: Date, now: Date) {
  const diffMs = now.getTime() - targetDate.getTime();
  return diffMs >= 0 && diffMs <= RUNTIME_WINDOW_MS;
}

function isSameLocalDay(dateValue: string, currentDate: Date) {
  const date = new Date(dateValue);
  return date.getFullYear() === currentDate.getFullYear()
    && date.getMonth() === currentDate.getMonth()
    && date.getDate() === currentDate.getDate();
}

function getMonthKey(dateValue: string) {
  const date = new Date(dateValue);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function buildTaskPlans(tasks: Task[], settings: UserSettings, now: Date) {
  if (!settings.taskNotifications) {
    return [] as LiveNotificationPlan[];
  }

  return tasks
    .filter((task) => task.status !== 'done' && !task.isArchived && task.dueDate && isWithinUpcomingWindow(task.dueDate, now, LOOKAHEAD_TASK_MS))
    .map((task) => {
      const dueDate = task.dueDate as string;
      const dedupeKey = `task-${task.id}-${getMonthKey(dueDate)}`;
      return {
        actionUrl: '/tasks',
        dedupeKey,
        id: createNotificationId('task', dedupeKey),
        meta: { title: task.title },
        originModule: 'tasks' as const,
        scheduledFor: dueDate,
        sourceEventId: task.id,
        type: 'task' as const,
      };
    });
}

function buildCalendarPlans(events: CalendarEvent[], settings: UserSettings, now: Date) {
  if (!settings.calendarNotifications) {
    return [] as LiveNotificationPlan[];
  }

  return events.flatMap((event) => {
    const startAt = new Date(event.startDate).getTime();
    if (Number.isNaN(startAt)) {
      return [] as LiveNotificationPlan[];
    }

    return (event.reminders ?? [])
      .map((reminderMinutes) => {
        const reminderAt = new Date(startAt - reminderMinutes * 60_000);
        if (!isWithinRuntimeWindow(reminderAt, now)) {
          return null;
        }

        const dedupeKey = `event-${event.id}-${reminderMinutes}-${getMonthKey(event.startDate)}`;
        return {
          actionUrl: '/calendar',
          dedupeKey,
          id: createNotificationId('calendar', dedupeKey),
          meta: { reminderMinutes, title: event.title },
          originModule: 'calendar' as const,
          scheduledFor: reminderAt.toISOString(),
          sourceEventId: event.id,
          type: 'calendar' as const,
        } satisfies LiveNotificationPlan;
      })
      .filter((plan): plan is Exclude<typeof plan, null> => plan !== null);
  });
}

function buildHabitPlans(habits: Habit[], habitLogs: HabitLog[], settings: UserSettings, now: Date) {
  if (!settings.habitNotifications) {
    return [] as LiveNotificationPlan[];
  }

  return habits.flatMap((habit) => {
    if (habit.isArchived || !habit.reminderTime) {
      return [] as LiveNotificationPlan[];
    }

    const completedToday = habitLogs.some((log) => log.habitId === habit.id && log.completed && isSameLocalDay(log.date, now));
    if (completedToday) {
      return [] as LiveNotificationPlan[];
    }

    const [hours, minutes] = habit.reminderTime.split(':').map(Number);
    const reminderDate = new Date(now);
    reminderDate.setHours(hours, minutes, 0, 0);
    if (!isWithinRuntimeWindow(reminderDate, now)) {
      return [] as LiveNotificationPlan[];
    }

    const dedupeKey = `habit-${habit.id}-${getMonthKey(reminderDate.toISOString())}-${now.getDate()}`;
    return [{
      actionUrl: '/habits',
      dedupeKey,
      id: createNotificationId('habit', dedupeKey),
      meta: { title: habit.name },
      originModule: 'habits' as const,
      scheduledFor: reminderDate.toISOString(),
      sourceEventId: habit.id,
      type: 'habit' as const,
    }];
  });
}

function buildFinancePlans(budgets: Budget[], transactions: Transaction[], settings: UserSettings, now: Date) {
  if (!settings.financeAlerts) {
    return [] as LiveNotificationPlan[];
  }

  const monthKey = getMonthKey(now.toISOString());
  const monthlyExpenses = transactions
    .filter((transaction) => transaction.type === 'expense' && getMonthKey(transaction.date) === monthKey)
    .reduce<Record<string, number>>((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] ?? 0) + Math.abs(transaction.amount);
      return acc;
    }, {});

  return budgets.flatMap((budget) => {
    if (budget.amount <= 0) {
      return [] as LiveNotificationPlan[];
    }

    const spent = monthlyExpenses[budget.category] ?? 0;
    const threshold = budget.amount * (budget.alertThreshold / 100);
    if (spent < threshold) {
      return [] as LiveNotificationPlan[];
    }

    const percentage = Math.round((spent / budget.amount) * 100);
    const dedupeKey = `budget-${budget.id}-${monthKey}`;
    return [{
      actionUrl: '/finances',
      dedupeKey,
      id: createNotificationId('finance', dedupeKey),
      meta: { category: budget.category, percentage },
      originModule: 'finances' as const,
      scheduledFor: now.toISOString(),
      sourceEventId: budget.id,
      type: 'finance' as const,
    }];
  });
}

export function buildLiveNotificationPlans({
  budgets,
  events,
  habitLogs,
  habits,
  now = new Date(),
  settings,
  tasks,
  transactions,
}: BuildPlansArgs) {
  if (!settings.notificationsEnabled) {
    return [] as LiveNotificationPlan[];
  }

  return [
    ...buildTaskPlans(tasks, settings, now),
    ...buildCalendarPlans(events, settings, now),
    ...buildHabitPlans(habits, habitLogs, settings, now),
    ...buildFinancePlans(budgets, transactions, settings, now),
  ];
}
