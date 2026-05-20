import { useEffect, useState } from 'react';
import { Target, Plus, X, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Mission, FilmCampaign, Film } from '../../types';

const TYPES = ['trailer_intelligence', 'momentum_watch', 'buzz_poll', 'activation', 'directors_cut', 'custom'];

export default function AdminMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [campaigns, setCampaigns] = useState<(FilmCampaign & { film: Film })[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', mission_type: 'custom', campaign_id: '', points_value: '10', ends_at: '' });
  const [saving, setSaving] = useState(false);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [campaignForm, setCampaignForm] = useState({ film_id: '', start_date: '', end_date: '' });
  const [films, setFilms] = useState<Film[]>([]);

  async function load() {
    const [mRes, cRes, fRes] = await Promise.all([
      supabase.from('missions').select('*').order('created_at', { ascending: false }),
      supabase.from('film_campaigns').select('*, film:films(*)').order('created_at', { ascending: false }),
      supabase.from('films').select('*').order('title'),
    ]);
    if (mRes.data) setMissions(mRes.data);
    if (cRes.data) setCampaigns(cRes.data as typeof campaigns);
    if (fRes.data) setFilms(fRes.data);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    setSaving(true);
    await supabase.from('missions').insert({
      title: form.title,
      description: form.description,
      mission_type: form.mission_type,
      campaign_id: form.campaign_id,
      points_value: parseInt(form.points_value),
      ends_at: new Date(form.ends_at).toISOString(),
    });
    setShowForm(false);
    setForm({ title: '', description: '', mission_type: 'custom', campaign_id: '', points_value: '10', ends_at: '' });
    setSaving(false);
    load();
  }

  async function handleCreateCampaign() {
    setSaving(true);
    await supabase.from('film_campaigns').insert({
      film_id: campaignForm.film_id,
      start_date: campaignForm.start_date,
      end_date: campaignForm.end_date,
    });
    setShowCampaignForm(false);
    setCampaignForm({ film_id: '', start_date: '', end_date: '' });
    setSaving(false);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Missions & Campaigns</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowCampaignForm(true)} className="btn-secondary text-sm">
            <Plus className="w-4 h-4" /> Campaign
          </button>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm">
            <Plus className="w-4 h-4" /> Mission
          </button>
        </div>
      </div>

      {showCampaignForm && (
        <div className="card mb-6 animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">New Campaign</h2>
            <button onClick={() => setShowCampaignForm(false)} className="text-surface-500 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Film</label>
              <select value={campaignForm.film_id} onChange={(e) => setCampaignForm({ ...campaignForm, film_id: e.target.value })} className="input-field">
                <option value="">Select film...</option>
                {films.map((f) => <option key={f.id} value={f.id}>{f.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Start Date</label>
              <input type="date" value={campaignForm.start_date} onChange={(e) => setCampaignForm({ ...campaignForm, start_date: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">End Date</label>
              <input type="date" value={campaignForm.end_date} onChange={(e) => setCampaignForm({ ...campaignForm, end_date: e.target.value })} className="input-field" />
            </div>
          </div>
          <button onClick={handleCreateCampaign} disabled={!campaignForm.film_id || !campaignForm.start_date || !campaignForm.end_date || saving} className="btn-primary text-sm mt-4 disabled:opacity-50">
            <Save className="w-4 h-4" /> Create Campaign
          </button>
        </div>
      )}

      {showForm && (
        <div className="card mb-6 animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">New Mission</h2>
            <button onClick={() => setShowForm(false)} className="text-surface-500 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Campaign</label>
              <select value={form.campaign_id} onChange={(e) => setForm({ ...form, campaign_id: e.target.value })} className="input-field">
                <option value="">Select campaign...</option>
                {campaigns.map((c) => <option key={c.id} value={c.id}>{c.film?.title} ({c.phase})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Type</label>
              <select value={form.mission_type} onChange={(e) => setForm({ ...form, mission_type: e.target.value })} className="input-field">
                {TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Points</label>
              <input type="number" value={form.points_value} onChange={(e) => setForm({ ...form, points_value: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Ends At</label>
              <input type="datetime-local" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-surface-400 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={3} />
            </div>
          </div>
          <button onClick={handleSave} disabled={!form.title || !form.campaign_id || !form.ends_at || saving} className="btn-primary text-sm mt-4 disabled:opacity-50">
            <Save className="w-4 h-4" /> Create Mission
          </button>
        </div>
      )}

      <h2 className="text-lg font-semibold text-white mb-3 mt-8">Active Campaigns</h2>
      <div className="space-y-2 mb-8">
        {campaigns.map((c) => (
          <div key={c.id} className="flex items-center gap-4 p-3 rounded-lg bg-surface-900 border border-surface-800">
            <Target className="w-4 h-4 text-brand-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{c.film?.title}</p>
              <p className="text-xs text-surface-500">{c.start_date} to {c.end_date} -- {c.phase}</p>
            </div>
          </div>
        ))}
        {campaigns.length === 0 && <p className="text-sm text-surface-500">No campaigns yet.</p>}
      </div>

      <h2 className="text-lg font-semibold text-white mb-3">All Missions</h2>
      <div className="space-y-2">
        {missions.map((m) => (
          <div key={m.id} className="flex items-center gap-4 p-3 rounded-lg bg-surface-900 border border-surface-800">
            <Target className="w-4 h-4 text-surface-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{m.title}</p>
              <p className="text-xs text-surface-500">{m.mission_type.replace(/_/g, ' ')} -- {m.points_value} pts -- {m.participation_count} participants</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${m.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-surface-700 text-surface-400'}`}>
              {m.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
