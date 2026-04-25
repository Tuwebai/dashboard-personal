import type { PersistedWorkspaceSnapshot } from './types';
import { getDefaultPersistedWorkspaceSnapshot } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isPersistedWorkspaceSnapshot(value: unknown): value is PersistedWorkspaceSnapshot {
  if (!isRecord(value)) {
    return false;
  }

  return isRecord(value.settings)
    && isRecord(value.user)
    && Array.isArray(value.tasks)
    && Array.isArray(value.habits)
    && Array.isArray(value.transactions)
    && Array.isArray(value.notes)
    && Array.isArray(value.events);
}

export function sanitizeImportedSnapshot(value: unknown): PersistedWorkspaceSnapshot | null {
  if (!isPersistedWorkspaceSnapshot(value)) {
    return null;
  }

  const defaults = getDefaultPersistedWorkspaceSnapshot();

  return {
    ...defaults,
    ...value,
    user: {
      ...defaults.user,
      ...value.user,
    },
    settings: {
      ...defaults.settings,
      ...value.settings,
    },
  };
}
