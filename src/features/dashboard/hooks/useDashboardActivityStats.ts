import { useEffect, useState, useMemo } from 'react';
import type {
  ActivityItem,
  CalendarEvent,
  Habit,
  HabitLog,
  Note,
  Task,
  Transaction,
} from '../../../shared/types';
import type { PersonalGoal } from '../../goals/types';
import type { JournalEntry } from '../../journaling/types';
import type { FocusSession } from '../../focus/types';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const RECENT_ACTIVITY_LIMIT = 10;

interface RecentActivityEvent extends ActivityItem {
  timestamp: number;
}

const parseTimestamp = (value?: string) => {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

const isEditedAfterCreation = (createdAt: string, updatedAt: string) => {
  const created = parseTimestamp(createdAt);
  const updated = parseTimestamp(updatedAt);
  return created !== null && updated !== null && updated > created;
};

const buildActivity = (
  id: string,
  type: ActivityItem['type'],
  title: string,
  description: string,
  icon: string,
  color: string,
  createdAt: string,
): RecentActivityEvent | null => {
  const timestamp = parseTimestamp(createdAt);
  if (timestamp === null) return null;

  return {
    id,
    type,
    title,
    description,
    icon,
    color,
    createdAt,
    timestamp,
  };
};

export function useDashboardActivityStats(
  tasks: Task[],
  habits: Habit[],
  habitLogs: HabitLog[],
  transactions: Transaction[],
  notes: Note[],
  events: CalendarEvent[],
  personalGoals: PersonalGoal[],
  journalEntries: JournalEntry[],
  focusSessions: FocusSession[],
) {
  const [referenceTime, setReferenceTime] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setReferenceTime(Date.now());
    }, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return useMemo(() => {
    const last24HoursThreshold = referenceTime - DAY_IN_MS;
    const weekAgo = new Date(referenceTime - 7 * DAY_IN_MS);

    const notesThisWeek = notes.filter((note) => new Date(note.createdAt) >= weekAgo).length;
    const upcomingEvents = events
      .filter((event) => new Date(event.startDate) >= new Date())
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 3);

    const habitMap = new Map(habits.map((habit) => [habit.id, habit]));

    const recentActivity = [
      ...tasks
        .map((task) => {
          if (task.completedAt) {
            return buildActivity(
              `task-completed-${task.id}`,
              'task_completed',
              task.title,
              'Tarea completada',
              '✓',
              '#3b82f6',
              task.completedAt,
            );
          }

          if (isEditedAfterCreation(task.createdAt, task.updatedAt)) {
            return buildActivity(
              `task-updated-${task.id}`,
              'task_completed',
              task.title,
              'Tarea actualizada',
              '✎',
              '#60a5fa',
              task.updatedAt,
            );
          }

          return buildActivity(
            `task-created-${task.id}`,
            'task_completed',
            task.title,
            'Tarea creada',
            '☐',
            '#3b82f6',
            task.createdAt,
          );
        }),
      ...habitLogs
        .filter((log) => log.completed)
        .map((log) => {
          const habit = habitMap.get(log.habitId);
          if (!habit) return null;

          return buildActivity(
            `habit-log-${log.id}`,
            'habit_checked',
            habit.name,
            'Hábito completado',
            habit.icon || '◉',
            habit.color || '#8b5cf6',
            log.createdAt,
          );
        }),
      ...transactions.map((transaction) =>
        buildActivity(
          `transaction-${transaction.id}`,
          'transaction_added',
          transaction.description || transaction.category,
          transaction.type === 'income' ? 'Ingreso registrado' : 'Gasto registrado',
          transaction.type === 'income' ? '↗' : '↘',
          transaction.type === 'income' ? '#10b981' : '#ef4444',
          transaction.createdAt,
        )
      ),
      ...notes.map((note) =>
        buildActivity(
          `note-${note.id}`,
          'note_created',
          note.title || 'Nota sin título',
          isEditedAfterCreation(note.createdAt, note.updatedAt) ? 'Nota actualizada' : 'Nota creada',
          '📝',
          '#06b6d4',
          isEditedAfterCreation(note.createdAt, note.updatedAt) ? note.updatedAt : note.createdAt,
        )
      ),
      ...events.map((event) =>
        buildActivity(
          `event-${event.id}`,
          'routine_completed',
          event.title,
          'Evento agregado',
          '📅',
          event.color || '#f59e0b',
          event.createdAt,
        )
      ),
      ...personalGoals.map((goal) =>
        buildActivity(
          `goal-${goal.id}`,
          'goal_achieved',
          goal.title,
          goal.status === 'completed' ? 'Meta completada' : 'Meta creada',
          '🎯',
          '#f97316',
          goal.createdAt,
        )
      ),
      ...journalEntries.map((entry) =>
        buildActivity(
          `journal-${entry.id}`,
          'note_created',
          entry.title || 'Registro diario',
          'Entrada de diario creada',
          '📔',
          '#14b8a6',
          entry.createdAt,
        )
      ),
      ...focusSessions.map((session) =>
        buildActivity(
          `focus-${session.id}`,
          'routine_completed',
          session.title,
          session.status === 'completed' ? 'Sesión de foco completada' : 'Sesión de foco creada',
          '⏱',
          '#a855f7',
          session.endedAt ?? session.createdAt,
        )
      ),
    ]
      .filter((activity): activity is RecentActivityEvent => activity !== null)
      .filter((activity) => activity.timestamp >= last24HoursThreshold)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, RECENT_ACTIVITY_LIMIT)
      .map((activity) => {
        const { timestamp, ...item } = activity;
        void timestamp;
        return item;
      });

    return {
      notesThisWeek,
      upcomingEvents,
      recentActivity,
    };
  }, [events, focusSessions, habitLogs, habits, journalEntries, notes, personalGoals, referenceTime, tasks, transactions]);
}
