import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Shield, BarChart3, Users, TrendingUp, Target } from 'lucide-react';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import RankBadge from '../components/ui/RankBadge';

interface ArmyRanking {
  id: string;
  name: string;
  slug: string;
  total_score: number;
  member_count: number;
  credibility_rating: number;
  actor: { name: string; image_url: string | null };
}

interface UserRanking {
  id: string;
  display_name: string;
  rank: string;
  total_points: number;
  prediction_accuracy: number;
  streak_days: number;
}

export default function RankingsPage() {
  const [tab, setTab] = useState<'armies' | 'users'>('armies');
  const [armies, setArmies] = useState<ArmyRanking[]>([]);
  const [users, setUsers] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [armiesRes, usersRes] = await Promise.all([
        supabase.from('armies').select('id, name, slug, total_score, member_count, credibility_rating, actor:actors(name, image_url)').order('total_score', { ascending: false }).limit(50),
        supabase.from('profiles').select('id, display_name, rank, total_points, prediction_accuracy, streak_days').order('total_points', { ascending: false }).limit(50),
      ]);
      if (armiesRes.data) setArmies(armiesRes.data as unknown as ArmyRanking[]);
      if (usersRes.data) setUsers(usersRes.data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Trophy className="w-8 h-8 text-brand-400" />
          Rankings
        </h1>
        <p className="text-surface-400 mt-1">Global leaderboard -- armies and individual contributors</p>
      </div>

      <div className="flex gap-1 bg-surface-900 border border-surface-800 rounded-lg p-1 max-w-xs mb-8">
        <button
          onClick={() => setTab('armies')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
            tab === 'armies' ? 'bg-surface-800 text-white' : 'text-surface-500 hover:text-surface-300'
          }`}
        >
          <Shield className="w-4 h-4" />
          Armies
        </button>
        <button
          onClick={() => setTab('users')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
            tab === 'users' ? 'bg-surface-800 text-white' : 'text-surface-500 hover:text-surface-300'
          }`}
        >
          <Users className="w-4 h-4" />
          Individuals
        </button>
      </div>

      {tab === 'armies' ? (
        <div className="space-y-2">
          {armies.map((army, i) => (
            <Link
              key={army.id}
              to={`/armies/${army.slug}`}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:border-surface-600 ${
                i === 0 ? 'bg-brand-500/5 border-brand-500/20' : 'bg-surface-900 border-surface-800'
              }`}
            >
              <span className={`text-xl font-bold w-8 text-center ${
                i === 0 ? 'text-brand-400' : i === 1 ? 'text-surface-300' : i === 2 ? 'text-amber-600' : 'text-surface-600'
              }`}>
                {i + 1}
              </span>

              <div className="w-10 h-10 rounded-full bg-surface-700 overflow-hidden shrink-0">
                {army.actor?.image_url ? (
                  <img src={army.actor.image_url} alt={army.actor.name} className="w-full h-full object-cover" />
                ) : (
                  <Shield className="w-full h-full p-2 text-surface-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{army.name}</p>
                <p className="text-xs text-surface-500">{army.actor?.name}</p>
              </div>

              <div className="hidden sm:flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm font-bold text-brand-400">{army.total_score.toLocaleString()}</p>
                  <p className="text-[10px] text-surface-600 uppercase">Score</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white">{army.member_count}</p>
                  <p className="text-[10px] text-surface-600 uppercase">Members</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white">{army.credibility_rating}%</p>
                  <p className="text-[10px] text-surface-600 uppercase">Credibility</p>
                </div>
              </div>
            </Link>
          ))}

          {armies.length === 0 && (
            <div className="text-center py-16 text-surface-400">
              <Shield className="w-12 h-12 text-surface-600 mx-auto mb-4" />
              <p>No armies ranked yet.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((u, i) => (
            <div
              key={u.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                i === 0 ? 'bg-brand-500/5 border-brand-500/20' : 'bg-surface-900 border-surface-800'
              }`}
            >
              <span className={`text-xl font-bold w-8 text-center ${
                i === 0 ? 'text-brand-400' : i === 1 ? 'text-surface-300' : i === 2 ? 'text-amber-600' : 'text-surface-600'
              }`}>
                {i + 1}
              </span>

              <div className="w-10 h-10 rounded-full bg-surface-700 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-surface-300">
                  {u.display_name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{u.display_name}</p>
                <RankBadge rank={u.rank} size="sm" />
              </div>

              <div className="hidden sm:flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm font-bold text-brand-400">{u.total_points.toLocaleString()}</p>
                  <p className="text-[10px] text-surface-600 uppercase">Points</p>
                </div>
                <div className="text-center flex items-center gap-1">
                  <Target className="w-3 h-3 text-surface-500" />
                  <p className="text-sm font-bold text-white">{u.prediction_accuracy}%</p>
                </div>
                <div className="text-center flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-surface-500" />
                  <p className="text-sm font-bold text-white">{u.streak_days}d</p>
                </div>
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="text-center py-16 text-surface-400">
              <BarChart3 className="w-12 h-12 text-surface-600 mx-auto mb-4" />
              <p>No users ranked yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
