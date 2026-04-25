import type { ReactNode } from 'react';
import { useEffect, useLayoutEffect } from 'react';
import { Toaster } from 'sonner';
import { useAppStore } from './stores/useAppStore';
import { DashboardLayout } from './layouts/dashboard-layout/DashboardLayout';
import { Dashboard } from './features/dashboard/pages/DashboardPage';
import { GoalsPage } from './features/goals/pages/GoalsPage';
import { WeeklyPlanningPage } from './features/weekly-planning/pages/WeeklyPlanningPage';
import { JournalingPage } from './features/journaling';
import { FocusPage } from './features/focus';
import { Tasks } from './features/tasks/pages/TasksPage';
import { Routines } from './features/routines/pages/RoutinesPage';
import Habits from './features/habits/pages/HabitsPage';
import Finances from './features/finances/pages/FinancesPage';
import Calendar from './features/calendar/pages/CalendarPage';
import Notes from './features/notes/pages/NotesPage';
import { Settings } from './features/settings/pages/SettingsPage';
import { LoginPage } from './features/auth/pages/LoginPage';
import { useFirebaseAuthBootstrap } from './core/persistence/auth';
import { useFirebasePersistenceSync } from './core/persistence/sync';

export default function App() {
  const { theme, settings, activeModule, setActiveModule, authStatus } = useAppStore();
  useFirebaseAuthBootstrap();
  useFirebasePersistenceSync();

  useLayoutEffect(() => {
    // Sync Theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Sync Compact Mode
    if (settings.compactMode) {
      document.documentElement.classList.add('compact-mode');
    } else {
      document.documentElement.classList.remove('compact-mode');
    }

    // Sync Accent Color natively
    document.documentElement.style.setProperty('--color-primary', settings.accentColor);
  }, [theme, settings.compactMode, settings.accentColor]);

  // Initial sync from URL
  useEffect(() => {
    const path = window.location.pathname.slice(1);
    if (path && path !== 'login' && path !== activeModule) {
      setActiveModule(path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1);
      if (path && path !== 'login') {
        setActiveModule(path);
        return;
      }

      setActiveModule('dashboard');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setActiveModule]);

  // Sync URL when activeModule changes (e.g. from widgets)
  useEffect(() => {
    const path = authStatus !== 'authenticated'
      ? '/login'
      : activeModule === 'dashboard'
        ? '/'
        : `/${activeModule}`;

    if (window.location.pathname !== path) {
      window.history.pushState({ module: activeModule }, '', path);
    }
  }, [activeModule, authStatus]);

  const handleNavigate = (module: string) => {
    setActiveModule(module);
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'goals':
        return <GoalsPage />;
      case 'weekly-planning':
        return <WeeklyPlanningPage />;
      case 'journaling':
        return <JournalingPage />;
      case 'focus':
        return <FocusPage />;
      case 'tasks':
        return <Tasks />;
      case 'routines':
        return <Routines />;
      case 'habits':
        return <Habits />;
      case 'finances':
        return <Finances />;
      case 'calendar':
        return <Calendar />;
      case 'notes':
        return <Notes />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  let content: ReactNode;

  if (authStatus === 'loading') {
    content = (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary text-white">
        <div className="rounded-3xl border border-white/10 bg-bg-card px-8 py-6 text-center shadow-2xl shadow-black/30">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-300/80">
            NexusCRM
          </p>
          <p className="mt-3 text-sm text-white/60">Verificando sesión...</p>
        </div>
      </div>
    );
  } else if (authStatus !== 'authenticated') {
    content = <LoginPage />;
  } else {
    content = (
      <DashboardLayout activeModule={activeModule} onNavigate={handleNavigate}>
        {renderModule()}
      </DashboardLayout>
    );
  }

  return (
    <>
      {content}
      <Toaster position="top-right" richColors theme="dark" />
    </>
  );
}
