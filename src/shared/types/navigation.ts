import type { ID } from './common';

export interface CommandItem {
  id: ID;
  title: string;
  description?: string;
  icon: string;
  category: 'navigation' | 'action' | 'recent';
  action: () => void;
  shortcut?: string;
}
