import { useEffect, useState } from 'react';
import { Shield, Plus, X, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Actor } from '../../types';

const EMPTY = { name: '', slug: '', image_url: '', bio: '', language: 'Hindi', debut_year: '' };

export default function AdminActors() {
  const [actors, setActors] = useState<Actor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from('actors').select('*').order('name');
    if (data) setActors(data);
  }

  useEffect(() => { load(); }, []);

  function handleEdit(actor: Actor) {
    setForm({
      name: actor.name, slug: actor.slug, image_url: actor.image_url || '',
      bio: actor.bio || '', language: actor.language, debut_year: actor.debut_year?.toString() || '',
    });
    setEditingId(actor.id);
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const payload = {
      name: form.name,
      slug,
      image_url: form.image_url || null,
      bio: form.bio || null,
      language: form.language,
      debut_year: form.debut_year ? parseInt(form.debut_year) : null,
    };

    if (editingId) {
      await supabase.from('actors').update(payload).eq('id', editingId);
    } else {
      const { data: actorData } = await supabase.from('actors').insert(payload).select().maybeSingle();
      if (actorData) {
        await supabase.from('armies').insert({
          actor_id: actorData.id,
          name: `${form.name} Army`,
          slug: `${slug}-army`,
        });
      }
    }

    setShowForm(false);
    setForm(EMPTY);
    setEditingId(null);
    setSaving(false);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Actors & Armies</h1>
        <button onClick={() => { setForm(EMPTY); setEditingId(null); setShowForm(true); }} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Actor
        </button>
      </div>

      {showForm && (
        <div className="card mb-8 animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">{editingId ? 'Edit Actor' : 'New Actor'}</h2>
            <button onClick={() => setShowForm(false)} className="text-surface-500 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-field" placeholder="auto-generated" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Language</label>
              <input value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Debut Year</label>
              <input type="number" value={form.debut_year} onChange={(e) => setForm({ ...form, debut_year: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Image URL</label>
              <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input-field resize-none" rows={2} />
            </div>
          </div>
          <p className="text-xs text-surface-500 mt-3">An army will be automatically created for new actors.</p>
          <button onClick={handleSave} disabled={!form.name || saving} className="btn-primary text-sm mt-4 disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Actor'}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {actors.map((actor) => (
          <div key={actor.id} className="flex items-center gap-4 p-4 rounded-lg bg-surface-900 border border-surface-800 hover:border-surface-700 transition-colors">
            <div className="w-10 h-10 rounded-full bg-surface-700 overflow-hidden shrink-0">
              {actor.image_url ? (
                <img src={actor.image_url} alt={actor.name} className="w-full h-full object-cover" />
              ) : (
                <Shield className="w-full h-full p-2 text-surface-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{actor.name}</p>
              <p className="text-xs text-surface-500">{actor.language} {actor.debut_year ? `-- Since ${actor.debut_year}` : ''}</p>
            </div>
            <button onClick={() => handleEdit(actor)} className="btn-ghost text-xs">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}
