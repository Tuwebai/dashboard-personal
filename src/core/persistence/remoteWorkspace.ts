import {
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { getFirebaseFirestore } from './firebase';
import type { PersistedWorkspaceSnapshot } from './workspace';

const DEFAULT_FIREBASE_DOC_PATH = 'users/{uid}/crm/dashboard';

export interface RemoteWorkspaceDocument {
  updatedAt: string;
  state: PersistedWorkspaceSnapshot;
}

function getFirebaseDocPath(uid: string) {
  const template = import.meta.env.VITE_FIREBASE_PERSISTENCE_DOC_PATH ?? DEFAULT_FIREBASE_DOC_PATH;
  return template.replace('{uid}', uid);
}

function getRemoteDocRef(uid: string) {
  const firestore = getFirebaseFirestore();

  if (!firestore || !uid) {
    return null;
  }

  const path = getFirebaseDocPath(uid).split('/').filter(Boolean);
  if (path.length % 2 !== 0 || path.length < 2) {
    return null;
  }

  return doc(firestore, path.join('/'));
}

export async function hydrateWorkspaceFromRemote(uid: string) {
  const ref = getRemoteDocRef(uid);
  if (!ref) {
    return null;
  }

  return getDoc(ref);
}

export async function writeWorkspaceRemote(uid: string, payload: RemoteWorkspaceDocument) {
  const ref = getRemoteDocRef(uid);
  if (!ref) {
    throw new Error('persistence/invalid-doc-ref');
  }

  await setDoc(ref, payload, { merge: true });
}

export async function wipeRemoteWorkspace(uid: string) {
  const ref = getRemoteDocRef(uid);
  if (!ref) {
    throw new Error('persistence/invalid-doc-ref');
  }

  await deleteDoc(ref);
}

export function subscribeWorkspaceRemote(
  uid: string,
  callback: (payload: unknown) => void,
): Unsubscribe {
  const ref = getRemoteDocRef(uid);
  if (!ref) {
    throw new Error('persistence/invalid-doc-ref');
  }

  return onSnapshot(ref, (snapshot) => {
    callback(snapshot.exists() ? snapshot.data() : null);
  });
}
