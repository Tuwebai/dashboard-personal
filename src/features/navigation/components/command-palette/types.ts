import type { ComponentType } from 'react';

export type CommandCategory = 'navigation' | 'action';

export interface CommandOption {
  id: string;
  title: string;
  description?: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  category: CommandCategory;
  shortcut?: string;
  action: () => void;
}

export interface CommandPaletteProps {
  onNavigate: (module: string) => void;
}
