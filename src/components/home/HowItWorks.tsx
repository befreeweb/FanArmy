import { Shield, TrendingUp, Trophy } from 'lucide-react';

const STEPS = [
  {
    icon: Shield,
    title: 'Join Your Army',
    desc: 'Pick your favorite star. Every prediction and mission you complete powers up your army.',
    color: 'from-brand-500/20 to-brand-600/10',
  },
  {
    icon: TrendingUp,
    title: 'Predict & Prove',
    desc: 'Forecast box office numbers. The closer you are to reality, the higher your accuracy score.',
    color: 'from-blue-500/20 to-blue-600/10',
  },
  {
    icon: Trophy,
    title: 'Win Recognition',
    desc: 'Rise from Rookie to Scout. Earn badges, climb leaderboards, and prove your cinema IQ.',
    color: 'from-emerald-500/20 to-emerald-600/10',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">How It Works</h2>
          <p className="text-surface-400 mt-2">Three steps to becoming a box office oracle</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map(({ icon: Icon, title, desc, color }, i) => (
            <div key={title} className="relative p-6 rounded-2xl bg-surface-900/60 border border-surface-800/50 text-center hover:border-brand-500/20 transition-all duration-300 group">
              <span className="absolute top-4 right-4 text-5xl font-black text-surface-800/50">{i + 1}</span>
              <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-surface-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
