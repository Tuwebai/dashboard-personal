import { useEffect } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { CURRENT_USER } from '../constants';
import { shouldUseFirebasePersistence, subscribeToFirebaseAuth } from './firebase';

export function useFirebaseAuthBootstrap() {
  const updateUser = useAppStore((state) => state.updateUser);
  const setAuthState = useAppStore((state) => state.setAuthState);

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
        setAuthState({
          authStatus: 'unauthenticated',
          authProvider: null,
          firebaseUid: null,
        });
        updateUser({
          id: CURRENT_USER.id,
          email: '',
        });
        return;
      }

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
