import { motion, AnimatePresence } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';
import {
  LayoutDashboard, Target, CalendarRange, CheckSquare, Zap, RotateCcw,
  DollarSign, Calendar, FileText, BookOpenText, Settings,
  Focus as FocusIcon,
  ChevronLeft, ChevronRight, LogOut, HelpCircle
} from 'lucide-react';
import { cn } from '../../../shared/lib/cn';
import { useAppStore } from '../../../stores/useAppStore';
import { useI18n } from '../../../shared/i18n/useI18n';
import { BrandLogo } from '../../../shared/ui/BrandLogo';

interface NavItem {
  id: string;
  labelKey: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', labelKey: 'nav.overview', icon: LayoutDashboard },
  { id: 'goals', labelKey: 'nav.goals', icon: Target },
  { id: 'weekly-planning', labelKey: 'nav.weeklyPlanning', icon: CalendarRange },
  { id: 'journaling', labelKey: 'nav.journaling', icon: BookOpenText },
  { id: 'focus', labelKey: 'nav.focus', icon: FocusIcon },
  { id: 'tasks', labelKey: 'nav.tasks', icon: CheckSquare },
  { id: 'habits', labelKey: 'nav.habits', icon: Zap },
  { id: 'routines', labelKey: 'nav.routines', icon: RotateCcw },
  { id: 'finances', labelKey: 'nav.finances', icon: DollarSign },
  { id: 'calendar', labelKey: 'nav.calendar', icon: Calendar },
  { id: 'notes', labelKey: 'nav.notes', icon: FileText },
];

const BOTTOM_ITEMS: NavItem[] = [
  { id: 'settings', labelKey: 'nav.settings', icon: Settings },
];

interface SidebarProps {
  activeModule: string;
  onNavigate: (module: string) => void;
  mobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ activeModule, onNavigate, mobile = false, onCloseMobile }: SidebarProps) {
  const { sidebarCollapsed, toggleSidebar, user, notifications, signOut } = useAppStore(
    useShallow((state) => ({
      sidebarCollapsed: state.sidebarCollapsed,
      toggleSidebar: state.toggleSidebar,
      user: state.user,
      notifications: state.notifications,
      signOut: state.signOut,
    }))
  );
  const { t } = useI18n();
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const isCollapsed = mobile ? false : sidebarCollapsed;

  const navItems = NAV_ITEMS.map(item => ({
    ...item,
    badge: item.id === 'tasks' && unreadCount > 0 ? unreadCount : undefined,
  }));

  return (
    <motion.aside
      className={cn(
        'flex flex-col h-full bg-bg-primary border-r border-border relative overflow-hidden',
        mobile && 'z-50 w-[240px] max-w-[85vw] shadow-2xl'
      )}
      animate={{ width: mobile ? 240 : isCollapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Subtle gradient top */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-violet-500/5 to-transparent pointer-events-none" />


      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border shrink-0 overflow-hidden">
        <BrandLogo collapsed={isCollapsed} className="transition-all duration-300" />
      </div>

      {/* User Profile */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-4 border-b border-border shrink-0',
        isCollapsed && 'justify-center px-2'
      )}>
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white overflow-hidden shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-bg-primary pulse-dot" />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex-1 min-w-0"
            >
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* Nav Items */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeModule === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                if (mobile) onCloseMobile?.();
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative cursor-pointer',
                isActive
                  ? 'bg-violet-500/15 text-violet-400'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5',
                isCollapsed && 'justify-center px-0'
              )}
              aria-label={t(item.labelKey)}
              title={isCollapsed ? t(item.labelKey) : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-violet-500/15 rounded-xl border border-violet-500/20"
                  transition={{ duration: 0.2 }}
                />
              )}
              <div className="relative">
                <Icon size={18} className="shrink-0" />
                {item.badge && !isCollapsed && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-violet-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex items-center justify-between min-w-0"
                  >
                    <span className="text-sm font-medium whitespace-nowrap">{t(item.labelKey)}</span>
                    {item.badge && (
                      <span className="bg-violet-500/30 text-violet-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* Bottom Items */}
      <div className="px-3 py-3 space-y-0.5 border-t border-border shrink-0">
        {BOTTOM_ITEMS.map((item) => {
          const isActive = activeModule === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                if (mobile) onCloseMobile?.();
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer',
                isActive
                  ? 'bg-violet-500/15 text-violet-400'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5',
                isCollapsed && 'justify-center px-0'
              )}
              aria-label={t(item.labelKey)}
              title={isCollapsed ? t(item.labelKey) : undefined}
            >
              <Icon size={18} className="shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {t(item.labelKey)}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}

        <button
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/5 transition-all duration-200 cursor-pointer',
            isCollapsed && 'justify-center px-0'
          )}
          aria-label={t('common.help')}
          title={isCollapsed ? t('nav.help') : undefined}
        >
          <HelpCircle size={18} className="shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                {t('nav.help')}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={() => {
            void signOut();
            if (mobile) onCloseMobile?.();
          }}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-red-400/80 hover:bg-red-500/5 transition-all duration-200 cursor-pointer',
            isCollapsed && 'justify-center px-0'
          )}
          aria-label={t('nav.signOut')}
          title={isCollapsed ? t('nav.signOut') : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                {t('nav.signOut')}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Collapse Toggle */}
        {!mobile ? (
          <button
            onClick={toggleSidebar}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/5 transition-all duration-200 mt-2 cursor-pointer',
              isCollapsed && 'justify-center px-0'
            )}
            aria-label={isCollapsed ? t('common.expandSidebar') : t('common.collapseSidebar')}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {isCollapsed ? t('nav.expand') : t('nav.collapse')}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ) : null}
      </div>
    </motion.aside>
  );
}
