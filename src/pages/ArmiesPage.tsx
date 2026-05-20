import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, TrendingUp, Search, Trophy } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Army } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';

export default function ArmiesPage() {
  const [armies, setArmies] = useState<(Army & { actor: { name: string; image_url: string | null } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('armies')
        .select('*, actor:actors(name, image_url)')
        .order('total_score', { ascending: false });
      if (data) setArmies(data as typeof armies);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = armies.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.actor as { name: string })?.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Armies</h1>
        <p className="text-surface-400 mt-1">Fan armies ranked by score, accuracy, and credibility</p>
      </div>

      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search armies..."
          className="input-field pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="No armies yet"
          description="Armies will appear here as actors are added to the platform."
        />
      ) : (
        <div className="space-y-3">
          <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-surface-500 uppercase tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Army</div>
            <div className="col-span-2 text-center">Members</div>
            <div className="col-span-2 text-center">Score</div>
            <div className="col-span-2 text-center">Credibility</div>
            <div className="col-span-1"></div>
          </div>

          {filtered.map((army, index) => (
            <Link
              key={army.id}
              to={`/armies/${army.slug}`}
              className="card-hover group grid grid-cols-12 gap-4 items-center !p-4"
            >
              <div className="col-span-1">
                <span className={`text-lg font-bold ${
                  index === 0 ? 'text-brand-400' : index === 1 ? 'text-surface-300' : index === 2 ? 'text-amber-600' : 'text-surface-500'
                }`}>
                  #{index + 1}
                </span>
              </div>

              <div className="col-span-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-700 overflow-hidden shrink-0">
                  {army.actor?.image_url ? (
                    <img src={army.actor.image_url} alt={army.actor.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-surface-500" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white group-hover:text-brand-400 transition-colors truncate">{army.name}</p>
                  <p className="text-xs text-surface-500 truncate">{army.actor?.name}</p>
                </div>
                {index === 0 && <Trophy className="w-4 h-4 text-brand-400 shrink-0" />}
              </div>

              <div className="col-span-2 text-center">
                <span className="flex items-center justify-center gap-1 text-sm text-surface-300">
                  <Users className="w-3.5 h-3.5 text-surface-500" />
                  {army.member_count.toLocaleString()}
                </span>
              </div>

              <div className="col-span-2 text-center">
                <span className="text-sm font-bold text-brand-400">{army.total_score.toLocaleString()}</span>
              </div>

              <div className="col-span-2 text-center">
                <div className="inline-flex items-center gap-1.5">
                  <div className="w-16 h-1.5 rounded-full bg-surface-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 via-brand-500 to-emerald-500"
                      style={{ width: `${army.credibility_rating}%` }}
                    />
                  </div>
                  <span className="text-xs text-surface-400">{army.credibility_rating}%</span>
                </div>
              </div>

              <div className="col-span-1 text-right">
                <TrendingUp className="w-4 h-4 text-surface-600 group-hover:text-brand-400 transition-colors inline-block" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
