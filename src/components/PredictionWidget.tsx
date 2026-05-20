import { useState } from 'react';
import { TrendingUp, CheckCircle } from 'lucide-react';

interface Props {
  filmId: string;
  filmTitle: string;
}

export default function PredictionWidget({ filmTitle }: Props) {
  const [openingWeekend, setOpeningWeekend] = useState('');
  const [lifetime, setLifetime] = useState('');
  const [saved, setSaved] = useState(false);

  function handleSubmit() {
    if (!openingWeekend && !lifetime) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-2 text-brand-400">
        <TrendingUp className="w-4 h-4" />
        <span className="text-sm font-semibold">{filmTitle}</span>
      </div>
      <div>
        <label className="block text-xs font-medium text-surface-400 mb-1.5">Opening Weekend (Cr)</label>
        <input type="number" value={openingWeekend} onChange={(e) => setOpeningWeekend(e.target.value)} placeholder="e.g. 45" className="input-field" min="0" step="0.5" />
      </div>
      <div>
        <label className="block text-xs font-medium text-surface-400 mb-1.5">Lifetime Collection (Cr)</label>
        <input type="number" value={lifetime} onChange={(e) => setLifetime(e.target.value)} placeholder="e.g. 200" className="input-field" min="0" step="0.5" />
      </div>
      {saved ? (
        <div className="flex items-center gap-2 text-emerald-400 text-sm"><CheckCircle className="w-4 h-4" />Prediction saved!</div>
      ) : (
        <button onClick={handleSubmit} disabled={!openingWeekend && !lifetime} className="btn-primary w-full text-sm disabled:opacity-50">Submit Prediction</button>
      )}
      <p className="text-[10px] text-surface-600 text-center">Your prediction will be scored after release</p>
    </div>
  );
}
