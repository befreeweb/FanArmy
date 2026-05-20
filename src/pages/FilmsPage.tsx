import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, TrendingUp, Calendar, Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Film as FilmType } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';

const LANGUAGES = ['All', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 'Bengali'];
const STATUSES = [
  { value: 'all', label: 'All Films' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'released', label: 'Released' },
];

export default function FilmsPage() {
  const [films, setFilms] = useState<FilmType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('All');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    async function load() {
      let query = supabase.from('films').select('*').order('release_date', { ascending: true });
      if (status !== 'all') query = query.eq('status', status);
      if (language !== 'All') query = query.eq('language', language);
      const { data } = await query;
      setFilms(data || []);
      setLoading(false);
    }
    load();
  }, [language, status]);

  const filtered = films.filter((f) =>
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Films</h1>
        <p className="text-surface-400 mt-1">Active campaigns, upcoming releases, and box office tracking</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search films..."
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-field pl-10 pr-8 appearance-none cursor-pointer min-w-[140px]"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-field appearance-none cursor-pointer min-w-[120px]"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Film}
          title="No films found"
          description="No films match your current filters. Try adjusting your search or check back later."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((film) => (
            <Link key={film.id} to={`/films/${film.slug}`} className="card-hover group">
              <div className="aspect-[2/3] rounded-lg bg-surface-800 overflow-hidden mb-4 relative">
                {film.poster_url ? (
                  <img src={film.poster_url} alt={film.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="w-12 h-12 text-surface-600" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-md ${
                    film.status === 'upcoming'
                      ? 'bg-brand-500/90 text-surface-950'
                      : film.status === 'released'
                      ? 'bg-emerald-500/90 text-white'
                      : 'bg-surface-600/90 text-white'
                  }`}>
                    {film.status}
                  </span>
                </div>
              </div>

              <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors truncate">{film.title}</h3>

              <div className="flex items-center gap-2 mt-1.5 text-xs text-surface-500">
                <span>{film.language}</span>
                <span className="w-1 h-1 rounded-full bg-surface-700" />
                <span>{film.genre}</span>
              </div>

              <div className="flex items-center gap-1.5 mt-2 text-xs text-surface-400">
                <Calendar className="w-3 h-3" />
                {new Date(film.release_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>

              {(film.box_office_expected_low || film.box_office_expected_high) && (
                <div className="flex items-center gap-1.5 mt-2">
                  <TrendingUp className="w-3 h-3 text-brand-400" />
                  <span className="text-xs text-brand-400 font-medium">
                    {film.box_office_expected_low}--{film.box_office_expected_high} Cr
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
