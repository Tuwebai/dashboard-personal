import { StateCreator } from 'zustand';
import { UISlice, AppStore } from '../types';

export const createUISlice: StateCreator<
  AppStore,
  [["zustand/immer", never], ["zustand/persist", unknown]],
  [],
  UISlice
> = (set) => ({
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  activeModule: 'dashboard',
  theme: 'dark',
  toggleSidebar: () => set(state => {
    state.sidebarCollapsed = !state.sidebarCollapsed;
  }),
  setCommandPaletteOpen: (open: boolean) => set(state => {
    state.commandPaletteOpen = open;
  }),
  setActiveModule: (module: string) => set(state => {
    state.activeModule = module;
  }),
  toggleTheme: () => set(state => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
  }),
});
