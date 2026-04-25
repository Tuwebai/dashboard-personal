import { useMemo } from 'react';
import type { ActivityItem, CalendarEvent, Note } from '../../../shared/types';

export function useDashboardActivityStats(notes: Note[], events: CalendarEvent[], activities: ActivityItem[]) {
  return useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const notesThisWeek = notes.filter((note) => new Date(note.createdAt) >= weekAgo).length;
    const upcomingEvents = events
      .filter((event) => new Date(event.startDate) >= new Date())
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 3);

    return {
      notesThisWeek,
      upcomingEvents,
      activities,
    };
  }, [notes, events, activities]);
}
