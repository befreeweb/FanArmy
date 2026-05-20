import { Link } from 'react-router-dom';
import { Zap, Target, Flame, Award, Shield, TrendingUp, ChevronRight } from 'lucide-react';

const DEMO = {
  name: 'CinemaFanatic',
  rank: 'Strategist',
  points: 1850,
  accuracy: 74,
  streak: 12,
  badges: 4,
  predictions: [
    { film: 'King', type: 'Opening Weekend', value: '48 Cr', accuracy: null },
    { film: 'Ramayana', type: 'Lifetime', value: '320 Cr', accuracy: null },
    { film: 'War 2', type: 'Opening Weekend', value: '55 Cr', accuracy: 82 },
  ],
  armies: ['SRK Universe', 'Deepika Nation'],
};

export default function DashboardPreview() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-950/10 via-transparent to-brand-950/10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            Your Dashboard
          </div>
          <h2 className="text-3xl font-bold text-white">Track Your Progress</h2>
          <p className="text-surface-400 mt-1">Every prediction, every mission, every badge -- all in one place</p>
        </div>

        <div className="rounded-2xl border border-surface-800/50 bg-surface-900/40 backdrop-blur-sm overflow-hidden">
          <div className="p-6 border-b border-surface-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
                <span className="text-lg font-bold text-white">C</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{DEMO.name}</h3>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <Shield className="w-3 h-3" />{DEMO.rank}
                </span>
              </div>
            </div>
            <Link to="/dashboard" className="btn-ghost text-xs">
              Full Dashboard <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-surface-800/50">
            {[
              { icon: Zap, label: 'Points', value: DEMO.points.toLocaleString(), color: 'text-brand-400' },
              { icon: Target, label: 'Accuracy', value: `${DEMO.accuracy}%`, color: 'text-blue-400' },
              { icon: Flame, label: 'Streak', value: `${DEMO.streak} days`, color: 'text-red-400' },
              { icon: Award, label: 'Badges', value: DEMO.badges, color: 'text-emerald-400' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="p-4 sm:p-6 text-center">
                <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
                <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
                <p className="text-[10px] text-surface-500 uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-surface-800/50">
            <div className="p-6">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-400" />
                Recent Predictions
              </h4>
              <div className="space-y-2">
                {DEMO.predictions.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-surface-800/30">
                    <div>
                      <p className="text-sm font-medium text-white">{p.film}</p>
                      <p className="text-[10px] text-surface-500">{p.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{p.value}</p>
                      {p.accuracy && (
                        <p className={`text-[10px] font-medium ${p.accuracy >= 70 ? 'text-emerald-400' : 'text-brand-400'}`}>{p.accuracy}% accurate</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-400" />
                My Armies
              </h4>
              <div className="space-y-2">
                {DEMO.armies.map((name, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-800/30">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-brand-500/10">
                      <Shield className="w-4 h-4 text-brand-400" />
                    </div>
                    <span className="text-sm font-medium text-white">{name}</span>
                  </div>
                ))}
              </div>

              <h4 className="text-sm font-semibold text-white mt-5 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-400" />
                Badges
              </h4>
              <div className="flex gap-2 flex-wrap">
                {['First Prediction', 'Sharp Shooter', 'Mission Veteran', 'Streak Master'].map((badge) => (
                  <span key={badge} className="text-[10px] px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
