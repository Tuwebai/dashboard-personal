let firebaseBridgePromise: Promise<typeof import('./firebase')> | null = null;
let remoteWorkspaceBridgePromise: Promise<typeof import('./remoteWorkspace')> | null = null;

export function loadFirebaseBridge() {
  if (!firebaseBridgePromise) {
    firebaseBridgePromise = import('./firebase');
  }

  return firebaseBridgePromise;
}

export function loadRemoteWorkspaceBridge() {
  if (!remoteWorkspaceBridgePromise) {
    remoteWorkspaceBridgePromise = import('./remoteWorkspace');
  }

  return remoteWorkspaceBridgePromise;
}
