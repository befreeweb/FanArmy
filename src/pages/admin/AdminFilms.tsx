import { useEffect, useState } from 'react';
import { Film, Plus, X, Save, Calendar, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Film as FilmType } from '../../types';

const EMPTY_FILM = {
  title: '', slug: '', poster_url: '', synopsis: '', release_date: '',
  genre: '', language: 'Hindi', budget_range: '', trailer_url: '',
  box_office_expected_low: '', box_office_expected_high: '', box_office_actual: '',
  status: 'upcoming' as FilmType['status'],
};

export default function AdminFilms() {
  const [films, setFilms] = useState<FilmType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FILM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from('films').select('*').order('release_date', { ascending: false });
    if (data) setFilms(data);
  }

  useEffect(() => { load(); }, []);

  function handleEdit(film: FilmType) {
    setForm({
      title: film.title, slug: film.slug, poster_url: film.poster_url || '',
      synopsis: film.synopsis || '', release_date: film.release_date, genre: film.genre,
      language: film.language, budget_range: film.budget_range || '',
      trailer_url: film.trailer_url || '', status: film.status,
      box_office_expected_low: film.box_office_expected_low?.toString() || '',
      box_office_expected_high: film.box_office_expected_high?.toString() || '',
      box_office_actual: film.box_office_actual?.toString() || '',
    });
    setEditingId(film.id);
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      poster_url: form.poster_url || null,
      synopsis: form.synopsis || null,
      release_date: form.release_date,
      genre: form.genre,
      language: form.language,
      budget_range: form.budget_range || null,
      trailer_url: form.trailer_url || null,
      status: form.status,
      box_office_expected_low: form.box_office_expected_low ? parseFloat(form.box_office_expected_low) : null,
      box_office_expected_high: form.box_office_expected_high ? parseFloat(form.box_office_expected_high) : null,
      box_office_actual: form.box_office_actual ? parseFloat(form.box_office_actual) : null,
    };

    if (editingId) {
      await supabase.from('films').update(payload).eq('id', editingId);
    } else {
      await supabase.from('films').insert(payload);
    }

    setShowForm(false);
    setForm(EMPTY_FILM);
    setEditingId(null);
    setSaving(false);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Films</h1>
        <button onClick={() => { setForm(EMPTY_FILM); setEditingId(null); setShowForm(true); }} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Film
        </button>
      </div>

      {showForm && (
        <div className="card mb-8 animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">{editingId ? 'Edit Film' : 'New Film'}</h2>
            <button onClick={() => setShowForm(false)} className="text-surface-500 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-field" placeholder="auto-generated from title" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Release Date</label>
              <input type="date" value={form.release_date} onChange={(e) => setForm({ ...form, release_date: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as FilmType['status'] })} className="input-field">
                <option value="upcoming">Upcoming</option>
                <option value="released">Released</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Language</label>
              <input value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Genre</label>
              <input value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Poster URL</label>
              <input value={form.poster_url} onChange={(e) => setForm({ ...form, poster_url: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Trailer URL</label>
              <input value={form.trailer_url} onChange={(e) => setForm({ ...form, trailer_url: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Budget Range</label>
              <input value={form.budget_range} onChange={(e) => setForm({ ...form, budget_range: e.target.value })} className="input-field" placeholder="e.g. 100-150 Cr" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Expected Low (Cr)</label>
              <input type="number" value={form.box_office_expected_low} onChange={(e) => setForm({ ...form, box_office_expected_low: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Expected High (Cr)</label>
              <input type="number" value={form.box_office_expected_high} onChange={(e) => setForm({ ...form, box_office_expected_high: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Actual Box Office (Cr)</label>
              <input type="number" value={form.box_office_actual} onChange={(e) => setForm({ ...form, box_office_actual: e.target.value })} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-surface-400 mb-1">Synopsis</label>
              <textarea value={form.synopsis} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} className="input-field resize-none" rows={3} />
            </div>
          </div>
          <button onClick={handleSave} disabled={!form.title || !form.release_date || saving} className="btn-primary text-sm mt-4 disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Film'}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {films.map((film) => (
          <div key={film.id} className="flex items-center gap-4 p-4 rounded-lg bg-surface-900 border border-surface-800 hover:border-surface-700 transition-colors">
            <div className="w-10 h-14 rounded bg-surface-800 overflow-hidden shrink-0">
              {film.poster_url ? (
                <img src={film.poster_url} alt={film.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><Film className="w-4 h-4 text-surface-600" /></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{film.title}</p>
              <div className="flex items-center gap-2 text-xs text-surface-500 mt-0.5">
                <span>{film.language}</span>
                <span className="w-1 h-1 rounded-full bg-surface-700" />
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{film.release_date}</span>
                {film.box_office_actual && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-surface-700" />
                    <span className="flex items-center gap-1 text-emerald-400"><TrendingUp className="w-3 h-3" />{film.box_office_actual} Cr</span>
                  </>
                )}
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              film.status === 'upcoming' ? 'bg-brand-500/10 text-brand-400' : film.status === 'released' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-surface-700 text-surface-400'
            }`}>
              {film.status}
            </span>
            <button onClick={() => handleEdit(film)} className="btn-ghost text-xs">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}
