import { StateCreator } from 'zustand';
import { AuthSlice, AppStore } from '../types';
import { CURRENT_USER, DEFAULT_SETTINGS } from '../../core/constants';

export const createAuthSlice: StateCreator<
  AppStore,
  [["zustand/immer", never], ["zustand/persist", unknown]],
  [],
  AuthSlice
> = (set) => ({
  user: CURRENT_USER,
  settings: DEFAULT_SETTINGS,
  updateSettings: (updates) => set(state => {
    Object.assign(state.settings, updates);
  }),
  updateUser: (updates) => set(state => {
    Object.assign(state.user, updates);
  }),
});
