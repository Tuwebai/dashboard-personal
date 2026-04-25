import type { ID, ISODateString } from './common';

export interface Note {
  id: ID;
  title: string;
  content: string;
  folderId?: ID;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  wordCount: number;
  readingTime: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt?: ISODateString;
}

export interface NoteFolder {
  id: ID;
  name: string;
  parentId?: ID;
  color: string;
  icon: string;
  noteCount: number;
  children?: NoteFolder[];
  createdAt: ISODateString;
}

export interface NoteVersion {
  id: ID;
  noteId: ID;
  content: string;
  createdAt: ISODateString;
}
