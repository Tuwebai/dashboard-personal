import {
  getDefaultPersistedWorkspaceSnapshot,
  type PersistedWorkspaceSnapshot,
} from './workspace';

export function isRemoteStatePayload(value: unknown): value is { state: PersistedWorkspaceSnapshot; updatedAt?: string } {
  return typeof value === 'object' && value !== null && 'state' in value;
}

export function createScopedInitialSnapshot(uid: string, email: string | null): PersistedWorkspaceSnapshot {
  const snapshot = getDefaultPersistedWorkspaceSnapshot();

  return {
    ...snapshot,
    user: {
      ...snapshot.user,
      id: uid,
      email: email ?? '',
    },
  };
}
