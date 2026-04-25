export const WORKSPACE_READONLY_BLOCKED_EVENT = 'nexus-crm:workspace-readonly-blocked';

export function emitWorkspaceReadonlyBlockedEvent() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(WORKSPACE_READONLY_BLOCKED_EVENT));
}
