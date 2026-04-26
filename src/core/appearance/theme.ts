import { useLayoutEffect, useMemo, useSyncExternalStore } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../stores/useAppStore';
import type { UserSettings } from '../../shared/types';

export type ThemeMode = UserSettings['theme'];
export type ResolvedTheme = 'dark' | 'light';

const SYSTEM_THEME_QUERY = '(prefers-color-scheme: dark)';

function subscribeToSystemThemeChange(callback: () => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => undefined;
  }

  const mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY);
  const listener = () => callback();

  mediaQuery.addEventListener('change', listener);
  return () => mediaQuery.removeEventListener('change', listener);
}

function getSystemPrefersDarkSnapshot() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return true;
  }

  return window.matchMedia(SYSTEM_THEME_QUERY).matches;
}

export function resolveTheme(mode: ThemeMode, prefersDark: boolean): ResolvedTheme {
  if (mode === 'system') {
    return prefersDark ? 'dark' : 'light';
  }

  return mode;
}

function normalizeHexColor(color: string) {
  const normalized = color.trim();
  const match = normalized.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);

  if (!match) {
    return '#8b5cf6';
  }

  if (match[1].length === 3) {
    const [r, g, b] = match[1].split('');
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  return normalized.toLowerCase();
}

function hexToRgbTriplet(color: string) {
  const safeColor = normalizeHexColor(color).replace('#', '');
  const value = Number.parseInt(safeColor, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `${red} ${green} ${blue}`;
}

export function useResolvedTheme(mode: ThemeMode) {
  const prefersDark = useSyncExternalStore(
    subscribeToSystemThemeChange,
    getSystemPrefersDarkSnapshot,
    () => true,
  );

  return useMemo(() => resolveTheme(mode, prefersDark), [mode, prefersDark]);
}

export function useRealtimeAppearance() {
  const { themeMode, accentColor, compactMode } = useAppStore(
    useShallow((state) => ({
      themeMode: state.settings.theme,
      accentColor: state.settings.accentColor,
      compactMode: state.settings.compactMode,
    })),
  );
  const resolvedTheme = useResolvedTheme(themeMode);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const normalizedAccent = normalizeHexColor(accentColor);

    root.dataset.themeMode = themeMode;
    root.dataset.resolvedTheme = resolvedTheme;
    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.classList.toggle('compact-mode', compactMode);
    root.style.setProperty('--color-accent', normalizedAccent);
    root.style.setProperty('--color-accent-rgb', hexToRgbTriplet(normalizedAccent));
  }, [accentColor, compactMode, resolvedTheme, themeMode]);

  return {
    resolvedTheme,
    themeMode,
  };
}
