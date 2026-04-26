import { useEffect, useMemo, useState } from 'react';
import { BrandMark } from '../../../shared/ui/BrandLogo';
import { motion, AnimatePresence } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';
import {
  Search, Bell, Sun, Moon, ChevronRight, Menu,
  Check, AlertCircle, TrendingUp, Calendar, Pause, Play, CheckCircle2
} from 'lucide-react';
import { cn } from '../../../shared/lib/cn';
import { useAppStore } from '../../../stores/useAppStore';
import { useI18n } from '../../../shared/i18n/useI18n';
import { formatDistanceToNow } from 'date-fns';
import { getModuleFromPath, type AppModule } from '../../../core/navigation/routes';
import type { NotificationType } from '../../../shared/types';
import { useResolvedTheme } from '../../../core/appearance/theme';

const NOTIF_ICONS: Record<NotificationType, React.ComponentType<{ size?: number }>> = {
  task: Check,
  habit: AlertCircle,
  finance: TrendingUp,
  calendar: Calendar,
  system: Bell,
};

interface TopNavbarProps {
  activeModule: AppModule;
  onNavigate: (module: AppModule) => void;
  onToggleSidebar?: () => void;
}

export function TopNavbar({ activeModule, onNavigate, onToggleSidebar }: TopNavbarProps) {
  const { t } = useI18n();
  const [notifOpen, setNotifOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const {
    themeMode,
    setThemeMode,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    setCommandPaletteOpen,
    focusSessions,
    selectedFocusSessionId,
    pauseFocusSession,
    resumeFocusSession,
    finishFocusSession,
  } = useAppStore(
    useShallow((state) => ({
      themeMode: state.settings.theme,
      setThemeMode: state.setThemeMode,
      notifications: state.notifications,
      markNotificationRead: state.markNotificationRead,
      markAllNotificationsRead: state.markAllNotificationsRead,
      clearNotifications: state.clearNotifications,
      setCommandPaletteOpen: state.setCommandPaletteOpen,
      focusSessions: state.focusSessions,
      selectedFocusSessionId: state.selectedFocusSessionId,
      pauseFocusSession: state.pauseFocusSession,
      resumeFocusSession: state.resumeFocusSession,
      finishFocusSession: state.finishFocusSession,
    }))
  );
  const resolvedTheme = useResolvedTheme(themeMode);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const activeFocusSession = useMemo(
    () => {
      const selectedSession = focusSessions.find(
        (session) =>
          session.id === selectedFocusSessionId &&
          (session.status === 'active' || session.status === 'paused'),
      );

      return (
        selectedSession
        ?? focusSessions.find((session) => session.status === 'active' || session.status === 'paused')
        ?? null
      );
    },
    [focusSessions, selectedFocusSessionId],
  );

  useEffect(() => {
    if (!activeFocusSession || activeFocusSession.status !== 'active') return;

    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [activeFocusSession]);

  const remainingTime = useMemo(() => {
    if (!activeFocusSession) return null;

    const liveDelta =
      activeFocusSession.status === 'active' && activeFocusSession.lastResumedAt
        ? Math.max(0, Math.floor((now - new Date(activeFocusSession.lastResumedAt).getTime()) / 1000))
        : 0;
    const elapsedSeconds = activeFocusSession.elapsedSeconds + liveDelta;
    const remainingSeconds = Math.max(0, activeFocusSession.plannedMinutes * 60 - elapsedSeconds);
    const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
    const seconds = Math.floor(remainingSeconds % 60).toString().padStart(2, '0');

    return `${minutes}:${seconds}`;
  }, [activeFocusSession, now]);

  const moduleLabelKey = activeModule === 'dashboard' ? 'nav.overview' : activeModule === 'weekly-planning' ? 'nav.weeklyPlanning' : `nav.${activeModule}`;

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-bg-primary/80 px-4 backdrop-blur-xl md:px-6" style={{ height: 'var(--topbar-height)' }}>
      <button
        type="button"
        onClick={onToggleSidebar}
        className="rounded-lg p-2 text-text-secondary transition-all hover:bg-bg-hover hover:text-text-primary lg:hidden"
        aria-label="Abrir navegación"
      >
        <Menu size={18} />
      </button>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <BrandMark className="h-5 w-5 shrink-0" />
        <ChevronRight size={14} className="text-text-muted" />
        <span className="text-sm font-medium text-text-primary">{t(moduleLabelKey)}</span>
      </div>

      {activeFocusSession && remainingTime ? (
        <div className="hidden lg:flex items-center gap-2 rounded-2xl border border-violet-500/20 bg-violet-500/10 px-3 py-1.5">
          <span className="min-w-14 text-center text-sm font-semibold tabular-nums text-text-primary">
            {remainingTime}
          </span>
          {activeFocusSession.status === 'active' ? (
            <button
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                pauseFocusSession(activeFocusSession.id);
              }}
              className="rounded-xl p-2 text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary"
              aria-label={t('focus.topbar.pause')}
            >
              <Pause size={14} />
            </button>
          ) : (
            <button
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                resumeFocusSession(activeFocusSession.id);
              }}
              className="rounded-xl p-2 text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary"
              aria-label={t('focus.topbar.resume')}
            >
              <Play size={14} />
            </button>
          )}
          <button
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              finishFocusSession(activeFocusSession.id);
            }}
            className="rounded-xl p-2 text-emerald-200 transition-colors hover:bg-emerald-500/15 hover:text-emerald-100"
            aria-label={t('focus.topbar.finish')}
          >
            <CheckCircle2 size={14} />
          </button>
        </div>
      ) : null}

      {/* Search Trigger */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="group flex items-center gap-2 rounded-lg border border-border bg-bg-secondary px-2.5 py-1.5 text-sm text-text-secondary transition-all hover:bg-bg-hover hover:text-text-primary sm:px-3"
      >
        <Search size={14} />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden rounded border border-border bg-bg-tertiary px-1.5 py-0.5 text-[10px] font-mono text-text-muted group-hover:text-text-secondary sm:inline-flex items-center gap-0.5">
          ⌘K
        </kbd>
      </button>

      {/* Theme Toggle */}
      <button
        onClick={() => setThemeMode(resolvedTheme === 'dark' ? 'light' : 'dark')}
        className="rounded-lg p-2 text-text-secondary transition-all hover:bg-bg-hover hover:text-text-primary"
        aria-label={t('common.toggleTheme')}
      >
        <motion.div
          key={resolvedTheme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </motion.div>
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative rounded-lg p-2 text-text-secondary transition-all hover:bg-bg-hover hover:text-text-primary"
          aria-label={`${t('common.notifications')}${unreadCount > 0 ? ` (${unreadCount} ${t('common.unread')})` : ''}`}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-violet-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <AnimatePresence>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <motion.div
                className="fixed left-3 right-3 top-16 z-20 overflow-hidden rounded-xl border border-bg-secondary bg-bg-primary shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-bg-secondary">
                  <h3 className="text-sm font-semibold text-text-primary">{t('common.notifications')}</h3>
                  <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        {t('common.markAllRead')}
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-xs text-text-secondary transition-colors hover:text-text-primary"
                      >
                        {t('common.clearAll')}
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-border">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-text-secondary">
                      {t('common.noNotifications')}
                    </div>
                  ) : (
                    notifications.slice(0, 10).map(notif => {
                      const Icon = NOTIF_ICONS[notif.type];
                      return (
                        <button
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.actionUrl) {
                              onNavigate(getModuleFromPath(notif.actionUrl));
                              setNotifOpen(false);
                            }
                          }}
                          className={cn(
                            'w-full flex items-start gap-3 px-4 py-3 hover:bg-white/4 transition-colors text-left',
                            !notif.isRead && 'bg-violet-500/5'
                          )}
                        >
                          <div className={cn(
                            'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                            notif.type === 'task' && 'bg-green-500/20 text-green-400',
                            notif.type === 'habit' && 'bg-violet-500/20 text-violet-400',
                            notif.type === 'finance' && 'bg-amber-500/20 text-amber-400',
                            notif.type === 'calendar' && 'bg-blue-500/20 text-blue-400',
                            notif.type === 'system' && 'bg-bg-secondary text-text-secondary',
                          )}>
                            <Icon size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'text-sm font-medium',
                              notif.isRead ? 'text-text-secondary' : 'text-text-primary'
                            )}>
                              {notif.title}
                            </p>
                            <p className="mt-0.5 line-clamp-2 text-xs text-text-muted">{notif.message}</p>
                            <p className="mt-1 text-[10px] text-text-muted">
                              {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          {!notif.isRead && (
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0 mt-2" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

    </header>
  );
}
