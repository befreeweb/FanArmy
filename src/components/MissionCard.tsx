import { useState } from 'react';
import { Target, Clock, Users, Zap, Brain, TrendingUp, Share2, Star, CheckCircle } from 'lucide-react';
import type { Mission } from '../types';

const TYPE_CONFIG: Record<string, { icon: typeof Target; label: string; color: string }> = {
  trailer_intelligence: { icon: Brain, label: 'Trailer Intelligence', color: 'text-blue-400' },
  momentum_watch: { icon: TrendingUp, label: 'Momentum Watch', color: 'text-emerald-400' },
  buzz_poll: { icon: Zap, label: 'Buzz Poll', color: 'text-brand-400' },
  activation: { icon: Share2, label: 'Activation', color: 'text-cyan-400' },
  directors_cut: { icon: Star, label: "Director's Cut", color: 'text-red-400' },
  custom: { icon: Target, label: 'Mission', color: 'text-surface-300' },
};

export default function MissionCard({ mission }: { mission: Mission }) {
  const [expanded, setExpanded] = useState(false);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const config = TYPE_CONFIG[mission.mission_type] || TYPE_CONFIG.custom;
  const Icon = config.icon;
  const timeLeft = Math.max(0, Math.ceil((new Date(mission.ends_at).getTime() - Date.now()) / (1000 * 60 * 60)));

  function handleSubmit() {
    if (!answer) return;
    setSubmitted(true);
  }

  return (
    <div className="card-hover">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-surface-800 to-surface-800/50 shrink-0">
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>{config.label}</span>
            {mission.mission_type === 'directors_cut' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-lg bg-red-500/10 text-red-400 font-bold">5x PTS</span>
            )}
          </div>
          <h3 className="font-semibold text-white">{mission.title}</h3>
          <p className="text-sm text-surface-400 mt-1">{mission.description}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-surface-500">
            <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-brand-400" />{mission.points_value} pts</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeLeft}h left</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{mission.participation_count.toLocaleString()}</span>
          </div>
        </div>
        {!submitted && (
          <button onClick={() => setExpanded(!expanded)} className="btn-ghost text-xs shrink-0">{expanded ? 'Close' : 'Participate'}</button>
        )}
        {submitted && (
          <span className="flex items-center gap-1 text-emerald-400 text-xs shrink-0"><CheckCircle className="w-4 h-4" />Done</span>
        )}
      </div>
      {expanded && !submitted && (
        <div className="mt-4 pt-4 border-t border-surface-800/50">
          <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Enter your response..." rows={3} className="input-field resize-none" />
          <button onClick={handleSubmit} disabled={!answer} className="btn-primary text-sm mt-3 disabled:opacity-50">Submit</button>
        </div>
      )}
    </div>
  );
}
