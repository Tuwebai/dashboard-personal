import { useEffect, useRef } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { shouldUseFirebasePersistence, subscribeToFirebaseAuth } from './firebase';
import { resetWorkspaceForSession } from './workspace';

export function useFirebaseAuthBootstrap() {
  const updateUser = useAppStore((state) => state.updateUser);
  const setAuthState = useAppStore((state) => state.setAuthState);
  const previousUidRef = useRef<string | null>(null);

  useEffect(() => {
    if (!shouldUseFirebasePersistence()) {
      setAuthState({
        authStatus: 'authenticated',
        authProvider: null,
        firebaseUid: null,
      });
      return;
    }

    return subscribeToFirebaseAuth((user) => {
      if (!user) {
        previousUidRef.current = null;
        resetWorkspaceForSession();
        setAuthState({
          authStatus: 'unauthenticated',
          authProvider: null,
          firebaseUid: null,
        });
        return;
      }

      if (previousUidRef.current !== user.uid) {
        resetWorkspaceForSession(user.uid, user.email);
      }

      previousUidRef.current = user.uid;
      const authProvider = user.isAnonymous ? 'anonymous' : 'password';
      updateUser({
        id: user.uid,
        email: user.email ?? '',
      });
      setAuthState({
        authStatus: 'authenticated',
        authProvider,
        firebaseUid: user.uid,
      });
    });
  }, [setAuthState, updateUser]);
}
