import { useEffect } from 'react';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { useAppStore } from '../../stores/useAppStore';
import { getFirebaseAuthUser, getFirebaseFirestore, shouldUseFirebasePersistence, subscribeToFirebaseAuth } from './firebase';
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
import {
  createScopedInitialSnapshot,
  isRemoteStatePayload,
  isSnapshotOwnedByUser,
  shouldApplyRemoteState,
} from './syncWorkspace';

const DEFAULT_FIREBASE_DOC_PATH = 'users/{uid}/crm/dashboard';
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

export function useFirebasePersistenceSync() {
  useEffect(() => {
    if (!shouldUseFirebasePersistence()) {
      return;
    }

    let cancelled = false;
    let syncTimeout: number | null = null;
    let remoteHydrated = false;
    let currentUid: string | null = null;
    let storeUnsubscribe: () => void = () => undefined;
    let remoteUnsubscribe: (() => void) | null = null;

    const teardownStoreSubscription = () => {
      storeUnsubscribe();
      storeUnsubscribe = () => undefined;
    };

    const teardownRemoteSubscription = () => {
      remoteUnsubscribe?.();
      remoteUnsubscribe = null;
    };

    const resetWorkspaceForUser = (uid: string, email: string | null) => {
      useAppStore.setState((state) => mergePersistedWorkspace(state, createScopedInitialSnapshot(uid, email)));
    };

    const setupSync = async (uid: string, email: string | null) => {
      const remoteDocRef = getRemoteDocRef();

      if (!remoteDocRef) {
        dispatchSyncStatus('error', getLastSyncAt(uid));
        pushSyncErrorNotification();
        return;
      }

      dispatchSyncStatus('hydrating', getLastSyncAt(uid));

      try {
        const snapshot = await getDoc(remoteDocRef);

        if (cancelled) {
          remoteHydrated = true;
        } else if (!snapshot.exists()) {
          const initialUpdatedAt = new Date().toISOString();
          const localSnapshot = pickPersistedWorkspace(useAppStore.getState());
          const initialState = isSnapshotOwnedByUser(localSnapshot, uid)
            ? {
                ...localSnapshot,
                user: {
                  ...localSnapshot.user,
                  id: uid,
                  email: email ?? localSnapshot.user.email,
                },
              }
            : createScopedInitialSnapshot(uid, email);

          await setDoc(
            remoteDocRef,
            {
              updatedAt: initialUpdatedAt,
              state: initialState,
            },
            { merge: true },
          );

          useAppStore.setState((state) => mergePersistedWorkspace(state, initialState));
          setLastSyncAt(uid, initialUpdatedAt);
          dispatchSyncStatus('synced', initialUpdatedAt);
          remoteHydrated = true;
        } else {
          const data = snapshot.data();

          if (isRemoteStatePayload(data) && isPersistedWorkspaceSnapshot(data.state)) {
            const remoteUpdatedAt = typeof data.updatedAt === 'string' ? data.updatedAt : '';
            const localUpdatedAt = getLastSyncAt(uid);

            if (shouldApplyRemoteState(remoteUpdatedAt, localUpdatedAt)) {
              useAppStore.setState((currentState) => mergePersistedWorkspace(currentState, data.state));
              setLastSyncAt(uid, remoteUpdatedAt);
              dispatchSyncStatus('synced', remoteUpdatedAt);
            }
          }
        }
      } catch {
        dispatchSyncStatus('error', getLastSyncAt(uid));
        pushSyncErrorNotification();
        remoteHydrated = true;
        return;
      }

      dispatchSyncStatus('synced', getLastSyncAt(uid));
      remoteHydrated = true;
      teardownRemoteSubscription();
      remoteUnsubscribe = onSnapshot(remoteDocRef, (snapshot) => {
        if (!snapshot.exists()) {
          return;
        }

        const data = snapshot.data();
        if (!isRemoteStatePayload(data) || !isPersistedWorkspaceSnapshot(data.state)) {
          return;
        }

        const remoteUpdatedAt = typeof data.updatedAt === 'string' ? data.updatedAt : '';
        const localUpdatedAt = getLastSyncAt(uid);

        if (!shouldApplyRemoteState(remoteUpdatedAt, localUpdatedAt)) {
          return;
        }

        useAppStore.setState((state) => mergePersistedWorkspace(state, data.state));
        setLastSyncAt(uid, remoteUpdatedAt);
        dispatchSyncStatus('synced', remoteUpdatedAt);
      });

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
          dispatchSyncStatus('syncing', getLastSyncAt(uid));

          void setDoc(
            remoteDocRef,
            {
              updatedAt,
              state: pickPersistedWorkspace(state),
            },
            { merge: true },
          )
            .then(() => {
              setLastSyncAt(uid, updatedAt);
              dispatchSyncStatus('synced', updatedAt);
            })
            .catch(() => {
              dispatchSyncStatus('error', getLastSyncAt(uid));
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
        currentUid = null;
        remoteHydrated = false;
        teardownStoreSubscription();
        teardownRemoteSubscription();
        clearLastSyncAt();
        dispatchSyncStatus('idle');
        return;
      }

      if (currentUid && currentUid !== user.uid) {
        resetWorkspaceForUser(user.uid, user.email);
      }

      currentUid = user.uid;
      remoteHydrated = false;
      teardownStoreSubscription();
      teardownRemoteSubscription();
      void setupSync(user.uid, user.email);
    });

    return () => {
      cancelled = true;

      if (syncTimeout) {
        window.clearTimeout(syncTimeout);
      }

      teardownStoreSubscription();
      teardownRemoteSubscription();
      authUnsubscribe();
    };
  }, []);
}
