import { useEffect, useState } from 'react';
import { Target, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Mission } from '../types';
import MissionCard from '../components/MissionCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';

const TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'trailer_intelligence', label: 'Trailer Intelligence' },
  { value: 'momentum_watch', label: 'Momentum Watch' },
  { value: 'buzz_poll', label: 'Buzz Poll' },
  { value: 'activation', label: 'Activation' },
  { value: 'directors_cut', label: "Director's Cut" },
];

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    async function load() {
      let query = supabase
        .from('missions')
        .select('*')
        .eq('is_active', true)
        .gte('ends_at', new Date().toISOString())
        .order('ends_at');

      if (typeFilter !== 'all') query = query.eq('mission_type', typeFilter);
      const { data } = await query;
      setMissions(data || []);
      setLoading(false);
    }
    load();
  }, [typeFilter]);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Target className="w-8 h-8 text-brand-400" />
          Missions
        </h1>
        <p className="text-surface-400 mt-1">Active missions across all campaigns. Participate to earn points.</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-4 h-4 text-surface-500" />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="input-field appearance-none cursor-pointer max-w-[200px]"
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {missions.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No active missions"
          description="Check back soon -- new missions launch with every film campaign."
        />
      ) : (
        <div className="space-y-4">
          {missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      )}
    </div>
  );
}
