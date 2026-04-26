import { useEffect } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { shouldUseFirebasePersistence } from '../persistence/config';
import { subscribeNotificationInbox } from './firestore';

export function useNotificationSync() {
  const authStatus = useAppStore((state) => state.authStatus);
  const authProvider = useAppStore((state) => state.authProvider);
  const firebaseUid = useAppStore((state) => state.firebaseUid);
  const setNotifications = useAppStore((state) => state.setNotifications);

  useEffect(() => {
    if (!shouldUseFirebasePersistence() || authStatus !== 'authenticated') {
      setNotifications([]);
      return;
    }

    if (authProvider !== 'password' || !firebaseUid) {
      return;
    }

    const unsubscribe = subscribeNotificationInbox(firebaseUid, (notifications) => {
      setNotifications(notifications);
    });

    return () => {
      unsubscribe();
    };
  }, [authProvider, authStatus, firebaseUid, setNotifications]);
}
