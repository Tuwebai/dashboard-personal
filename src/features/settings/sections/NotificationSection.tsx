import { Switch } from '../../../shared/ui/Switch';
import { Bell, CheckSquare, Zap, DollarSign, Calendar } from 'lucide-react';
import { useNotificationSettings } from '../hooks/useNotificationSettings';
import { useI18n } from '../../../shared/i18n/useI18n';

export function NotificationSection() {
  const { t } = useI18n();
  const { 
    settings, permissionStatus, toggleGlobal, toggleFeature, requestBrowserPermission 
  } = useNotificationSettings();

  const notificationGroups = [
    { id: 'tasks', title: 'Task Management', icon: CheckSquare, color: 'text-blue-400', bg: 'bg-blue-400/10', setting: 'taskNotifications', description: 'Reminders for deadlines, subtasks, and productivity reports.' },
    { id: 'habits', title: 'Habit Tracking', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10', setting: 'habitNotifications', description: 'Streaks alerts and daily check-in reminders.' },
    { id: 'finances', title: 'Personal Finance', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10', setting: 'financeAlerts', description: 'Budget alerts, goal completion, and bill reminders.' },
    { id: 'calendar', title: 'Calendar Events', icon: Calendar, color: 'text-rose-400', bg: 'bg-rose-400/10', setting: 'calendarNotifications', description: 'Event invitations and upcoming meeting alerts.' }
  ] as const;

  return (
    <section className="space-y-8 md:space-y-12">
      <div className="rounded-xl border border-border bg-bg-card p-4 space-y-5 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-4 h-4 text-violet-400" />
            {t('settings.notificationCenter')}
          </h3>
          <Switch 
            checked={settings.notificationsEnabled} 
            onChange={toggleGlobal}
            label={t('settings.enableAll')}
          />
        </div>
        
        <div className="space-y-4">
          {notificationGroups.map((group) => (
            <div 
              key={group.id} 
              className="p-4 bg-bg-tertiary border border-border rounded-xl flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 ${group.bg} ${group.color} rounded-xl flex items-center justify-center`}>
                  <group.icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{group.title}</p>
                  <p className="text-xs text-white/40 max-w-md mt-0.5">{group.description}</p>
                </div>
              </div>
              <Switch 
                checked={settings[group.setting] as boolean} 
                onChange={(val) => toggleFeature(group.setting, val)}
                disabled={!settings.notificationsEnabled}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 bg-bg-card border border-border rounded-xl flex items-center gap-5">
        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40">
           <Bell size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t('common.desktopNotifications')}</p>
          <p className="text-sm text-white/30">
            {permissionStatus === 'granted' 
              ? t('settings.notificationsGranted') 
              : t('settings.notificationsDefault')}
          </p>
        </div>
        <button 
          onClick={requestBrowserPermission}
          disabled={permissionStatus === 'granted'}
          className="ml-auto px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-semibold transition-all border border-border"
        >
          {permissionStatus === 'granted' ? t('common.notAvailable') : t('common.enable')}
        </button>
      </div>
    </section>
  );
}
