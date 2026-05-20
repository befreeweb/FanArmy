import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, TrendingUp, Users, Target, Shield, Play, BarChart3, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Film, Mission, FilmCampaign } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PredictionWidget from '../components/PredictionWidget';
import MissionCard from '../components/MissionCard';

interface CastEntry {
  id: string;
  role_name: string | null;
  actor: { id: string; name: string; slug: string; image_url: string | null };
}

export default function FilmDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [film, setFilm] = useState<Film | null>(null);
  const [cast, setCast] = useState<CastEntry[]>([]);
  const [campaign, setCampaign] = useState<FilmCampaign | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [predictionCount, setPredictionCount] = useState(0);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      const { data: filmData } = await supabase
        .from('films')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!filmData) { setLoading(false); return; }
      setFilm(filmData);

      const [castRes, campaignRes, predCountRes] = await Promise.all([
        supabase.from('film_cast').select('id, role_name, actor:actors(id, name, slug, image_url)').eq('film_id', filmData.id),
        supabase.from('film_campaigns').select('*').eq('film_id', filmData.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('predictions').select('id', { count: 'exact', head: true }).eq('film_id', filmData.id),
      ]);

      if (castRes.data) setCast(castRes.data as unknown as CastEntry[]);
      if (campaignRes.data) {
        setCampaign(campaignRes.data);
        const { data: missionData } = await supabase
          .from('missions')
          .select('*')
          .eq('campaign_id', campaignRes.data.id)
          .eq('is_active', true)
          .order('ends_at');
        if (missionData) setMissions(missionData);
      }
      setPredictionCount(predCountRes.count || 0);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!film) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-surface-400">Film not found.</div>;

  const daysUntilRelease = Math.ceil((new Date(film.release_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const phaseLabel = campaign?.phase === 'pre_release' ? 'Pre-Release' : campaign?.phase === 'release_week' ? 'Release Week' : campaign?.phase === 'post_release' ? 'Post-Release' : null;

  return (
    <div>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-950/60 via-surface-950/90 to-surface-950" />
        {film.poster_url && (
          <div className="absolute inset-0 opacity-10">
            <img src={film.poster_url} alt="" className="w-full h-full object-cover blur-2xl" />
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="shrink-0">
              <div className="w-48 md:w-56 aspect-[2/3] rounded-xl bg-surface-800 overflow-hidden shadow-2xl">
                {film.poster_url ? (
                  <img src={film.poster_url} alt={film.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="w-12 h-12 text-surface-600" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-semibold uppercase px-2.5 py-1 rounded-md ${
                  film.status === 'upcoming'
                    ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                    : film.status === 'released'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-surface-700 text-surface-400'
                }`}>
                  {film.status}
                </span>
                {phaseLabel && (
                  <span className="text-xs font-medium text-surface-400 px-2.5 py-1 rounded-md bg-surface-800 border border-surface-700">
                    {phaseLabel}
                  </span>
                )}
                {campaign?.is_sponsored && (
                  <span className="text-xs font-medium text-brand-400 px-2.5 py-1 rounded-md bg-brand-500/10 border border-brand-500/20">
                    Sponsored
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-white">{film.title}</h1>

              <div className="flex items-center gap-3 mt-3 text-sm text-surface-400">
                <span>{film.language}</span>
                <span className="w-1 h-1 rounded-full bg-surface-600" />
                <span>{film.genre}</span>
                <span className="w-1 h-1 rounded-full bg-surface-600" />
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(film.release_date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              {film.synopsis && (
                <p className="mt-4 text-surface-300 leading-relaxed max-w-2xl">{film.synopsis}</p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                {film.status === 'upcoming' && daysUntilRelease > 0 && (
                  <div className="text-center p-3 rounded-lg bg-surface-800/50 border border-surface-700/50">
                    <p className="text-2xl font-bold text-brand-400">{daysUntilRelease}</p>
                    <p className="text-[10px] text-surface-500 uppercase tracking-wider mt-0.5">Days to Release</p>
                  </div>
                )}
                {(film.box_office_expected_low || film.box_office_expected_high) && (
                  <div className="text-center p-3 rounded-lg bg-surface-800/50 border border-surface-700/50">
                    <p className="text-2xl font-bold text-white">{film.box_office_expected_low}--{film.box_office_expected_high}</p>
                    <p className="text-[10px] text-surface-500 uppercase tracking-wider mt-0.5">Expected (Cr)</p>
                  </div>
                )}
                {film.box_office_actual && (
                  <div className="text-center p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-2xl font-bold text-emerald-400">{film.box_office_actual}</p>
                    <p className="text-[10px] text-surface-500 uppercase tracking-wider mt-0.5">Actual (Cr)</p>
                  </div>
                )}
                <div className="text-center p-3 rounded-lg bg-surface-800/50 border border-surface-700/50">
                  <p className="text-2xl font-bold text-white">{predictionCount}</p>
                  <p className="text-[10px] text-surface-500 uppercase tracking-wider mt-0.5">Predictions</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-surface-800/50 border border-surface-700/50">
                  <p className="text-2xl font-bold text-white">{missions.length}</p>
                  <p className="text-[10px] text-surface-500 uppercase tracking-wider mt-0.5">Active Missions</p>
                </div>
              </div>

              {film.trailer_url && (
                <a
                  href={film.trailer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary mt-6 inline-flex"
                >
                  <Play className="w-4 h-4" />
                  Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {cast.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-400" />
                  Cast & Armies
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cast.map((c) => (
                    <Link key={c.id} to={`/armies/${c.actor.slug}`} className="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50 border border-surface-700/50 hover:border-surface-600 transition-colors group">
                      <div className="w-10 h-10 rounded-full bg-surface-700 overflow-hidden shrink-0">
                        {c.actor.image_url ? (
                          <img src={c.actor.image_url} alt={c.actor.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Shield className="w-4 h-4 text-surface-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white group-hover:text-brand-400 transition-colors truncate">{c.actor.name}</p>
                        {c.role_name && <p className="text-xs text-surface-500 truncate">{c.role_name}</p>}
                      </div>
                      <ChevronRight className="w-4 h-4 text-surface-600 group-hover:text-surface-400 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {missions.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-brand-400" />
                  Active Missions
                </h2>
                <div className="space-y-3">
                  {missions.map((mission) => (
                    <MissionCard key={mission.id} mission={mission} />
                  ))}
                </div>
              </div>
            )}

            {film.box_office_actual && predictionCount > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-400" />
                  Prediction vs Reality
                </h2>
                <div className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-surface-400">Fan Consensus Range</p>
                      <p className="text-lg font-bold text-white mt-1">
                        {film.box_office_expected_low}--{film.box_office_expected_high} Cr
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-surface-400">Actual Result</p>
                      <p className="text-lg font-bold text-emerald-400 mt-1">{film.box_office_actual} Cr</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-400" />
                Make Your Prediction
              </h2>
              <PredictionWidget filmId={film.id} filmTitle={film.title} />
            </div>

            {film.budget_range && (
              <div className="card">
                <h3 className="text-sm font-semibold text-surface-300 mb-2">Budget</h3>
                <p className="text-lg font-bold text-white">{film.budget_range}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
