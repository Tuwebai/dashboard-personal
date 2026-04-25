import { useEffect } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { shouldUseFirebasePersistence, subscribeToFirebaseAuth } from './firebase';
import {
  isPersistedWorkspaceSnapshot,
  mergePersistedWorkspace,
  pickPersistedWorkspace,
} from './workspace';
import {
  clearLastSyncAt,
  dispatchSyncStatus,
  getLastSyncAt,
  pushSyncErrorNotification,
  setLastSyncAt,
} from './syncMetadata';
import { clearWorkspaceCache, readWorkspaceCache, writeWorkspaceCache } from './remoteCache';
import {
  hydrateWorkspaceFromRemote,
  subscribeWorkspaceRemote,
  writeWorkspaceRemote,
} from './remoteWorkspace';
import { createScopedInitialSnapshot, isRemoteStatePayload } from './syncWorkspace';

const SYNC_DEBOUNCE_MS = 1200;

export function useFirebasePersistenceSync() {
  useEffect(() => {
    if (!shouldUseFirebasePersistence()) {
      return;
    }

    let cancelled = false;
    let currentUid: string | null = null;
    let remoteHydrated = false;
    let syncing = false;
    let pendingLocalUpdatedAt = '';
    let lastConfirmedSnapshot = '';
    let syncTimeout: number | null = null;
    let storeUnsubscribe: () => void = () => undefined;
    let remoteUnsubscribe: (() => void) | null = null;

    const setAuthState = useAppStore.getState().setAuthState;
    const setWorkspaceReadOnly = useAppStore.getState().setWorkspaceReadOnly;

    const clearSyncTimer = () => {
      if (syncTimeout) {
        window.clearTimeout(syncTimeout);
        syncTimeout = null;
      }
    };

    const teardownSubscriptions = () => {
      clearSyncTimer();
      storeUnsubscribe();
      storeUnsubscribe = () => undefined;
      remoteUnsubscribe?.();
      remoteUnsubscribe = null;
    };

    const applySnapshot = (uid: string, snapshot: ReturnType<typeof pickPersistedWorkspace>, updatedAt: string) => {
      useAppStore.setState((state) => mergePersistedWorkspace(state, snapshot));
      setLastSyncAt(uid, updatedAt);
      writeWorkspaceCache(uid, snapshot, updatedAt);
      lastConfirmedSnapshot = JSON.stringify(snapshot);
      pendingLocalUpdatedAt = '';
    };

    const enableWriteSync = (uid: string) => {
      storeUnsubscribe();
      storeUnsubscribe = useAppStore.subscribe((state) => {
        if (!remoteHydrated || syncing || useAppStore.getState().workspaceReadOnly || currentUid !== uid) {
          return;
        }

        const snapshot = pickPersistedWorkspace(state);
        const serialized = JSON.stringify(snapshot);

        if (serialized === lastConfirmedSnapshot) {
          return;
        }

        clearSyncTimer();
        syncTimeout = window.setTimeout(() => {
          if (cancelled || currentUid !== uid || useAppStore.getState().workspaceReadOnly) {
            return;
          }

          const updatedAt = new Date().toISOString();
          syncing = true;
          pendingLocalUpdatedAt = updatedAt;
          dispatchSyncStatus('syncing', getLastSyncAt(uid));

          void writeWorkspaceRemote(uid, { updatedAt, state: snapshot })
            .then(() => {
              setLastSyncAt(uid, updatedAt);
              writeWorkspaceCache(uid, snapshot, updatedAt);
              lastConfirmedSnapshot = serialized;
              pendingLocalUpdatedAt = '';
              dispatchSyncStatus('synced', updatedAt);
            })
            .catch(() => {
              pendingLocalUpdatedAt = '';
              dispatchSyncStatus('error', getLastSyncAt(uid));
              pushSyncErrorNotification();
            })
            .finally(() => {
              syncing = false;
            });
        }, SYNC_DEBOUNCE_MS);
      });
    };

    const bootRemoteWorkspace = async (uid: string, email: string | null) => {
      dispatchSyncStatus('auth-resolving', getLastSyncAt(uid));
      remoteHydrated = false;
      setWorkspaceReadOnly(false);

      try {
        const snapshot = await hydrateWorkspaceFromRemote(uid);
        if (cancelled || currentUid !== uid) {
          return;
        }

        dispatchSyncStatus('hydrating', getLastSyncAt(uid));

        if (!snapshot?.exists()) {
          const updatedAt = new Date().toISOString();
          const initialState = createScopedInitialSnapshot(uid, email);
          await writeWorkspaceRemote(uid, {
            updatedAt,
            state: initialState,
          });

          if (cancelled || currentUid !== uid) {
            return;
          }

          applySnapshot(uid, initialState, updatedAt);
        } else {
          const data = snapshot.data();
          if (isRemoteStatePayload(data) && isPersistedWorkspaceSnapshot(data.state)) {
            applySnapshot(uid, data.state, typeof data.updatedAt === 'string' ? data.updatedAt : new Date().toISOString());
          } else {
            throw new Error('persistence/invalid-remote-payload');
          }
        }

        setAuthState({
          authStatus: 'authenticated',
          authProvider: useAppStore.getState().authProvider,
          firebaseUid: uid,
        });
        remoteHydrated = true;
        dispatchSyncStatus('ready', getLastSyncAt(uid));

        remoteUnsubscribe?.();
        remoteUnsubscribe = subscribeWorkspaceRemote(uid, (payload) => {
          if (cancelled || currentUid !== uid || syncing || !payload) {
            return;
          }

          if (!isRemoteStatePayload(payload) || !isPersistedWorkspaceSnapshot(payload.state)) {
            return;
          }

          const remoteUpdatedAt = typeof payload.updatedAt === 'string' ? payload.updatedAt : '';
          if (pendingLocalUpdatedAt && remoteUpdatedAt <= pendingLocalUpdatedAt) {
            return;
          }

          if (remoteUpdatedAt && remoteUpdatedAt <= getLastSyncAt(uid)) {
            return;
          }

          applySnapshot(uid, payload.state, remoteUpdatedAt || new Date().toISOString());
          dispatchSyncStatus('ready', getLastSyncAt(uid));
        });

        enableWriteSync(uid);
      } catch {
        if (cancelled || currentUid !== uid) {
          return;
        }

        const cached = readWorkspaceCache(uid);
        if (cached?.snapshot) {
          useAppStore.setState((state) => mergePersistedWorkspace(state, cached.snapshot));
          setLastSyncAt(uid, cached.updatedAt);
          lastConfirmedSnapshot = JSON.stringify(cached.snapshot);
          remoteHydrated = true;
          setWorkspaceReadOnly(true);
          setAuthState({
            authStatus: 'authenticated',
            authProvider: useAppStore.getState().authProvider,
            firebaseUid: uid,
          });
          dispatchSyncStatus('offline-readonly', cached.updatedAt);
          return;
        }

        setWorkspaceReadOnly(true);
        dispatchSyncStatus('error', getLastSyncAt(uid));
        pushSyncErrorNotification();
      }
    };

    const authUnsubscribe = subscribeToFirebaseAuth((user) => {
      if (cancelled) {
        return;
      }

      teardownSubscriptions();
      remoteHydrated = false;
      syncing = false;
      pendingLocalUpdatedAt = '';
      lastConfirmedSnapshot = '';

      if (!user) {
        const previousUid = currentUid;
        currentUid = null;
        clearLastSyncAt(previousUid);
        clearWorkspaceCache(previousUid);
        dispatchSyncStatus('idle');
        setWorkspaceReadOnly(false);
        return;
      }

      currentUid = user.uid;
      void bootRemoteWorkspace(user.uid, user.email);
    });

    return () => {
      cancelled = true;
      teardownSubscriptions();
      authUnsubscribe();
    };
  }, []);
}
