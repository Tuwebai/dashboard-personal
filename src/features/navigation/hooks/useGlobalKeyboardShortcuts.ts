import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { emitWorkspaceReadonlyBlockedEvent } from '../../../core/persistence/workspaceReadonly';
import { useAppStore } from '../../../stores/useAppStore';
import type { AppModule } from '../../../core/navigation/routes';
import {
  emitShortcutAction,
  SHORTCUT_CREATE_NEW_NOTE_EVENT,
  SHORTCUT_OPEN_NEW_HABIT_EVENT,
  SHORTCUT_OPEN_NEW_TASK_EVENT,
  SHORTCUT_SAVE_ACTIVE_EVENT,
} from '../../../core/navigation/shortcutActions';

interface UseGlobalKeyboardShortcutsOptions {
  onNavigate: (module: AppModule) => void;
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName;
  return target.isContentEditable || tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT';
}

function submitClosestForm(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const form = target.closest('form');
  if (!(form instanceof HTMLFormElement)) {
    return false;
  }

  form.requestSubmit();
  return true;
}

export function useGlobalKeyboardShortcuts({ onNavigate }: UseGlobalKeyboardShortcutsOptions) {
  const { toggleSidebar, setCommandPaletteOpen, workspaceReadOnly } = useAppStore(
    useShallow((state) => ({
      toggleSidebar: state.toggleSidebar,
      setCommandPaletteOpen: state.setCommandPaletteOpen,
      workspaceReadOnly: state.workspaceReadOnly,
    })),
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === 'k' || key === 'f') {
        event.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      if (key === 's') {
        event.preventDefault();

        if (workspaceReadOnly) {
          emitWorkspaceReadonlyBlockedEvent();
          return;
        }

        if (!submitClosestForm(event.target)) {
          emitShortcutAction(SHORTCUT_SAVE_ACTIVE_EVENT);
        }
        return;
      }

      if (isEditableTarget(event.target)) {
        return;
      }

      switch (key) {
        case 'b':
          event.preventDefault();
          toggleSidebar();
          return;
        case '1':
          event.preventDefault();
          onNavigate('dashboard');
          return;
        case '2':
          event.preventDefault();
          onNavigate('tasks');
          return;
        case '3':
          event.preventDefault();
          onNavigate('habits');
          return;
        case '4':
          event.preventDefault();
          onNavigate('finances');
          return;
        case ',':
          event.preventDefault();
          onNavigate('settings');
          return;
        case 'n':
          event.preventDefault();
          if (workspaceReadOnly) {
            emitWorkspaceReadonlyBlockedEvent();
            return;
          }
          onNavigate('tasks');
          emitShortcutAction(SHORTCUT_OPEN_NEW_TASK_EVENT);
          return;
        case 'h':
          event.preventDefault();
          if (workspaceReadOnly) {
            emitWorkspaceReadonlyBlockedEvent();
            return;
          }
          onNavigate('habits');
          emitShortcutAction(SHORTCUT_OPEN_NEW_HABIT_EVENT);
          return;
        case 'j':
          event.preventDefault();
          if (workspaceReadOnly) {
            emitWorkspaceReadonlyBlockedEvent();
            return;
          }
          onNavigate('notes');
          emitShortcutAction(SHORTCUT_CREATE_NEW_NOTE_EVENT);
          return;
        default:
          return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate, setCommandPaletteOpen, toggleSidebar, workspaceReadOnly]);
}
