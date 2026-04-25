import { useAppStore } from '../../../stores/useAppStore';
import { mergePersistedWorkspace } from './merge';
import { getDefaultPersistedWorkspaceSnapshot } from './types';

export function resetWorkspaceForSession(uid?: string | null, email?: string | null) {
  const snapshot = getDefaultPersistedWorkspaceSnapshot();

  if (uid) {
    snapshot.user = {
      ...snapshot.user,
      id: uid,
      email: email ?? '',
    };
  }

  useAppStore.setState((state) => mergePersistedWorkspace(state, snapshot));
}
