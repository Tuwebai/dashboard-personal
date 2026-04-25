import { CURRENT_USER, DEFAULT_SETTINGS } from '../../constants';
import type { AppStore } from '../../../stores/types';
import type { PersistedWorkspaceSnapshot } from './types';

export function mergePersistedWorkspace(
  currentState: AppStore,
  snapshot: PersistedWorkspaceSnapshot,
): Partial<AppStore> {
  return {
    ...snapshot,
    user: {
      ...currentState.user,
      ...snapshot.user,
      id: snapshot.user.id || currentState.user.id,
      name: snapshot.user.name || CURRENT_USER.name,
      email: snapshot.user.email || '',
      avatar: snapshot.user.avatar ?? '',
      bio: snapshot.user.bio ?? '',
      timezone: snapshot.user.timezone || CURRENT_USER.timezone,
    },
    settings: {
      ...DEFAULT_SETTINGS,
      ...currentState.settings,
      ...snapshot.settings,
    },
  };
}
