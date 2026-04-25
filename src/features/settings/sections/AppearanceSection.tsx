import { Switch } from '../../../shared/ui/Switch';
import { Monitor, Moon, Sun, LayoutDashboard, Sidebar, Palette } from 'lucide-react';
import { cn } from '../../../shared/lib/cn';
import { useAppearanceSettings } from '../hooks/useAppearanceSettings';

const ACCENT_COLORS = [
  { name: 'Standard Violet', value: '#8b5cf6', class: 'bg-violet-500' },
  { name: 'Ocean Blue', value: '#3b82f6', class: 'bg-blue-500' },
  { name: 'Emerald Green', value: '#10b981', class: 'bg-emerald-500' },
  { name: 'Rose Pink', value: '#f43f5e', class: 'bg-rose-500' },
  { name: 'Amber Glow', value: '#f59e0b', class: 'bg-amber-500' },
  { name: 'Slate Gray', value: '#64748b', class: 'bg-slate-500' },
];

export function AppearanceSection() {
  const { 
    theme, settings, toggleTheme, 
    handleAccentChange, toggleSidebar, toggleCompactMode 
  } = useAppearanceSettings();

  return (
    <section className="space-y-8 md:space-y-12">
      <div className="rounded-xl border border-border bg-bg-card p-4 space-y-6 sm:p-6">
        <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
          <Monitor className="w-4 h-4 text-violet-400" />
          Theme Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'light', icon: Sun, label: 'Light Mode' },
            { id: 'dark', icon: Moon, label: 'Dark Mode' },
            { id: 'system', icon: Monitor, label: 'System Sync' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={toggleTheme}
              className={cn(
                "p-5 rounded-xl border transition-all duration-200 flex flex-col items-center gap-3 text-center",
                theme === mode.id 
                  ? "bg-violet-500/10 border-violet-500/20 text-white" 
                  : "bg-bg-tertiary border-border text-white/40 hover:bg-white/5 hover:text-white/80"
              )}
            >
              <mode.icon size={28} />
              <span className="text-sm font-bold">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-bg-card p-4 space-y-6 sm:p-6">
        <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4 text-violet-400" />
          Interface Settings
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-bg-tertiary border border-border rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 text-white/60 rounded-xl flex items-center justify-center">
                <Sidebar size={20} />
              </div>
              <div>
                <p className="font-bold text-white tracking-tight">Sidebar Behavior</p>
                <p className="text-xs text-white/30">Auto-collapse sidebar to maximize workspace</p>
              </div>
            </div>
            <Switch 
              checked={settings.sidebarCollapsed} 
              onChange={toggleSidebar} 
            />
          </div>

          <div className="p-4 bg-bg-tertiary border border-border rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 text-white/60 rounded-xl flex items-center justify-center">
                <LayoutDashboard size={20} />
              </div>
              <div>
                <p className="font-bold text-white tracking-tight">Compact Mode</p>
                <p className="text-xs text-white/30">Reduced spacing and smaller interface elements</p>
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
        <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
          <Palette className="w-4 h-4 text-violet-400" />
          Accent Color
        </h3>
        
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.name}
              className={cn(
                "group p-1 rounded-2xl border-2 transition-all duration-300",
                settings.accentColor === color.value ? "border-white/20" : "border-transparent"
              )}
              onClick={() => handleAccentChange(color.value)}
              title={color.name}
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
