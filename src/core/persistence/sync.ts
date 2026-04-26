import { useEffect } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { isFirebasePersistenceConfigured } from './config';
import { loadFirebaseBridge, loadRemoteWorkspaceBridge } from './firebaseLoaders';
import {
  hasLegacyAppearanceSnapshotFields,
  isPersistedWorkspaceSnapshot,
  mergePersistedWorkspace,
  normalizePersistedWorkspaceSnapshot,
  pickPersistedWorkspace,
} from './workspace';
import {
  clearLastSyncError,
  clearLastSyncAt,
  dispatchSyncStatus,
  getLastSyncAt,
  pushSyncErrorNotification,
  setLastSyncError,
  setLastSyncAt,
} from './syncMetadata';
import { resolvePersistenceSyncError } from './syncErrors';
import { clearWorkspaceCache, readWorkspaceCache, writeWorkspaceCache } from './remoteCache';
import { createScopedInitialSnapshot, isRemoteStatePayload } from './syncWorkspace';
import { usePersistenceModeValue } from './usePersistenceModeValue';

const SYNC_DEBOUNCE_MS = 1200;

export function useFirebasePersistenceSync() {
  const persistenceMode = usePersistenceModeValue();

  useEffect(() => {
    if (persistenceMode !== 'firebase' || !isFirebasePersistenceConfigured()) {
      dispatchSyncStatus('idle');
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
    const firebaseBridgePromise = loadFirebaseBridge();
    const remoteWorkspaceBridgePromise = loadRemoteWorkspaceBridge();

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

          void remoteWorkspaceBridgePromise
            .then(({ writeWorkspaceRemote }) => writeWorkspaceRemote(uid, { updatedAt, state: snapshot }))
            .then(() => {
              setLastSyncAt(uid, updatedAt);
              clearLastSyncError(uid);
              writeWorkspaceCache(uid, snapshot, updatedAt);
              lastConfirmedSnapshot = serialized;
              pendingLocalUpdatedAt = '';
              dispatchSyncStatus('synced', updatedAt);
            })
            .catch((error: unknown) => {
              const syncError = resolvePersistenceSyncError(error);
              pendingLocalUpdatedAt = '';
              setLastSyncError(uid, syncError);
              dispatchSyncStatus('error', getLastSyncAt(uid), syncError);
              pushSyncErrorNotification(syncError);
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
        const {
          hydrateWorkspaceFromRemote,
          subscribeWorkspaceRemote,
          writeWorkspaceRemote,
        } = await remoteWorkspaceBridgePromise;
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
            const normalizedSnapshot = normalizePersistedWorkspaceSnapshot(data.state);
            if (!normalizedSnapshot) {
              throw new Error('persistence/invalid-remote-payload');
            }

            const remoteUpdatedAt = typeof data.updatedAt === 'string' ? data.updatedAt : new Date().toISOString();
            const shouldRewriteRemote =
              hasLegacyAppearanceSnapshotFields(data.state)
              || JSON.stringify(normalizedSnapshot) !== JSON.stringify(data.state);
            const appliedUpdatedAt = shouldRewriteRemote ? new Date().toISOString() : remoteUpdatedAt;

            if (shouldRewriteRemote) {
              await writeWorkspaceRemote(uid, {
                updatedAt: appliedUpdatedAt,
                state: normalizedSnapshot,
              });
            }

            applySnapshot(uid, normalizedSnapshot, appliedUpdatedAt);
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
        clearLastSyncError(uid);
        dispatchSyncStatus('ready', getLastSyncAt(uid));

        remoteUnsubscribe?.();
        remoteUnsubscribe = subscribeWorkspaceRemote(uid, (payload) => {
          if (cancelled || currentUid !== uid || syncing || !payload) {
            return;
          }

          if (!isRemoteStatePayload(payload) || !isPersistedWorkspaceSnapshot(payload.state)) {
            const syncError = resolvePersistenceSyncError(new Error('persistence/invalid-remote-payload'));
            setLastSyncError(uid, syncError);
            dispatchSyncStatus('error', getLastSyncAt(uid), syncError);
            pushSyncErrorNotification(syncError);
            return;
          }

          const normalizedSnapshot = normalizePersistedWorkspaceSnapshot(payload.state);
          if (!normalizedSnapshot) {
            const syncError = resolvePersistenceSyncError(new Error('persistence/invalid-remote-payload'));
            setLastSyncError(uid, syncError);
            dispatchSyncStatus('error', getLastSyncAt(uid), syncError);
            pushSyncErrorNotification(syncError);
            return;
          }

          const remoteUpdatedAt = typeof payload.updatedAt === 'string' ? payload.updatedAt : '';
          if (pendingLocalUpdatedAt && remoteUpdatedAt <= pendingLocalUpdatedAt) {
            return;
          }

          if (remoteUpdatedAt && remoteUpdatedAt <= getLastSyncAt(uid)) {
            return;
          }

          applySnapshot(uid, normalizedSnapshot, remoteUpdatedAt || new Date().toISOString());
          clearLastSyncError(uid);
          dispatchSyncStatus('ready', getLastSyncAt(uid));
        });

        enableWriteSync(uid);
      } catch (error) {
        if (cancelled || currentUid !== uid) {
          return;
        }

        const syncError = resolvePersistenceSyncError(error);
        setLastSyncError(uid, syncError);

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
          dispatchSyncStatus('offline-readonly', cached.updatedAt, syncError);
          pushSyncErrorNotification(syncError);
          return;
        }

        setWorkspaceReadOnly(true);
        dispatchSyncStatus('error', getLastSyncAt(uid), syncError);
        pushSyncErrorNotification(syncError);
      }
    };

    let authUnsubscribe: () => void = () => undefined;

    void firebaseBridgePromise.then(({ subscribeToFirebaseAuth }) => {
      if (cancelled) {
        return;
      }

      authUnsubscribe = subscribeToFirebaseAuth((user) => {
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
          clearLastSyncError(previousUid);
          clearLastSyncAt(previousUid);
          clearWorkspaceCache(previousUid);
          dispatchSyncStatus('idle');
          setWorkspaceReadOnly(false);
          return;
        }

        currentUid = user.uid;
        void bootRemoteWorkspace(user.uid, user.email);
      });
    });

    return () => {
      cancelled = true;
      teardownSubscriptions();
      authUnsubscribe();
    };
  }, [persistenceMode]);
}
