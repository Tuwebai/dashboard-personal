import { useEffect } from 'react';

export const SHORTCUT_OPEN_NEW_TASK_EVENT = 'nexus-crm:shortcut-open-new-task';
export const SHORTCUT_OPEN_NEW_HABIT_EVENT = 'nexus-crm:shortcut-open-new-habit';
export const SHORTCUT_CREATE_NEW_NOTE_EVENT = 'nexus-crm:shortcut-create-new-note';
export const SHORTCUT_SAVE_ACTIVE_EVENT = 'nexus-crm:shortcut-save-active';

type ShortcutActionEventName =
  | typeof SHORTCUT_OPEN_NEW_TASK_EVENT
  | typeof SHORTCUT_OPEN_NEW_HABIT_EVENT
  | typeof SHORTCUT_CREATE_NEW_NOTE_EVENT
  | typeof SHORTCUT_SAVE_ACTIVE_EVENT;

let pendingShortcutAction: ShortcutActionEventName | null = null;

export function emitShortcutAction(eventName: ShortcutActionEventName) {
  pendingShortcutAction = eventName;

  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(eventName));
}

function consumeShortcutAction(eventName: ShortcutActionEventName) {
  if (pendingShortcutAction !== eventName) {
    return false;
  }

  pendingShortcutAction = null;
  return true;
}

export function useShortcutAction(eventName: ShortcutActionEventName, handler: () => void) {
  useEffect(() => {
    if (consumeShortcutAction(eventName)) {
      handler();
    }

    if (typeof window === 'undefined') {
      return;
    }

    const handleShortcut = () => {
      pendingShortcutAction = null;
      handler();
    };

    window.addEventListener(eventName, handleShortcut);
    return () => window.removeEventListener(eventName, handleShortcut);
  }, [eventName, handler]);
}
