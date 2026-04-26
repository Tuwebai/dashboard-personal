import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  getAuth,
  linkWithCredential,
  onAuthStateChanged,
  setPersistence,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
  type User,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { shouldUseFirebasePersistence } from './config';

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;
let authUser: User | null = null;
let authPersistencePromise: Promise<Auth | null> | null = null;

function getFirebaseConfig() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? '',
  };
}

export function getFirebaseClientConfig() {
  return getFirebaseConfig();
}

function isAnonymousAuthEnabled() {
  return import.meta.env.VITE_FIREBASE_ENABLE_ANONYMOUS_AUTH === 'true';
}

export function getFirebaseFirestore() {
  if (!shouldUseFirebasePersistence()) {
    return null;
  }

  if (!firebaseApp) {
    firebaseApp = initializeApp(getFirebaseConfig());
  }

  if (!firestoreDb) {
    firestoreDb = getFirestore(firebaseApp);
  }

  return firestoreDb;
}

export function getFirebaseAppInstance() {
  if (!shouldUseFirebasePersistence()) {
    return null;
  }

  if (!firebaseApp) {
    firebaseApp = initializeApp(getFirebaseConfig());
  }

  return firebaseApp;
}

export function getFirebaseAuth() {
  if (!shouldUseFirebasePersistence()) {
    return null;
  }

  if (!firebaseApp) {
    firebaseApp = initializeApp(getFirebaseConfig());
  }

  if (!firebaseAuth) {
    firebaseAuth = getAuth(firebaseApp);
  }

  return firebaseAuth;
}

export function getFirebaseAuthUser() {
  return authUser;
}

export function ensureFirebaseAuthPersistence() {
  const auth = getFirebaseAuth();

  if (!auth) {
    return Promise.resolve<Auth | null>(null);
  }

  if (!authPersistencePromise) {
    authPersistencePromise = setPersistence(auth, browserLocalPersistence)
      .then(() => auth)
      .catch((error: unknown) => {
        authPersistencePromise = null;
        return Promise.reject(error);
      });
  }

  return authPersistencePromise;
}

export function ensureFirebaseAuth() {
  return ensureFirebaseAuthPersistence()
    .then((auth) => {
      if (!auth || !isAnonymousAuthEnabled()) {
        return null;
      }

      if (auth.currentUser) {
        authUser = auth.currentUser;
        return auth.currentUser;
      }

      return signInAnonymously(auth)
        .then((credential) => {
          authUser = credential.user;
          return credential.user;
        })
        .catch(() => null);
    });
}

export function signInFirebaseAnonymously() {
  return ensureFirebaseAuthPersistence()
    .then((auth) => {
      if (!auth || !isAnonymousAuthEnabled()) {
        return null;
      }

      return signInAnonymously(auth)
        .then((credential) => {
          authUser = credential.user;
          return credential.user;
        });
    })
    .catch((error: unknown) => Promise.reject(error));
}

export function signInFirebaseWithEmail(email: string, password: string) {
  return ensureFirebaseAuthPersistence()
    .then((auth) => {
      if (!auth) {
        return null;
      }

      return signInWithEmailAndPassword(auth, email, password)
        .then((credential) => {
          authUser = credential.user;
          return credential.user;
        });
    })
    .catch((error: unknown) => Promise.reject(error));
}

export function signUpFirebaseWithEmail(email: string, password: string) {
  return ensureFirebaseAuthPersistence()
    .then((auth) => {
      if (!auth) {
        return null;
      }

      return createUserWithEmailAndPassword(auth, email, password)
        .then((credential) => {
          authUser = credential.user;
          return credential.user;
        });
    })
    .catch((error: unknown) => Promise.reject(error));
}

export function linkAnonymousFirebaseUser(email: string, password: string) {
  return ensureFirebaseAuthPersistence()
    .then((auth) => {
      const user = auth?.currentUser;

      if (!auth || !user || !user.isAnonymous) {
        return null;
      }

      const credential = EmailAuthProvider.credential(email, password);

      return linkWithCredential(user, credential)
        .then((result) => {
          authUser = result.user;
          return result.user;
        });
    })
    .catch((error: unknown) => Promise.reject(error));
}

export function signOutFirebaseUser() {
  return ensureFirebaseAuthPersistence()
    .then((auth) => {
      if (!auth) {
        authUser = null;
        return;
      }

      return signOut(auth).finally(() => {
        authUser = null;
      });
    });
}

export function deleteAnonymousFirebaseUser() {
  return ensureFirebaseAuthPersistence()
    .then((auth) => {
      const user = auth?.currentUser;

      if (!auth || !user?.isAnonymous) {
        return false;
      }

      return deleteUser(user)
        .then(() => {
          authUser = null;
          return true;
        });
    })
    .catch((error: unknown) => Promise.reject(error));
}

export function subscribeToFirebaseAuth(callback: (user: User | null) => void) {
  const auth = getFirebaseAuth();

  if (!auth) {
    callback(null);
    return () => undefined;
  }

  void ensureFirebaseAuthPersistence().catch(() => undefined);

  return onAuthStateChanged(auth, (user) => {
    authUser = user;
    callback(user);
  });
}
