import { StateCreator } from 'zustand';
import { NoteSlice, AppStore } from '../types';
import { genId } from '../../shared/lib/id';

import { format } from 'date-fns';
import type { Note } from '../types';

export const createNoteSlice: StateCreator<
  AppStore,
  [["zustand/immer", never], ["zustand/persist", unknown]],
  [],
  NoteSlice
> = (set) => ({
  notes: [],
  folders: [],
  selectedNoteId: null,
  selectedFolderId: null,
  noteSearch: '',

  addNote: (noteData) => set(state => {
    const now = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
    const newNote: Note = {
      ...noteData,
      id: genId(),
      createdAt: now,
      updatedAt: now,
    };
    state.notes.unshift(newNote);
    state.selectedNoteId = newNote.id;
  }),

  updateNote: (id, updates) => set(state => {
    const idx = state.notes.findIndex(n => n.id === id);
    if (idx !== -1) {
      Object.assign(state.notes[idx], updates);
      state.notes[idx].updatedAt = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
    }
  }),

  deleteNote: (id) => set(state => {
    state.notes = state.notes.filter(n => n.id !== id);
    if (state.selectedNoteId === id) state.selectedNoteId = null;
  }),

  setSelectedNote: (id) => set(state => { state.selectedNoteId = id; }),
  setSelectedFolder: (id) => set(state => { state.selectedFolderId = id; }),
  setNoteSearch: (search) => set(state => { state.noteSearch = search; }),

  addFolder: (folderData) => set(state => {
    state.folders.push({
      ...folderData,
      id: genId(),
      noteCount: 0,
      createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    });
  }),

  updateFolder: (id, updates) => set(state => {
    const idx = state.folders.findIndex(f => f.id === id);
    if (idx !== -1) Object.assign(state.folders[idx], updates);
  }),

  deleteFolder: (id) => set(state => {
    state.folders = state.folders.filter(f => f.id !== id);
    state.notes = state.notes.map(n => n.folderId === id ? { ...n, folderId: undefined } : n);
  }),
});
