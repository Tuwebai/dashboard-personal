import { normalizePersistedWorkspaceSnapshot, type PersistedWorkspaceSnapshot } from './workspace';

const REMOTE_CACHE_KEY_PREFIX = 'nexus-crm-remote-cache';

export interface CachedWorkspaceEnvelope {
  uid: string;
  updatedAt: string;
  snapshot: PersistedWorkspaceSnapshot;
}

function getRemoteCacheKey(uid: string) {
  return `${REMOTE_CACHE_KEY_PREFIX}:${uid}`;
}

export function readWorkspaceCache(uid: string): CachedWorkspaceEnvelope | null {
  if (typeof window === 'undefined' || !uid) {
    return null;
  }

  const raw = window.localStorage.getItem(getRemoteCacheKey(uid));
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as CachedWorkspaceEnvelope;
    if (parsed?.uid !== uid || !parsed?.snapshot) {
      return null;
    }

    const normalizedSnapshot = normalizePersistedWorkspaceSnapshot(parsed.snapshot);
    if (!normalizedSnapshot) {
      return null;
    }

    if (JSON.stringify(normalizedSnapshot) !== JSON.stringify(parsed.snapshot)) {
      writeWorkspaceCache(uid, normalizedSnapshot, parsed.updatedAt);
    }

    return {
      ...parsed,
      snapshot: normalizedSnapshot,
    };
  } catch {
    return null;
  }
}

export function writeWorkspaceCache(uid: string, snapshot: PersistedWorkspaceSnapshot, updatedAt: string) {
  if (typeof window === 'undefined' || !uid) {
    return;
  }

  const payload: CachedWorkspaceEnvelope = {
    uid,
    updatedAt,
    snapshot: normalizePersistedWorkspaceSnapshot(snapshot) ?? snapshot,
  };

  window.localStorage.setItem(getRemoteCacheKey(uid), JSON.stringify(payload));
}

export function clearWorkspaceCache(uid?: string | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (uid) {
    window.localStorage.removeItem(getRemoteCacheKey(uid));
    return;
  }

  Object.keys(window.localStorage)
    .filter((key) => key.startsWith(`${REMOTE_CACHE_KEY_PREFIX}:`))
    .forEach((key) => window.localStorage.removeItem(key));
}
