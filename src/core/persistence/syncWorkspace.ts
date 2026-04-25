import {
  getDefaultPersistedWorkspaceSnapshot,
  type PersistedWorkspaceSnapshot,
} from './workspace';

export function isRemoteStatePayload(value: unknown): value is { state: PersistedWorkspaceSnapshot; updatedAt?: string } {
  return typeof value === 'object' && value !== null && 'state' in value;
}

export function shouldApplyRemoteState(remoteUpdatedAt: string, localUpdatedAt: string) {
  const remoteTimestamp = Date.parse(remoteUpdatedAt || '');
  const localTimestamp = Date.parse(localUpdatedAt || '');

  return (Number.isNaN(remoteTimestamp) ? 0 : remoteTimestamp) > (Number.isNaN(localTimestamp) ? 0 : localTimestamp);
}

export function shouldIgnorePendingRemoteEcho(remoteUpdatedAt: string, pendingLocalUpdatedAt: string) {
  if (!pendingLocalUpdatedAt) {
    return false;
  }

  const remoteTimestamp = Date.parse(remoteUpdatedAt || '');
  const pendingTimestamp = Date.parse(pendingLocalUpdatedAt || '');

  return (Number.isNaN(remoteTimestamp) ? 0 : remoteTimestamp) <= (Number.isNaN(pendingTimestamp) ? 0 : pendingTimestamp);
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

export function isSnapshotOwnedByUser(snapshot: PersistedWorkspaceSnapshot, uid: string) {
  return !snapshot.user.id || snapshot.user.id === uid;
}
