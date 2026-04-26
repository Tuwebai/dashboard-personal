import { StateCreator } from 'zustand';
import { AuthSlice, AppStore } from '../types';
import { CURRENT_USER, DEFAULT_SETTINGS } from '../../core/constants';
import { shouldUseFirebasePersistence } from '../../core/persistence/config';
import { loadFirebaseBridge } from '../../core/persistence/firebaseLoaders';

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
  workspaceReadOnly: false,
  updateSettings: (updates) => set(state => {
    if (state.workspaceReadOnly) {
      return;
    }
    Object.assign(state.settings, updates);
  }),
  updateUser: (updates) => set(state => {
    if (state.workspaceReadOnly) {
      return;
    }
    Object.assign(state.user, updates);
  }),
  setWorkspaceReadOnly: (readOnly) => set((state) => {
    state.workspaceReadOnly = readOnly;
  }),
  setAuthState: (authState) => set((state) => {
    state.authStatus = authState.authStatus;
    state.authProvider = authState.authProvider;
    state.firebaseUid = authState.firebaseUid;
  }),
  signInAnonymously: async () => {
    const { signInFirebaseAnonymously } = await loadFirebaseBridge();
    const user = await signInFirebaseAnonymously();

    if (!user) {
      throw new Error('auth/anonymous-failed');
    }
  },
  signInWithEmail: async (email, password) => {
    const { signInFirebaseWithEmail } = await loadFirebaseBridge();
    const user = await signInFirebaseWithEmail(email, password);

    if (!user) {
      throw new Error('auth/sign-in-failed');
    }
  },
  signUpWithEmail: async (email, password) => {
    const { signUpFirebaseWithEmail } = await loadFirebaseBridge();
    const user = await signUpFirebaseWithEmail(email, password);

    if (!user) {
      throw new Error('auth/sign-up-failed');
    }
  },
  linkAnonymousAccount: async (email, password) => {
    const { linkAnonymousFirebaseUser } = await loadFirebaseBridge();
    const user = await linkAnonymousFirebaseUser(email, password);

    if (!user) {
      throw new Error('auth/link-failed');
    }
  },
  signOut: async () => {
    const { signOutFirebaseUser } = await loadFirebaseBridge();
    await signOutFirebaseUser();
  },
});
