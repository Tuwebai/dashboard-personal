import { lazy, Suspense, type ReactNode } from 'react';
import { useEffect, useLayoutEffect } from 'react';
import { Toaster } from 'sonner';
import { useAppStore } from './stores/useAppStore';
import { useShallow } from 'zustand/react/shallow';
import { DashboardLayout } from './layouts/dashboard-layout/DashboardLayout';
import { useFirebaseAuthBootstrap } from './core/persistence/auth';
import { useFirebasePersistenceSync } from './core/persistence/sync';
import { FeatureErrorBoundary } from './shared/ui/FeatureErrorBoundary';
import { PageSkeleton } from './shared/ui/PageSkeleton';

const Dashboard = lazy(() => import('./features/dashboard/pages/DashboardPage').then(m => ({ default: m.Dashboard })));
const GoalsPage = lazy(() => import('./features/goals/pages/GoalsPage').then(m => ({ default: m.GoalsPage })));
const WeeklyPlanningPage = lazy(() =>
  import('./features/weekly-planning/pages/WeeklyPlanningPage').then(m => ({ default: m.WeeklyPlanningPage }))
);
const JournalingPage = lazy(() => import('./features/journaling').then(m => ({ default: m.JournalingPage })));
const FocusPage = lazy(() => import('./features/focus').then(m => ({ default: m.FocusPage })));
const Tasks = lazy(() => import('./features/tasks/pages/TasksPage').then(m => ({ default: m.Tasks })));
const Routines = lazy(() => import('./features/routines/pages/RoutinesPage').then(m => ({ default: m.Routines })));
const Habits = lazy(() => import('./features/habits/pages/HabitsPage'));
const Finances = lazy(() => import('./features/finances/pages/FinancesPage'));
const Calendar = lazy(() => import('./features/calendar/pages/CalendarPage'));
const Notes = lazy(() => import('./features/notes/pages/NotesPage'));
const Settings = lazy(() => import('./features/settings/pages/SettingsPage').then(m => ({ default: m.Settings })));
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));

export default function App() {
  const { theme, compactMode, accentColor, activeModule, setActiveModule, authStatus } = useAppStore(
    useShallow((state) => ({
      theme: state.theme,
      compactMode: state.settings.compactMode,
      accentColor: state.settings.accentColor,
      activeModule: state.activeModule,
      setActiveModule: state.setActiveModule,
      authStatus: state.authStatus,
    })),
  );
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
    if (compactMode) {
      document.documentElement.classList.add('compact-mode');
    } else {
      document.documentElement.classList.remove('compact-mode');
    }

    // Sync Accent Color natively
    document.documentElement.style.setProperty('--color-primary', accentColor);
  }, [theme, compactMode, accentColor]);

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
    const withBoundary = (featureName: string, children: ReactNode) => (
      <FeatureErrorBoundary featureName={featureName}>{children}</FeatureErrorBoundary>
    );

    switch (activeModule) {
      case 'dashboard':
        return withBoundary('Dashboard', <Dashboard />);
      case 'goals':
        return withBoundary('Metas', <GoalsPage />);
      case 'weekly-planning':
        return withBoundary('Planificación semanal', <WeeklyPlanningPage />);
      case 'journaling':
        return withBoundary('Journal', <JournalingPage />);
      case 'focus':
        return withBoundary('Focus', <FocusPage />);
      case 'tasks':
        return withBoundary('Tareas', <Tasks />);
      case 'routines':
        return withBoundary('Rutinas', <Routines />);
      case 'habits':
        return withBoundary('Hábitos', <Habits />);
      case 'finances':
        return withBoundary('Finanzas', <Finances />);
      case 'calendar':
        return withBoundary('Calendario', <Calendar />);
      case 'notes':
        return withBoundary('Notas', <Notes />);
      case 'settings':
        return withBoundary('Ajustes', <Settings />);
      default:
        return withBoundary('Dashboard', <Dashboard />);
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
    content = (
      <Suspense fallback={<PageSkeleton />}>
        <LoginPage />
      </Suspense>
    );
  } else {
    content = (
      <DashboardLayout activeModule={activeModule} onNavigate={handleNavigate}>
        <Suspense fallback={<PageSkeleton />}>{renderModule()}</Suspense>
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
