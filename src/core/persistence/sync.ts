import { useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAppStore } from '../../stores/useAppStore';
import type { AppStore } from '../../stores/types';
import { getFirebaseAuthUser, getFirebaseFirestore, shouldUseFirebasePersistence, subscribeToFirebaseAuth } from './firebase';

const DEFAULT_FIREBASE_DOC_PATH = 'users/{uid}/crm/dashboard';
const LAST_SYNC_AT_STORAGE_KEY = 'nexus-crm-last-sync-at';
const SYNC_EVENT_NAME = 'nexus-crm:persistence-sync';
const SYNC_DEBOUNCE_MS = 1200;

function getFirebaseDocPath() {
  const template = import.meta.env.VITE_FIREBASE_PERSISTENCE_DOC_PATH ?? DEFAULT_FIREBASE_DOC_PATH;
  const uid = getFirebaseAuthUser()?.uid;

  if (!uid) {
    return '';
  }

  return template.replace('{uid}', uid);
}

function getRemoteDocRef() {
  const firestore = getFirebaseFirestore();

  if (!firestore) {
    return null;
  }

  const path = getFirebaseDocPath().split('/').filter(Boolean);

  if (path.length % 2 !== 0 || path.length < 2) {
    return null;
  }

  return doc(firestore, path.join('/'));
}

function isRemoteStatePayload(value: unknown): value is { state: Partial<AppStore>; updatedAt?: string } {
  return typeof value === 'object' && value !== null && 'state' in value;
}

export function getLastSyncAt() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(LAST_SYNC_AT_STORAGE_KEY) ?? '';
}

function setLastSyncAt(value: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(LAST_SYNC_AT_STORAGE_KEY, value);
}

function dispatchSyncStatus(status: 'idle' | 'syncing' | 'synced' | 'error', updatedAt?: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail: { status, updatedAt } }));
}

function pushSyncErrorNotification() {
  const store = useAppStore.getState();
  const now = new Date().toISOString();
  const alreadyExists = store.notifications.some(
    (notification) =>
      notification.type === 'system' &&
      notification.title === 'Sincronización Firebase' &&
      !notification.isRead,
  );

  if (alreadyExists) {
    return;
  }

  useAppStore.setState((currentState) => ({
    notifications: [
      {
        id: `sync-error-${Date.now()}`,
        type: 'system',
        title: 'Sincronización Firebase',
        message: 'Falló la última sincronización remota. La app sigue usando la copia local.',
        isRead: false,
        createdAt: now,
      },
      ...currentState.notifications,
    ],
  }));
}

function getTimestamp(value: string | undefined) {
  if (!value) {
    return 0;
  }

  const timestamp = Date.parse(value);

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function shouldApplyRemoteState(remoteUpdatedAt: string, localUpdatedAt: string) {
  return getTimestamp(remoteUpdatedAt) > getTimestamp(localUpdatedAt);
}

function mergePersistedState(currentState: AppStore, remoteState: Partial<AppStore>) {
  const remoteUser = remoteState.user;
  const remoteSettings = remoteState.settings;

  return {
    ...currentState,
    ...remoteState,
    user: remoteUser
      ? {
          ...currentState.user,
          ...remoteUser,
          name: remoteUser.name || currentState.user.name,
          email: remoteUser.email || currentState.user.email,
          timezone: remoteUser.timezone || currentState.user.timezone,
        }
      : currentState.user,
    settings: remoteSettings
      ? {
          ...currentState.settings,
          ...remoteSettings,
        }
      : currentState.settings,
    notifications: remoteState.notifications ?? currentState.notifications,
    activities: remoteState.activities ?? currentState.activities,
  };
}

function pickPersistedState(state: AppStore) {
  return {
    user: state.user,
    settings: state.settings,
    theme: state.theme,
    sidebarCollapsed: state.sidebarCollapsed,
    taskView: state.taskView,
    taskFilters: state.taskFilters,
    calendarView: state.calendarView,
    tasks: state.tasks,
    tags: state.tags,
    habits: state.habits,
    habitLogs: state.habitLogs,
    routines: state.routines,
    activeRoutineSession: state.activeRoutineSession,
    accounts: state.accounts,
    transactions: state.transactions,
    budgets: state.budgets,
    goals: state.goals,
    personalGoals: state.personalGoals,
    goalView: state.goalView,
    goalFilters: state.goalFilters,
    events: state.events,
    weeklyFocus: state.weeklyFocus,
    weeklyFocusGoalId: state.weeklyFocusGoalId,
    weeklyTopPriorities: state.weeklyTopPriorities,
    weeklyPriorityTaskIds: state.weeklyPriorityTaskIds,
    weeklyNotes: state.weeklyNotes,
    dailyTop3: state.dailyTop3,
    dailyHighlightedTaskIds: state.dailyHighlightedTaskIds,
    dailyIntention: state.dailyIntention,
    dailyQuickNotes: state.dailyQuickNotes,
    notes: state.notes,
    journalEntries: state.journalEntries,
    journalingContextDate: state.journalingContextDate,
    focusSessions: state.focusSessions,
    selectedFocusSessionId: state.selectedFocusSessionId,
    folders: state.folders,
    notifications: state.notifications,
    activities: state.activities,
  };
}

export function useFirebasePersistenceSync() {
  useEffect(() => {
    if (!shouldUseFirebasePersistence()) {
      return;
    }

    let cancelled = false;
    let syncTimeout: number | null = null;
    let remoteHydrated = false;
    let storeUnsubscribe: () => void = () => undefined;

    const teardownStoreSubscription = () => {
      storeUnsubscribe();
      storeUnsubscribe = () => undefined;
    };

    const setupSync = async () => {
      const remoteDocRef = getRemoteDocRef();

      if (!remoteDocRef) {
        dispatchSyncStatus('error', getLastSyncAt());
        pushSyncErrorNotification();
        return;
      }

      dispatchSyncStatus('idle', getLastSyncAt());

      try {
        dispatchSyncStatus('syncing', getLastSyncAt());
        const snapshot = await getDoc(remoteDocRef);

        if (cancelled) {
          remoteHydrated = true;
        } else if (!snapshot.exists()) {
          const initialUpdatedAt = new Date().toISOString();

          await setDoc(
            remoteDocRef,
            {
              updatedAt: initialUpdatedAt,
              state: pickPersistedState(useAppStore.getState()),
            },
            { merge: true },
          );

          setLastSyncAt(initialUpdatedAt);
          dispatchSyncStatus('synced', initialUpdatedAt);
          remoteHydrated = true;
        } else {
          const data = snapshot.data();

          if (isRemoteStatePayload(data) && data.state && typeof data.state === 'object') {
            const remoteUpdatedAt = typeof data.updatedAt === 'string' ? data.updatedAt : '';
            const localUpdatedAt = getLastSyncAt();

            if (shouldApplyRemoteState(remoteUpdatedAt, localUpdatedAt)) {
              useAppStore.setState((currentState) => mergePersistedState(currentState, data.state));
              setLastSyncAt(remoteUpdatedAt);
              dispatchSyncStatus('synced', remoteUpdatedAt);
            }
          }
        }
      } catch {
        dispatchSyncStatus('error', getLastSyncAt());
        pushSyncErrorNotification();
        remoteHydrated = true;
        return;
      }

      dispatchSyncStatus('synced', getLastSyncAt());
      remoteHydrated = true;

      teardownStoreSubscription();
      storeUnsubscribe = useAppStore.subscribe((state) => {
        if (!remoteHydrated) {
          return;
        }

        if (syncTimeout) {
          window.clearTimeout(syncTimeout);
        }

        syncTimeout = window.setTimeout(() => {
          const updatedAt = new Date().toISOString();
          dispatchSyncStatus('syncing', getLastSyncAt());

          void setDoc(
            remoteDocRef,
            {
              updatedAt,
              state: pickPersistedState(state),
            },
            { merge: true },
          )
            .then(() => {
              setLastSyncAt(updatedAt);
              dispatchSyncStatus('synced', updatedAt);
            })
            .catch(() => {
              dispatchSyncStatus('error', getLastSyncAt());
              pushSyncErrorNotification();
            });
        }, SYNC_DEBOUNCE_MS);
      });
    };

    const authUnsubscribe = subscribeToFirebaseAuth((user) => {
      if (cancelled) {
        return;
      }

      if (!user) {
        remoteHydrated = false;
        teardownStoreSubscription();
        dispatchSyncStatus('idle');
        return;
      }

      remoteHydrated = false;
      teardownStoreSubscription();
      void setupSync();
    });

    return () => {
      cancelled = true;

      if (syncTimeout) {
        window.clearTimeout(syncTimeout);
      }

      teardownStoreSubscription();
      authUnsubscribe();
    };
  }, []);
}
