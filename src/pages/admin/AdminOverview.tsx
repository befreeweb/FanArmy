import { useEffect, useState } from 'react';
import { Film, Shield, Users, Target, Zap, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import StatCard from '../../components/ui/StatCard';

export default function AdminOverview() {
  const [stats, setStats] = useState({ films: 0, actors: 0, armies: 0, users: 0, missions: 0, predictions: 0 });

  useEffect(() => {
    async function load() {
      const [films, actors, armies, users, missions, predictions] = await Promise.all([
        supabase.from('films').select('id', { count: 'exact', head: true }),
        supabase.from('actors').select('id', { count: 'exact', head: true }),
        supabase.from('armies').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('missions').select('id', { count: 'exact', head: true }),
        supabase.from('predictions').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        films: films.count || 0,
        actors: actors.count || 0,
        armies: armies.count || 0,
        users: users.count || 0,
        missions: missions.count || 0,
        predictions: predictions.count || 0,
      });
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Admin Overview</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Film} label="Films" value={stats.films} color="brand" />
        <StatCard icon={Shield} label="Armies" value={stats.armies} color="blue" />
        <StatCard icon={Users} label="Users" value={stats.users} color="emerald" />
        <StatCard icon={Target} label="Missions" value={stats.missions} color="red" />
        <StatCard icon={TrendingUp} label="Predictions" value={stats.predictions} color="brand" />
        <StatCard icon={Zap} label="Actors" value={stats.actors} color="blue" />
      </div>
    </div>
  );
}
