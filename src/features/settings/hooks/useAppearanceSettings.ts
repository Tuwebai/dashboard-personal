import { useAppStore } from '../../../stores/useAppStore';
import { useShallow } from 'zustand/react/shallow';

export function useAppearanceSettings() {
  const {
    theme,
    accentColor,
    sidebarCollapsed,
    compactMode,
    setThemeMode,
    setAccentColor,
    setSidebarCollapsed,
    setCompactMode,
  } = useAppStore(
    useShallow((state) => ({
      theme: state.settings.theme,
      accentColor: state.settings.accentColor,
      sidebarCollapsed: state.settings.sidebarCollapsed,
      compactMode: state.settings.compactMode,
      setThemeMode: state.setThemeMode,
      setAccentColor: state.setAccentColor,
      setSidebarCollapsed: state.setSidebarCollapsed,
      setCompactMode: state.setCompactMode,
    })),
  );
  const settings = { accentColor, sidebarCollapsed, compactMode };

  const handleAccentChange = (color: string) => {
    setAccentColor(color);
  };

  const toggleSidebar = (checked: boolean) => {
    setSidebarCollapsed(checked);
  };

  const toggleCompactMode = (checked: boolean) => {
    setCompactMode(checked);
  };

  return {
    theme,
    settings,
    setThemeMode,
    handleAccentChange,
    toggleSidebar,
    toggleCompactMode,
  };
}
