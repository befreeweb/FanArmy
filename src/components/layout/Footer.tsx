import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-surface-800/50 bg-surface-950">
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/20 to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-white">BusinessOfCinema</span>
            </Link>
            <p className="mt-3 text-sm text-surface-500 leading-relaxed">
              India's independent fan-power tracking platform. Turning fandom energy into structured, measurable signal.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-4">Platform</h4>
            <div className="space-y-2.5">
              <Link to="/films" className="block text-sm text-surface-500 hover:text-brand-300 transition-colors">Films</Link>
              <Link to="/armies" className="block text-sm text-surface-500 hover:text-brand-300 transition-colors">Armies</Link>
              <Link to="/missions" className="block text-sm text-surface-500 hover:text-brand-300 transition-colors">Missions</Link>
              <Link to="/rankings" className="block text-sm text-surface-500 hover:text-brand-300 transition-colors">Rankings</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-4">Community</h4>
            <div className="space-y-2.5">
              <Link to="/dashboard" className="block text-sm text-surface-500 hover:text-brand-300 transition-colors">Dashboard</Link>
              <span className="block text-sm text-surface-600">The Vault (Coming Soon)</span>
              <span className="block text-sm text-surface-600">Clash Seasons (Coming Soon)</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-4">About</h4>
            <div className="space-y-2.5">
              <span className="block text-sm text-surface-500">How It Works</span>
              <span className="block text-sm text-surface-500">For Studios</span>
              <span className="block text-sm text-surface-500">Editorial Policy</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-surface-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-600">Social Power Armies by BusinessOfCinema.com</p>
          <p className="text-xs text-surface-600">Fan intelligence, not fan manipulation.</p>
        </div>
      </div>
    </footer>
  );
}
