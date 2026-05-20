import { Link } from 'react-router-dom';
import { Shield, Target, TrendingUp, Award, Zap, Flame, BarChart3, ChevronRight, Star, Brain } from 'lucide-react';
import RankBadge from '../components/ui/RankBadge';
import StatCard from '../components/ui/StatCard';

const DEMO_PROFILE = {
  display_name: 'CinemaFanatic',
  rank: 'strategist' as const,
  total_points: 1850,
  prediction_accuracy: 74,
  streak_days: 12,
};

const DEMO_PREDICTIONS = [
  { id: '1', film: { title: 'King', slug: 'king' }, prediction_type: 'opening_weekend', predicted_value: 48, accuracy_score: null },
  { id: '2', film: { title: 'Ramayana', slug: 'ramayana' }, prediction_type: 'lifetime', predicted_value: 320, accuracy_score: null },
  { id: '3', film: { title: 'War 2', slug: 'war-2' }, prediction_type: 'opening_weekend', predicted_value: 55, accuracy_score: 82 },
  { id: '4', film: { title: 'Chhava', slug: 'chhava' }, prediction_type: 'lifetime', predicted_value: 180, accuracy_score: 67 },
];

const DEMO_MISSIONS = [
  { id: '1', title: 'King Trailer Breakdown', points: 50, date: '2026-02-08', validated: true },
  { id: '2', title: 'Spirit Buzz Poll', points: 30, date: '2026-02-07', validated: true },
  { id: '3', title: 'Ramayana Momentum Watch', points: 40, date: '2026-02-06', validated: false },
];

const DEMO_ARMIES = [
  { id: '1', name: 'SRK Universe', slug: 'srk-universe', actor: 'Shah Rukh Khan' },
  { id: '2', name: 'Deepika Nation', slug: 'deepika-nation', actor: 'Deepika Padukone' },
];

const DEMO_BADGES = [
  { name: 'First Prediction', tier: 'bronze' },
  { name: 'Sharp Shooter', tier: 'silver' },
  { name: 'Mission Veteran', tier: 'gold' },
  { name: 'Streak Master', tier: 'silver' },
];

const RANK_THRESHOLDS = [
  { rank: 'rookie', min: 0, max: 100 },
  { rank: 'analyst', min: 100, max: 500 },
  { rank: 'strategist', min: 500, max: 2000 },
  { rank: 'oracle', min: 2000, max: 10000 },
  { rank: 'scout', min: 10000, max: Infinity },
];

export default function DashboardPage() {
  const profile = DEMO_PROFILE;

  const currentThreshold = RANK_THRESHOLDS.find((t) => profile.total_points >= t.min && profile.total_points < t.max) || RANK_THRESHOLDS[0];
  const nextThreshold = RANK_THRESHOLDS[RANK_THRESHOLDS.indexOf(currentThreshold) + 1];
  const progressToNext = nextThreshold
    ? Math.min(100, ((profile.total_points - currentThreshold.min) / (nextThreshold.min - currentThreshold.min)) * 100)
    : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-[10px] font-semibold mb-3">
            <Star className="w-3 h-3" />
            DEMO MODE
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome, {profile.display_name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <RankBadge rank={profile.rank} />
            <span className="flex items-center gap-1 text-sm text-brand-400">
              <Flame className="w-4 h-4" />
              {profile.streak_days} day streak
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Zap} label="Total Points" value={profile.total_points.toLocaleString()} color="brand" />
        <StatCard icon={Target} label="Prediction Accuracy" value={`${profile.prediction_accuracy}%`} color="blue" />
        <StatCard icon={Flame} label="Day Streak" value={profile.streak_days} color="red" />
        <StatCard icon={Award} label="Badges Earned" value={DEMO_BADGES.length} color="emerald" />
      </div>

      {nextThreshold && (
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-surface-300">Progress to {nextThreshold.rank}</span>
            <span className="text-xs text-surface-500">{profile.total_points} / {nextThreshold.min} pts</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-400" />
                My Predictions
              </h2>
              <Link to="/films" className="btn-ghost text-xs">
                Make Prediction <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {DEMO_PREDICTIONS.map((pred) => (
                <Link
                  key={pred.id}
                  to={`/films/${pred.film.slug}`}
                  className="flex items-center gap-4 p-3 rounded-xl bg-surface-900/60 border border-surface-800/50 hover:border-brand-500/20 transition-all duration-300"
                >
                  <TrendingUp className="w-4 h-4 text-surface-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{pred.film.title}</p>
                    <p className="text-xs text-surface-500 capitalize">{pred.prediction_type.replace('_', ' ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{pred.predicted_value} Cr</p>
                    {pred.accuracy_score !== null && (
                      <p className={`text-xs font-medium ${pred.accuracy_score >= 80 ? 'text-emerald-400' : pred.accuracy_score >= 50 ? 'text-brand-400' : 'text-red-400'}`}>
                        {pred.accuracy_score}% accurate
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-brand-400" />
              Recent Missions
            </h2>
            <div className="space-y-2">
              {DEMO_MISSIONS.map((sub) => (
                <div key={sub.id} className="flex items-center gap-4 p-3 rounded-xl bg-surface-900/60 border border-surface-800/50">
                  <Target className="w-4 h-4 text-surface-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{sub.title}</p>
                    <p className="text-xs text-surface-500">
                      {new Date(sub.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-brand-400">+{sub.points}</span>
                    <span className={`block text-xs ${sub.validated ? 'text-emerald-400' : 'text-surface-500'}`}>
                      {sub.validated ? 'Validated' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-400" />
              My Armies
            </h2>
            <div className="space-y-2">
              {DEMO_ARMIES.map((army) => (
                <Link
                  key={army.id}
                  to={`/armies/${army.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface-900/60 border border-surface-800/50 hover:border-brand-500/20 transition-all duration-300"
                >
                  <Shield className="w-5 h-5 text-brand-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{army.name}</p>
                    <p className="text-xs text-surface-500">{army.actor}</p>
                  </div>
                  <BarChart3 className="w-4 h-4 text-surface-600" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-400" />
              Badges
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_BADGES.map((badge, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl text-center badge-tier-${badge.tier}`}
                  title={badge.name}
                >
                  <Award className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-[10px] font-medium truncate">{badge.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
