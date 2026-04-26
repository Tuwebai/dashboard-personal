import { Switch } from '../../../shared/ui/Switch';
import { Monitor, Moon, Sun, LayoutDashboard, Sidebar, Palette } from 'lucide-react';
import { cn } from '../../../shared/lib/cn';
import { useAppearanceSettings } from '../hooks/useAppearanceSettings';
import { useI18n } from '../../../shared/i18n/useI18n';

const ACCENT_COLORS = [
  { labelKey: 'settings.accentStandardViolet', value: '#8b5cf6', class: 'bg-violet-500' },
  { labelKey: 'settings.accentOceanBlue', value: '#3b82f6', class: 'bg-blue-500' },
  { labelKey: 'settings.accentEmeraldGreen', value: '#10b981', class: 'bg-emerald-500' },
  { labelKey: 'settings.accentRosePink', value: '#f43f5e', class: 'bg-rose-500' },
  { labelKey: 'settings.accentAmberGlow', value: '#f59e0b', class: 'bg-amber-500' },
  { labelKey: 'settings.accentSlateGray', value: '#64748b', class: 'bg-slate-500' },
] as const;

const THEME_OPTIONS = [
  { id: 'light', icon: Sun, labelKey: 'settings.lightMode' },
  { id: 'dark', icon: Moon, labelKey: 'settings.darkMode' },
  { id: 'system', icon: Monitor, labelKey: 'settings.systemSync' },
] as const;

export function AppearanceSection() {
  const { t } = useI18n();
  const { 
    theme, settings, setThemeMode, 
    handleAccentChange, toggleSidebar, toggleCompactMode 
  } = useAppearanceSettings();

  return (
    <section className="space-y-8 md:space-y-12">
      <div className="rounded-xl border border-border bg-bg-card p-4 space-y-6 sm:p-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-text-primary">
          <Monitor className="w-4 h-4 text-violet-400" />
          {t('settings.themePreferences')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {THEME_OPTIONS.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setThemeMode(mode.id)}
              className={cn(
                "p-5 rounded-xl border transition-all duration-200 flex flex-col items-center gap-3 text-center",
                theme === mode.id 
                  ? "bg-violet-500/10 border-violet-500/20 text-text-primary" 
                  : "bg-bg-tertiary border-border text-text-secondary hover:bg-bg-hover hover:text-text-primary"
              )}
            >
              <mode.icon size={28} />
              <span className="text-sm font-bold">{t(mode.labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-bg-card p-4 space-y-6 sm:p-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-text-primary">
          <LayoutDashboard className="w-4 h-4 text-violet-400" />
          {t('settings.interfaceSettings')}
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-bg-tertiary border border-border rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-secondary text-text-secondary">
                <Sidebar size={20} />
              </div>
              <div>
                <p className="font-bold tracking-tight text-text-primary">{t('settings.sidebarBehavior')}</p>
                <p className="text-xs text-text-muted">{t('settings.sidebarBehaviorDesc')}</p>
              </div>
            </div>
            <Switch 
              checked={settings.sidebarCollapsed} 
              onChange={toggleSidebar} 
            />
          </div>

          <div className="p-4 bg-bg-tertiary border border-border rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-secondary text-text-secondary">
                <LayoutDashboard size={20} />
              </div>
              <div>
                <p className="font-bold tracking-tight text-text-primary">{t('settings.compactMode')}</p>
                <p className="text-xs text-text-muted">{t('settings.compactModeDesc')}</p>
              </div>
            </div>
            <Switch 
              checked={settings.compactMode} 
              onChange={toggleCompactMode} 
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-bg-card p-4 space-y-6 sm:p-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-text-primary">
          <Palette className="w-4 h-4 text-violet-400" />
          {t('settings.accentColor')}
        </h3>
        
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.labelKey}
              className={cn(
                "group p-1 rounded-2xl border-2 transition-all duration-300",
                settings.accentColor === color.value ? "border-violet-500/30 shadow-sm shadow-violet/20" : "border-transparent"
              )}
              onClick={() => handleAccentChange(color.value)}
              title={t(color.labelKey)}
            >
              <div className={cn(
                "h-12 w-full rounded-2xl shadow-lg transition-transform group-hover:scale-95",
                color.class
              )} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
