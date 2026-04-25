import {
  Calendar,
  CheckSquare,
  DollarSign,
  FileText,
  LayoutDashboard,
  Plus,
  RotateCcw,
  Settings,
  Zap,
} from 'lucide-react';
import type { CommandOption } from './types';

type Translate = (key: string) => string;

export function buildCommandPaletteCommands(
  t: Translate,
  onNavigate: (module: string) => void,
  closePalette: () => void,
): CommandOption[] {
  const navigateTo = (module: string) => () => {
    onNavigate(module);
    closePalette();
  };

  return [
    { id: 'nav_dashboard', title: t('nav.overview'), icon: LayoutDashboard, category: 'navigation', shortcut: 'G D', action: navigateTo('dashboard') },
    { id: 'nav_tasks', title: t('nav.tasks'), icon: CheckSquare, category: 'navigation', shortcut: 'G T', action: navigateTo('tasks') },
    { id: 'nav_habits', title: t('nav.habits'), icon: Zap, category: 'navigation', shortcut: 'G H', action: navigateTo('habits') },
    { id: 'nav_routines', title: t('nav.routines'), icon: RotateCcw, category: 'navigation', shortcut: 'G R', action: navigateTo('routines') },
    { id: 'nav_finances', title: t('nav.finances'), icon: DollarSign, category: 'navigation', shortcut: 'G F', action: navigateTo('finances') },
    { id: 'nav_calendar', title: t('nav.calendar'), icon: Calendar, category: 'navigation', shortcut: 'G C', action: navigateTo('calendar') },
    { id: 'nav_notes', title: t('nav.notes'), icon: FileText, category: 'navigation', shortcut: 'G N', action: navigateTo('notes') },
    { id: 'nav_settings', title: t('nav.settings'), icon: Settings, category: 'navigation', action: navigateTo('settings') },
    { id: 'action_task', title: t('tasks.createNew'), icon: Plus, category: 'action', action: navigateTo('tasks') },
    { id: 'action_note', title: t('shortcuts.newNote'), icon: Plus, category: 'action', action: navigateTo('notes') },
    { id: 'action_event', title: t('calendar.newEvent'), icon: Plus, category: 'action', action: navigateTo('calendar') },
    { id: 'action_expense', title: t('finances.newTransaction'), icon: Plus, category: 'action', action: navigateTo('finances') },
  ];
}
