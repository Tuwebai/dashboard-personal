import { useState, type ReactNode } from 'react';
import { Sidebar } from '../../features/navigation/components/Sidebar';
import { TopNavbar } from '../../features/navigation/components/TopNavbar';
import { WorkspaceReadonlyBanner } from '../../shared/ui/WorkspaceReadonlyBanner';

interface DashboardLayoutProps {
  activeModule: string;
  onNavigate: (module: string) => void;
  children: ReactNode;
}

export function DashboardLayout({ activeModule, onNavigate, children }: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh min-h-0 bg-bg-primary overflow-hidden">
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
        <WorkspaceReadonlyBanner />
        <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
