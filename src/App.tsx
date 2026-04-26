import { lazy, Suspense, type ReactNode } from 'react';
import { useLayoutEffect } from 'react';
import { Toaster } from 'sonner';
import { useAppStore } from './stores/useAppStore';
import { useShallow } from 'zustand/react/shallow';
import { DashboardLayout } from './layouts/dashboard-layout/DashboardLayout';
import { useFirebaseAuthBootstrap } from './core/persistence/auth';
import { useFirebasePersistenceSync } from './core/persistence/sync';
import { useAppNavigationSync } from './core/navigation/useAppNavigationSync';
import type { AppModule } from './core/navigation/routes';
import { FeatureErrorBoundary } from './shared/ui/FeatureErrorBoundary';
import { PageSkeleton } from './shared/ui/PageSkeleton';
import { AppLoadingScreen } from './shared/ui/AppLoadingScreen';

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
  useAppNavigationSync(activeModule, authStatus, setActiveModule);

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

  const handleNavigate = (module: AppModule) => {
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
    content = <AppLoadingScreen />;
  } else if (authStatus !== 'authenticated') {
    content = (
      <Suspense fallback={<AppLoadingScreen />}>
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
