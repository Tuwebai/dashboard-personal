import { useState, type ReactNode } from 'react';
import { Sidebar } from '../../features/navigation/components/Sidebar';
import { CommandPalette } from '../../features/navigation/components/CommandPalette';
import { TopNavbar } from '../../features/navigation/components/TopNavbar';
import { useGlobalKeyboardShortcuts } from '../../features/navigation/hooks/useGlobalKeyboardShortcuts';
import { WorkspaceReadonlyBanner } from '../../shared/ui/WorkspaceReadonlyBanner';
import type { AppModule } from '../../core/navigation/routes';

interface DashboardLayoutProps {
  activeModule: AppModule;
  onNavigate: (module: AppModule) => void;
  children: ReactNode;
}

export function DashboardLayout({ activeModule, onNavigate, children }: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  useGlobalKeyboardShortcuts({ onNavigate });

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-bg-primary">
      <div className="hidden min-h-0 lg:flex">
        <Sidebar activeModule={activeModule} onNavigate={onNavigate} />
      </div>
      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <Sidebar
            activeModule={activeModule}
            onNavigate={onNavigate}
            mobile
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />
          <button
            type="button"
            aria-label="Cerrar navegación"
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
        </div>
      ) : null}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <TopNavbar
          activeModule={activeModule}
          onNavigate={onNavigate}
          onToggleSidebar={() => setMobileSidebarOpen(true)}
        />
        <CommandPalette onNavigate={onNavigate} />
        <WorkspaceReadonlyBanner />
        <main
          className="min-h-0 flex-1 overflow-y-auto"
          style={{ padding: 'var(--page-padding-y) var(--page-padding-x)' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
