import { useEffect, useLayoutEffect } from 'react';
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
import { useFirebaseAuthBootstrap } from './core/persistence/auth';
import { useFirebasePersistenceSync } from './core/persistence/sync';

export default function App() {
  const { theme, settings, activeModule, setActiveModule } = useAppStore();
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
    if (path && path !== activeModule) {
      setActiveModule(path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1);
      setActiveModule(path || 'dashboard');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setActiveModule]);

  // Sync URL when activeModule changes (e.g. from widgets)
  useEffect(() => {
    const path = activeModule === 'dashboard' ? '/' : `/${activeModule}`;
    if (window.location.pathname !== path) {
      window.history.pushState({ module: activeModule }, '', path);
    }
  }, [activeModule]);

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

  return (
    <DashboardLayout activeModule={activeModule} onNavigate={handleNavigate}>
      {renderModule()}
    </DashboardLayout>
  );
}
