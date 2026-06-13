import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * DashboardLayout — wraps Sidebar + Header + main content area.
 * Uses CSS grid for sidebar + main split.
 */
export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 animate-slide-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
