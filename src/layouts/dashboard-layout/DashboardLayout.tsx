import type { ReactNode } from 'react';
import { Sidebar } from '../../features/navigation/components/Sidebar';
import { TopNavbar } from '../../features/navigation/components/TopNavbar';

interface DashboardLayoutProps {
  activeModule: string;
  onNavigate: (module: string) => void;
  children: ReactNode;
}

export function DashboardLayout({ activeModule, onNavigate, children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      <Sidebar activeModule={activeModule} onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar activeModule={activeModule} onNavigate={onNavigate} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
