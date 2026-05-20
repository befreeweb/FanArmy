import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Film, Shield, BarChart3, Target, LayoutDashboard, Zap } from 'lucide-react';

const NAV_LINKS = [
  { path: '/films', label: 'Films', icon: Film },
  { path: '/armies', label: 'Armies', icon: Shield },
  { path: '/missions', label: 'Missions', icon: Target },
  { path: '/rankings', label: 'Rankings', icon: BarChart3 },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-brand-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white leading-none">BusinessOfCinema</span>
              <span className="text-[10px] font-medium text-brand-400 tracking-widest uppercase leading-none mt-0.5">Social Power Armies</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(path)
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                    : 'text-surface-400 hover:text-white hover:bg-surface-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/dashboard') ? 'bg-brand-500/10 text-brand-400' : 'text-surface-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link to="/admin" className="btn-ghost text-sm">
              Admin
            </Link>
            <Link to="/signup" className="btn-primary text-sm !py-2 !px-4">Join Army</Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-surface-400 hover:text-white transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-surface-800 bg-surface-900/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(path) ? 'bg-brand-500/10 text-brand-400' : 'text-surface-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            <div className="border-t border-surface-800 pt-2 mt-2 space-y-1">
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-surface-400"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-surface-400"
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
              <div className="px-4 py-2">
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary text-sm w-full">Join Army</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
