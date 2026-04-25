import { useEffect } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { ensureFirebaseAuth, shouldUseFirebasePersistence, subscribeToFirebaseAuth } from './firebase';

export function useFirebaseAuthBootstrap() {
  const updateUser = useAppStore((state) => state.updateUser);

  useEffect(() => {
    if (!shouldUseFirebasePersistence()) {
      return;
    }

    void ensureFirebaseAuth();

    return subscribeToFirebaseAuth((user) => {
      if (!user) {
        return;
      }

      updateUser({
        id: user.uid,
        email: user.email ?? '',
      });
    });
  }, [updateUser]);
}
