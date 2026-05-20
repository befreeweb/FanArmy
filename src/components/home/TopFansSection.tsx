import { Trophy, Users, Flame, Target } from 'lucide-react';
import type { Profile } from '../../types';
import RankBadge from '../ui/RankBadge';

interface Props {
  users: Pick<Profile, 'id' | 'display_name' | 'rank' | 'total_points' | 'prediction_accuracy' | 'streak_days'>[];
}

export default function TopFansSection({ users }: Props) {
  if (users.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-950/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            Community
          </div>
          <h2 className="text-3xl font-bold text-white">Top Fans & Predictors</h2>
          <p className="text-surface-400 mt-1">The sharpest minds in Indian cinema fandom</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {users.slice(0, 9).map((user, i) => (
            <div
              key={user.id}
              className={`flex items-center gap-4 p-4 rounded-2xl bg-surface-900/60 border transition-all duration-300 ${
                i === 0 ? 'border-brand-500/30 glow-brand sm:col-span-2 lg:col-span-1' : 'border-surface-800/50 hover:border-brand-500/20'
              }`}
            >
              <span className={`text-lg font-bold w-6 text-center shrink-0 ${
                i === 0 ? 'text-brand-400' : i === 1 ? 'text-surface-300' : i === 2 ? 'text-amber-600' : 'text-surface-600'
              }`}>
                {i + 1}
              </span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                i === 0 ? 'bg-brand-500/20 ring-2 ring-brand-500/30' : 'bg-surface-700'
              }`}>
                <span className={`text-sm font-bold ${i === 0 ? 'text-brand-300' : 'text-surface-300'}`}>
                  {user.display_name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.display_name}</p>
                <RankBadge rank={user.rank} size="sm" />
              </div>
              <div className="text-right shrink-0 space-y-0.5">
                <div className="flex items-center gap-1 justify-end">
                  <Trophy className="w-3 h-3 text-brand-400" />
                  <span className="text-sm font-bold text-white">{user.total_points.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 justify-end text-[10px] text-surface-500">
                  <span className="flex items-center gap-0.5"><Target className="w-2.5 h-2.5" />{user.prediction_accuracy}%</span>
                  <span className="flex items-center gap-0.5"><Flame className="w-2.5 h-2.5" />{user.streak_days}d</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
