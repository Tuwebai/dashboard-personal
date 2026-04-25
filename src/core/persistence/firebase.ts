import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, type Auth, type User } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getPersistenceMode, isFirebasePersistenceConfigured } from './config';

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;
let authUser: User | null = null;

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

function isAnonymousAuthEnabled() {
  return import.meta.env.VITE_FIREBASE_ENABLE_ANONYMOUS_AUTH === 'true';
}

export function shouldUseFirebasePersistence() {
  return getPersistenceMode() === 'firebase' && isFirebasePersistenceConfigured();
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

export function ensureFirebaseAuth() {
  const auth = getFirebaseAuth();

  if (!auth) {
    return Promise.resolve<User | null>(null);
  }

  if (!isAnonymousAuthEnabled()) {
    return Promise.resolve<User | null>(null);
  }

  if (auth.currentUser) {
    authUser = auth.currentUser;
    return Promise.resolve(auth.currentUser);
  }

  return signInAnonymously(auth).then((credential) => {
    authUser = credential.user;
    return credential.user;
  }).catch(() => null);
}

export function subscribeToFirebaseAuth(callback: (user: User | null) => void) {
  const auth = getFirebaseAuth();

  if (!auth) {
    callback(null);
    return () => undefined;
  }

  return onAuthStateChanged(auth, (user) => {
    authUser = user;
    callback(user);
  });
}
