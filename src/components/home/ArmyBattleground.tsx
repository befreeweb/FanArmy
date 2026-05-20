import { Link } from 'react-router-dom';
import { Shield, Trophy, Users, ChevronRight, TrendingUp, Crown } from 'lucide-react';
import type { Army, Actor } from '../../types';

interface Props {
  armies: (Army & { actor: Pick<Actor, 'name' | 'image_url'> })[];
}

export default function ArmyBattleground({ armies }: Props) {
  if (armies.length === 0) return null;

  const leader = armies[0];
  const challengers = armies.slice(1);

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-950/10 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Trophy className="w-3.5 h-3.5" />
              Army Battleground
            </div>
            <h2 className="text-3xl font-bold text-white">Power Rankings</h2>
            <p className="text-surface-400 mt-1">Which fandom dominates Indian cinema?</p>
          </div>
          <Link to="/rankings" className="hidden sm:flex btn-ghost text-sm">
            Full Rankings <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <Link
          to={`/armies/${leader.slug}`}
          className="block mb-6 p-6 rounded-2xl border border-brand-500/20 bg-gradient-to-r from-brand-500/5 via-surface-900/60 to-surface-900/60 backdrop-blur-sm glow-brand hover:border-brand-500/30 transition-all duration-300 group"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-surface-800 overflow-hidden border-2 border-brand-500/30">
                  {leader.actor?.image_url ? (
                    <img src={leader.actor.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Shield className="w-6 h-6 text-surface-500" /></div>
                  )}
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
                  <Crown className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">#1 Ranked</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors truncate">{leader.name}</h3>
                <p className="text-sm text-surface-400">{leader.actor?.name}</p>
              </div>
            </div>

            <div className="flex gap-6 shrink-0">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-400">{leader.total_score.toLocaleString()}</p>
                <p className="text-[10px] text-surface-500 uppercase">Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{leader.member_count.toLocaleString()}</p>
                <p className="text-[10px] text-surface-500 uppercase">Members</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{leader.credibility_rating}%</p>
                <p className="text-[10px] text-surface-500 uppercase">Credibility</p>
              </div>
            </div>
          </div>
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {challengers.map((army, i) => (
            <Link
              key={army.id}
              to={`/armies/${army.slug}`}
              className="flex items-center gap-4 p-4 rounded-2xl bg-surface-900/60 border border-surface-800/50 hover:border-brand-500/20 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300 group"
            >
              <span className={`text-lg font-bold w-6 text-center shrink-0 ${
                i === 0 ? 'text-surface-300' : i === 1 ? 'text-amber-600' : 'text-surface-600'
              }`}>
                {i + 2}
              </span>
              <div className="w-10 h-10 rounded-xl bg-surface-800 overflow-hidden shrink-0">
                {army.actor?.image_url ? (
                  <img src={army.actor.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Shield className="w-4 h-4 text-surface-600" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors truncate">{army.name}</p>
                <p className="text-[10px] text-surface-500 truncate">{army.actor?.name}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-brand-400">{army.total_score.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-[10px] text-surface-500">
                  <Users className="w-3 h-3" />{army.member_count.toLocaleString()}
                </div>
              </div>
              <TrendingUp className="w-4 h-4 text-surface-700 group-hover:text-brand-500 transition-colors shrink-0" />
            </Link>
          ))}
        </div>

        <div className="sm:hidden text-center mt-6">
          <Link to="/rankings" className="btn-ghost text-sm">
            Full Rankings <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
