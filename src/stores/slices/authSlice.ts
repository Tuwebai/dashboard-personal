import { StateCreator } from 'zustand';
import { AuthSlice, AppStore } from '../types';
import { CURRENT_USER, DEFAULT_SETTINGS } from '../../core/constants';
import { shouldUseFirebasePersistence } from '../../core/persistence/config';
import { loadFirebaseBridge, loadRemoteWorkspaceBridge } from '../../core/persistence/firebaseLoaders';

const DEFAULT_AUTH_STATUS: AuthSlice['authStatus'] = shouldUseFirebasePersistence()
  ? 'loading'
  : 'authenticated';

export const createAuthSlice: StateCreator<
  AppStore,
  [["zustand/immer", never], ["zustand/persist", unknown]],
  [],
  AuthSlice
> = (set, get) => ({
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
  setThemeMode: (theme) => set(state => {
    if (state.workspaceReadOnly) {
      return;
    }
    state.settings.theme = theme;
  }),
  setAccentColor: (accentColor) => set(state => {
    if (state.workspaceReadOnly) {
      return;
    }
    state.settings.accentColor = accentColor;
  }),
  setCompactMode: (compactMode) => set(state => {
    if (state.workspaceReadOnly) {
      return;
    }
    state.settings.compactMode = compactMode;
  }),
  setSidebarCollapsed: (collapsed) => set(state => {
    if (state.workspaceReadOnly) {
      return;
    }
    state.settings.sidebarCollapsed = collapsed;
  }),
  toggleSidebarPreference: () => set(state => {
    if (state.workspaceReadOnly) {
      return;
    }
    state.settings.sidebarCollapsed = !state.settings.sidebarCollapsed;
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
    const { authProvider, firebaseUid } = get();
    const { deleteAnonymousFirebaseUser, signInFirebaseWithEmail } = await loadFirebaseBridge();

    if (authProvider === 'anonymous' && firebaseUid) {
      const { wipeRemoteWorkspace } = await loadRemoteWorkspaceBridge();
      await wipeRemoteWorkspace(firebaseUid);

      const deleted = await deleteAnonymousFirebaseUser();
      if (!deleted) {
        throw new Error('auth/anonymous-cleanup-failed');
      }
    }

    const user = await signInFirebaseWithEmail(email, password);

    if (!user) {
      throw new Error('auth/sign-in-failed');
    }
  },
  signUpWithEmail: async (email, password) => {
    const { authProvider } = get();
    const { linkAnonymousFirebaseUser, signUpFirebaseWithEmail } = await loadFirebaseBridge();
    const user = authProvider === 'anonymous'
      ? await linkAnonymousFirebaseUser(email, password)
      : await signUpFirebaseWithEmail(email, password);

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
    const { authProvider, firebaseUid } = get();
    const { deleteAnonymousFirebaseUser, signOutFirebaseUser } = await loadFirebaseBridge();

    if (authProvider === 'anonymous') {
      if (firebaseUid) {
        const { wipeRemoteWorkspace } = await loadRemoteWorkspaceBridge();
        await wipeRemoteWorkspace(firebaseUid).catch(() => undefined);
      }

      const deleted = await deleteAnonymousFirebaseUser().catch(() => false);

      if (deleted) {
        return;
      }
    }

    if (authProvider === 'password' && firebaseUid) {
      const updatedAt = new Date().toISOString();
      const [{ disableNotificationDeviceRemote }, { getPushDeviceId, revokePushToken }] = await Promise.all([
        import('../../core/notifications/firestore'),
        import('../../core/notifications/push'),
      ]);

      await disableNotificationDeviceRemote(firebaseUid, getPushDeviceId(), updatedAt).catch(() => undefined);
      await revokePushToken().catch(() => false);
    }

    await signOutFirebaseUser();
  },
});
