import { useEffect, useState } from 'react';
import { Zap, Plus, X, Save, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { DailyQuestion } from '../../types';

export default function AdminDaily() {
  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    question_text: '',
    question_type: 'true_false',
    options: '',
    correct_answer: '',
    points_value: '5',
    active_date: new Date().toISOString().split('T')[0],
  });
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from('daily_questions').select('*').order('active_date', { ascending: false }).limit(30);
    if (data) setQuestions(data);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    setSaving(true);
    const options = form.options
      ? { choices: form.options.split(',').map((s) => s.trim()).filter(Boolean) }
      : null;

    await supabase.from('daily_questions').insert({
      question_text: form.question_text,
      question_type: form.question_type,
      options,
      correct_answer: form.correct_answer || null,
      points_value: parseInt(form.points_value),
      active_date: form.active_date,
    });

    setShowForm(false);
    setForm({ question_text: '', question_type: 'true_false', options: '', correct_answer: '', points_value: '5', active_date: new Date().toISOString().split('T')[0] });
    setSaving(false);
    load();
  }

  async function resolveQuestion(id: string, correctAnswer: string) {
    await supabase.from('daily_questions').update({ is_resolved: true, correct_answer: correctAnswer }).eq('id', id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Daily Questions</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> New Question
        </button>
      </div>

      {showForm && (
        <div className="card mb-8 animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">New Daily Question</h2>
            <button onClick={() => setShowForm(false)} className="text-surface-500 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-surface-400 mb-1">Question</label>
              <textarea value={form.question_text} onChange={(e) => setForm({ ...form, question_text: e.target.value })} className="input-field resize-none" rows={2} />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Type</label>
              <select value={form.question_type} onChange={(e) => setForm({ ...form, question_type: e.target.value })} className="input-field">
                <option value="true_false">True/False</option>
                <option value="over_under">Over/Under</option>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="prediction">Prediction</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Active Date</label>
              <input type="date" value={form.active_date} onChange={(e) => setForm({ ...form, active_date: e.target.value })} className="input-field" />
            </div>
            {form.question_type === 'multiple_choice' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-surface-400 mb-1">Options (comma-separated)</label>
                <input value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} className="input-field" placeholder="Option A, Option B, Option C" />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Correct Answer</label>
              <input value={form.correct_answer} onChange={(e) => setForm({ ...form, correct_answer: e.target.value })} className="input-field" placeholder="Can be set later" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1">Points</label>
              <input type="number" value={form.points_value} onChange={(e) => setForm({ ...form, points_value: e.target.value })} className="input-field" />
            </div>
          </div>
          <button onClick={handleSave} disabled={!form.question_text || saving} className="btn-primary text-sm mt-4 disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Publish Question'}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {questions.map((q) => (
          <div key={q.id} className="flex items-start gap-4 p-4 rounded-lg bg-surface-900 border border-surface-800">
            <div className={`p-2 rounded-lg shrink-0 ${q.is_resolved ? 'bg-emerald-500/10' : 'bg-brand-500/10'}`}>
              {q.is_resolved ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Zap className="w-4 h-4 text-brand-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{q.question_text}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-surface-500">
                <span>{q.active_date}</span>
                <span>{q.question_type.replace('_', '/')}</span>
                <span>{q.points_value} pts</span>
                {q.correct_answer && <span className="text-emerald-400">Answer: {q.correct_answer}</span>}
              </div>
            </div>
            {!q.is_resolved && (
              <button
                onClick={() => {
                  const answer = prompt('Enter correct answer:');
                  if (answer) resolveQuestion(q.id, answer);
                }}
                className="btn-ghost text-xs shrink-0"
              >
                Resolve
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
