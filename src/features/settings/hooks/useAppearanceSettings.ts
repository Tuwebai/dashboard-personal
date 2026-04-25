import { useAppStore } from '../../../stores/useAppStore';
import { useShallow } from 'zustand/react/shallow';

export function useAppearanceSettings() {
  const { theme, accentColor, sidebarCollapsed, compactMode, toggleTheme, updateSettings } = useAppStore(
    useShallow((state) => ({
      theme: state.theme,
      accentColor: state.settings.accentColor,
      sidebarCollapsed: state.settings.sidebarCollapsed,
      compactMode: state.settings.compactMode,
      toggleTheme: state.toggleTheme,
      updateSettings: state.updateSettings,
    })),
  );
  const settings = { accentColor, sidebarCollapsed, compactMode };

  const handleAccentChange = (color: string) => {
    updateSettings({ accentColor: color });
    // If you had a CSS variable updater, you'd trigger it here:
    // document.documentElement.style.setProperty('--color-primary', color);
  };

  const toggleSidebar = (checked: boolean) => {
    updateSettings({ sidebarCollapsed: checked });
  };

  const toggleCompactMode = (checked: boolean) => {
    updateSettings({ compactMode: checked });
    
    // Toggle global HTML class for dense UI
    if (checked) {
      document.documentElement.classList.add('compact-mode');
    } else {
      document.documentElement.classList.remove('compact-mode');
    }
  };

  return {
    theme,
    settings,
    toggleTheme,
    handleAccentChange,
    toggleSidebar,
    toggleCompactMode,
  };
}
