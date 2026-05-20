import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Army, Film, DailyQuestion, Mission, Profile } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import HeroSection from '../components/home/HeroSection';
import HowItWorks from '../components/home/HowItWorks';
import FilmsShowcase from '../components/home/FilmsShowcase';
import ArmyBattleground from '../components/home/ArmyBattleground';
import MissionsHub from '../components/home/MissionsHub';
import DailyChallenge from '../components/home/DailyChallenge';
import TopFansSection from '../components/home/TopFansSection';
import DashboardPreview from '../components/home/DashboardPreview';
import CtaSection from '../components/home/CtaSection';

type ArmyWithActor = Army & { actor: { name: string; image_url: string | null } };
type TopUser = Pick<Profile, 'id' | 'display_name' | 'rank' | 'total_points' | 'prediction_accuracy' | 'streak_days'>;

export default function HomePage() {
  const [armies, setArmies] = useState<ArmyWithActor[]>([]);
  const [films, setFilms] = useState<Film[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [question, setQuestion] = useState<DailyQuestion | null>(null);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [stats, setStats] = useState({ armies: 0, members: 0, films: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [armiesRes, filmsRes, missionsRes, questionRes, usersRes, filmCountRes] = await Promise.all([
        supabase.from('armies').select('*, actor:actors(name, image_url)').order('total_score', { ascending: false }).limit(6),
        supabase.from('films').select('*').order('release_date').limit(8),
        supabase.from('missions').select('*').eq('is_active', true).order('ends_at').limit(4),
        supabase.from('daily_questions').select('*').eq('is_resolved', false).order('active_date', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('profiles').select('id, display_name, rank, total_points, prediction_accuracy, streak_days').order('total_points', { ascending: false }).limit(9),
        supabase.from('films').select('id', { count: 'exact', head: true }),
      ]);

      if (armiesRes.data) {
        const typed = armiesRes.data as ArmyWithActor[];
        setArmies(typed);
        const totalMembers = typed.reduce((sum, a) => sum + a.member_count, 0);
        setStats({ armies: typed.length, members: totalMembers, films: filmCountRes.count || 0 });
      }
      if (filmsRes.data) setFilms(filmsRes.data);
      if (missionsRes.data) setMissions(missionsRes.data);
      if (questionRes.data) setQuestion(questionRes.data);
      if (usersRes.data) setTopUsers(usersRes.data as TopUser[]);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <HeroSection topArmies={armies} stats={stats} />
      <HowItWorks />
      <FilmsShowcase films={films} />
      <ArmyBattleground armies={armies} />
      <MissionsHub missions={missions} />
      <DailyChallenge question={question} />
      <TopFansSection users={topUsers} />
      <DashboardPreview />
      <CtaSection />
    </div>
  );
}
