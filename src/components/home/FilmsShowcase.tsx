import { Link } from 'react-router-dom';
import { Calendar, Play, TrendingUp, ChevronRight, Film } from 'lucide-react';
import type { Film as FilmType } from '../../types';

interface Props {
  films: FilmType[];
}

export default function FilmsShowcase({ films }: Props) {
  if (films.length === 0) return null;

  const featured = films[0];
  const rest = films.slice(1);

  return (
    <section className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Film className="w-3.5 h-3.5" />
              Now Tracking
            </div>
            <h2 className="text-3xl font-bold text-white">Films & Predictions</h2>
            <p className="text-surface-400 mt-1">Make your box office predictions and earn points</p>
          </div>
          <Link to="/films" className="hidden sm:flex btn-ghost text-sm">
            All Films <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Link to={`/films/${featured.slug}`} className="lg:col-span-2 group relative rounded-2xl overflow-hidden bg-surface-900/60 border border-surface-800/50 hover:border-brand-500/30 transition-all duration-300">
            <div className="aspect-[3/4] relative">
              {featured.poster_url ? (
                <img src={featured.poster_url} alt={featured.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-surface-800 flex items-center justify-center">
                  <Play className="w-16 h-16 text-surface-600" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-brand-500/20 text-brand-400 border border-brand-500/30 mb-3">
                  {featured.status}
                </span>
                <h3 className="text-2xl font-bold text-white group-hover:text-brand-300 transition-colors">{featured.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-sm text-surface-400">
                  <span>{featured.language}</span>
                  <span className="w-1 h-1 rounded-full bg-surface-600" />
                  <span>{featured.genre}</span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm text-surface-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(featured.release_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                {(featured.box_office_expected_low || featured.box_office_expected_high) && (
                  <div className="flex items-center gap-1.5 mt-3 text-brand-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-bold">{featured.box_office_expected_low}-{featured.box_office_expected_high} Cr expected</span>
                  </div>
                )}
              </div>
            </div>
          </Link>

          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {rest.map((film) => (
              <Link
                key={film.id}
                to={`/films/${film.slug}`}
                className="group rounded-2xl overflow-hidden bg-surface-900/60 border border-surface-800/50 hover:border-brand-500/20 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300"
              >
                <div className="aspect-[2/3] relative">
                  {film.poster_url ? (
                    <img src={film.poster_url} alt={film.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-surface-800 flex items-center justify-center">
                      <Play className="w-8 h-8 text-surface-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/20 to-transparent" />
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      film.status === 'upcoming' ? 'bg-brand-500/20 text-brand-400' : film.status === 'released' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-surface-700 text-surface-400'
                    }`}>
                      {film.status}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors truncate">{film.title}</h3>
                    <p className="text-[10px] text-surface-400 mt-0.5">{film.language} &middot; {new Date(film.release_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                    {(film.box_office_expected_low || film.box_office_expected_high) && (
                      <p className="text-[10px] text-brand-400 font-semibold mt-1">{film.box_office_expected_low}-{film.box_office_expected_high} Cr</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="sm:hidden text-center mt-6">
          <Link to="/films" className="btn-ghost text-sm">
            View All Films <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
