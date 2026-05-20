import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, Users, TrendingUp, Trophy, UserPlus, BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Army, Actor, ArmyMember } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import RankBadge from '../components/ui/RankBadge';

export default function ArmyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [army, setArmy] = useState<Army | null>(null);
  const [actor, setActor] = useState<Actor | null>(null);
  const [members, setMembers] = useState<(ArmyMember & { profile: { display_name: string; rank: string } })[]>([]);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filmCount, setFilmCount] = useState(0);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      const { data: armyData } = await supabase
        .from('armies')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!armyData) { setLoading(false); return; }
      setArmy(armyData);

      const [actorRes, membersRes, filmCountRes] = await Promise.all([
        supabase.from('actors').select('*').eq('id', armyData.actor_id).maybeSingle(),
        supabase.from('army_members').select('*, profile:profiles(display_name, rank)').eq('army_id', armyData.id).order('contribution_score', { ascending: false }).limit(20),
        supabase.from('film_cast').select('id', { count: 'exact', head: true }).eq('actor_id', armyData.actor_id),
      ]);

      if (actorRes.data) setActor(actorRes.data);
      if (membersRes.data) setMembers(membersRes.data as typeof members);
      setFilmCount(filmCountRes.count || 0);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!army || !actor) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-surface-400">Army not found.</div>;

  return (
    <div>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 via-surface-950/90 to-surface-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-surface-800 overflow-hidden shrink-0 border-2 border-brand-500/20">
              {actor.image_url ? (
                <img src={actor.image_url} alt={actor.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Shield className="w-10 h-10 text-surface-500" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{army.name}</h1>
              <p className="text-surface-400 mt-1">{actor.name} -- {actor.language}</p>
              {actor.bio && <p className="text-sm text-surface-500 mt-2 max-w-2xl">{actor.bio}</p>}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-3 rounded-xl bg-surface-800/50 border border-surface-700/50">
                  <p className="text-2xl font-bold text-brand-400">{army.total_score.toLocaleString()}</p>
                  <p className="text-[10px] text-surface-500 uppercase tracking-wider mt-0.5">Score</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-surface-800/50 border border-surface-700/50">
                  <p className="text-2xl font-bold text-white">{army.member_count.toLocaleString()}</p>
                  <p className="text-[10px] text-surface-500 uppercase tracking-wider mt-0.5">Members</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-surface-800/50 border border-surface-700/50">
                  <p className="text-2xl font-bold text-white">{army.credibility_rating}%</p>
                  <p className="text-[10px] text-surface-500 uppercase tracking-wider mt-0.5">Credibility</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-surface-800/50 border border-surface-700/50">
                  <p className="text-2xl font-bold text-white">{filmCount}</p>
                  <p className="text-[10px] text-surface-500 uppercase tracking-wider mt-0.5">Films</p>
                </div>
              </div>

              <div className="mt-6">
                {joined ? (
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                    <Shield className="w-4 h-4" />
                    Enlisted! Welcome to {army.name}
                  </div>
                ) : (
                  <button onClick={() => setJoined(true)} className="btn-primary text-sm">
                    <UserPlus className="w-4 h-4" />
                    Join This Army
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-brand-400" />
              Top Contributors
            </h2>

            {members.length === 0 ? (
              <div className="card text-center py-12">
                <Users className="w-8 h-8 text-surface-600 mx-auto mb-3" />
                <p className="text-surface-400">No members yet. Be the first to join!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {members.map((member, i) => (
                  <div key={member.id} className="flex items-center gap-4 p-3 rounded-xl bg-surface-900/60 border border-surface-800/50 hover:border-brand-500/20 transition-all duration-300">
                    <span className={`text-sm font-bold w-6 text-center ${
                      i === 0 ? 'text-brand-400' : i === 1 ? 'text-surface-300' : i === 2 ? 'text-amber-600' : 'text-surface-600'
                    }`}>
                      {i + 1}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-surface-300">
                        {member.profile?.display_name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{member.profile?.display_name}</p>
                      <RankBadge rank={member.profile?.rank || 'rookie'} size="sm" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-brand-400">{member.contribution_score}</p>
                      <p className="text-[10px] text-surface-600">points</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-400" />
                Army Stats
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-surface-400">Credibility Rating</span>
                    <span className="text-white font-medium">{army.credibility_rating}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 via-brand-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${army.credibility_rating}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-surface-800/50">
                    <p className="text-lg font-bold text-white">{army.total_score.toLocaleString()}</p>
                    <p className="text-[10px] text-surface-500 uppercase">Total Score</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-800/50">
                    <p className="text-lg font-bold text-white">{army.member_count}</p>
                    <p className="text-[10px] text-surface-500 uppercase">Members</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card glow-brand border-brand-500/20 text-center">
              <TrendingUp className="w-8 h-8 text-brand-400 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-white mb-1">Army Activity</h3>
              <p className="text-xs text-surface-400 mb-2">This army is actively participating in {filmCount} film campaigns</p>
              <div className="w-full h-1.5 rounded-full bg-surface-800 overflow-hidden mt-3">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600" style={{ width: `${Math.min(100, army.credibility_rating + 10)}%` }} />
              </div>
              <p className="text-[10px] text-surface-500 mt-2">Activity index: {Math.min(100, army.credibility_rating + 10)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
