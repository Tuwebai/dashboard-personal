import { StateCreator } from 'zustand';
import { UISlice, AppStore } from '../types';
import type { AppModule } from '../../core/navigation/routes';

export const createUISlice: StateCreator<
  AppStore,
  [["zustand/immer", never], ["zustand/persist", unknown]],
  [],
  UISlice
> = (set) => ({
  commandPaletteOpen: false,
  activeModule: 'dashboard',
  setCommandPaletteOpen: (open: boolean) => set(state => {
    state.commandPaletteOpen = open;
  }),
  setActiveModule: (module: AppModule) => set(state => {
    state.activeModule = module;
  }),
});
