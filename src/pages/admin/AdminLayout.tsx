import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Film, Shield, Target, Zap, LayoutDashboard, ChevronLeft, Users } from 'lucide-react';

const ADMIN_LINKS = [
  { path: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { path: '/admin/films', label: 'Films', icon: Film },
  { path: '/admin/actors', label: 'Actors & Armies', icon: Shield },
  { path: '/admin/missions', label: 'Missions', icon: Target },
  { path: '/admin/daily', label: 'Daily Questions', icon: Zap },
  { path: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} shrink-0 border-r border-surface-800 bg-surface-900/50 transition-all duration-200`}>
        <div className="p-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-all"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
            {sidebarOpen && <span className="text-xs font-medium">Admin Panel</span>}
          </button>
        </div>
        <nav className="px-3 space-y-1">
          {ADMIN_LINKS.map(({ path, label, icon: Icon, exact }) => {
            const active = exact ? location.pathname === path : location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active ? 'bg-surface-800 text-brand-400' : 'text-surface-400 hover:text-white hover:bg-surface-800/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {sidebarOpen && label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 p-6 sm:p-8 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
