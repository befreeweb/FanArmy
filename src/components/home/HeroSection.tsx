import { Link } from 'react-router-dom';
import { Shield, Zap, Users, Film, ChevronRight } from 'lucide-react';
import type { Army, Actor } from '../../types';

interface Props {
  topArmies: (Army & { actor: Pick<Actor, 'name' | 'image_url'> })[];
  stats: { armies: number; members: number; films: number };
}

export default function HeroSection({ topArmies, stats }: Props) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] rounded-full bg-brand-600/8 blur-[120px] animate-float" />
        <div className="absolute bottom-[-20%] right-[-5%] w-[500px] h-[500px] rounded-full bg-brand-500/6 blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[20%] right-[30%] w-[300px] h-[300px] rounded-full bg-brand-400/5 blur-[80px] animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-[10px] font-semibold mb-6">
              <Zap className="w-3 h-3" />
              INDIA'S FAN INTELLIGENCE PLATFORM
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">
              <span className="text-white">Prove Your</span>
              <br />
              <span className="gradient-text">Fandom Power</span>
            </h1>

            <p className="mt-5 text-lg text-surface-400 leading-relaxed max-w-lg">
              Join an army. Predict box office. Complete missions. Rise through the ranks. Your film knowledge has never been more powerful.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/armies" className="btn-primary">
                <Shield className="w-4 h-4" />
                Explore Armies
              </Link>
              <Link to="/films" className="btn-secondary">
                <Film className="w-4 h-4" />
                Browse Films
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10 max-w-sm">
              {[
                { icon: Shield, value: stats.armies, label: 'Armies' },
                { icon: Users, value: stats.members.toLocaleString(), label: 'Members' },
                { icon: Film, value: stats.films, label: 'Films' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-brand-400" />
                    <span className="text-xl font-bold text-white">{value}</span>
                  </div>
                  <span className="text-[10px] text-surface-500 uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-3">
              {topArmies.slice(0, 4).map((army, i) => (
                <Link
                  key={army.id}
                  to={`/armies/${army.slug}`}
                  className={`group p-4 rounded-2xl border border-surface-800/50 bg-surface-900/40 backdrop-blur-sm hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300 ${i === 0 ? 'ring-1 ring-brand-500/20' : ''}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-800 overflow-hidden shrink-0">
                      {army.actor?.image_url ? (
                        <img src={army.actor.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Shield className="w-4 h-4 text-surface-600" /></div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-brand-300 transition-colors">{army.name}</p>
                      <p className="text-[10px] text-surface-500 truncate">{army.actor?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-brand-400 font-bold">{army.total_score.toLocaleString()} pts</span>
                    <span className="text-surface-500">{army.member_count.toLocaleString()} fans</span>
                  </div>
                  <div className="mt-2 w-full h-1 rounded-full bg-surface-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400" style={{ width: `${army.credibility_rating}%` }} />
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link to="/armies" className="inline-flex items-center gap-1 text-xs text-surface-500 hover:text-brand-400 transition-colors">
                View all armies <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
