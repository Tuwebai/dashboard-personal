import { StateCreator } from 'zustand';
import { ActivitySlice, AppStore } from '../types';
import { genId } from '../../shared/lib/id';

import { format } from 'date-fns';

export const createActivitySlice: StateCreator<
  AppStore,
  [["zustand/immer", never], ["zustand/persist", unknown]],
  [],
  ActivitySlice
> = (set) => ({
  notifications: [],
  activities: [],

  markNotificationRead: (id) => set(state => {
    const notif = state.notifications.find(n => n.id === id);
    if (notif) notif.isRead = true;
  }),

  markAllNotificationsRead: () => set(state => {
    state.notifications.forEach(n => { n.isRead = true; });
  }),

  addActivity: (activityData) => set(state => {
    state.activities.unshift({
      ...activityData,
      id: genId(),
      createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    });
    if (state.activities.length > 50) state.activities = state.activities.slice(0, 50);
  }),

  addNotification: (notifData) => set(state => {
    state.notifications.unshift({
      ...notifData,
      id: genId(),
      createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    });
  }),
});
