import { StateCreator } from 'zustand';
import { AuthSlice, AppStore } from '../types';
import { CURRENT_USER, DEFAULT_SETTINGS } from '../../core/constants';
import {
  linkAnonymousFirebaseUser,
  signInFirebaseAnonymously,
  signInFirebaseWithEmail,
  signOutFirebaseUser,
  signUpFirebaseWithEmail,
  shouldUseFirebasePersistence,
} from '../../core/persistence/firebase';

const DEFAULT_AUTH_STATUS: AuthSlice['authStatus'] = shouldUseFirebasePersistence()
  ? 'loading'
  : 'authenticated';

export const createAuthSlice: StateCreator<
  AppStore,
  [["zustand/immer", never], ["zustand/persist", unknown]],
  [],
  AuthSlice
> = (set) => ({
  user: CURRENT_USER,
  settings: DEFAULT_SETTINGS,
  authStatus: DEFAULT_AUTH_STATUS,
  authProvider: null,
  firebaseUid: null,
  updateSettings: (updates) => set(state => {
    Object.assign(state.settings, updates);
  }),
  updateUser: (updates) => set(state => {
    Object.assign(state.user, updates);
  }),
  setAuthState: (authState) => set((state) => {
    state.authStatus = authState.authStatus;
    state.authProvider = authState.authProvider;
    state.firebaseUid = authState.firebaseUid;
  }),
  signInAnonymously: async () => {
    const user = await signInFirebaseAnonymously();

    if (!user) {
      throw new Error('auth/anonymous-failed');
    }
  },
  signInWithEmail: async (email, password) => {
    const user = await signInFirebaseWithEmail(email, password);

    if (!user) {
      throw new Error('auth/sign-in-failed');
    }
  },
  signUpWithEmail: async (email, password) => {
    const user = await signUpFirebaseWithEmail(email, password);

    if (!user) {
      throw new Error('auth/sign-up-failed');
    }
  },
  linkAnonymousAccount: async (email, password) => {
    const user = await linkAnonymousFirebaseUser(email, password);

    if (!user) {
      throw new Error('auth/link-failed');
    }
  },
  signOut: async () => {
    await signOutFirebaseUser();
  },
});
