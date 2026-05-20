import { useState } from 'react';
import { Zap, CheckCircle, Clock } from 'lucide-react';
import type { DailyQuestion } from '../types';

export default function DailyQuestionWidget({ question }: { question: DailyQuestion }) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!answer) return;
    setSubmitted(true);
  }

  const options = question.options as { choices?: string[] } | null;

  return (
    <div className="card glow-brand border-brand-500/20">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 shrink-0">
          <Zap className="w-5 h-5 text-brand-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">First Day First Show</span>
            <span className="flex items-center gap-1 text-xs text-surface-500">
              <Clock className="w-3 h-3" />+{question.points_value} pts
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">{question.question_text}</h3>

          {submitted ? (
            <div className="mt-4 flex items-center gap-2 text-emerald-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Answer recorded! Check back tomorrow for results.</span>
            </div>
          ) : (
            <div className="mt-4">
              {question.question_type === 'true_false' ? (
                <div className="flex gap-3">
                  {['True', 'False'].map((opt) => (
                    <button key={opt} onClick={() => setAnswer(opt)}
                      className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all ${answer === opt ? 'border-brand-500 bg-brand-500/10 text-brand-400' : 'border-surface-700/50 bg-surface-800/50 text-surface-300 hover:border-surface-600'}`}
                    >{opt}</button>
                  ))}
                </div>
              ) : question.question_type === 'multiple_choice' && options?.choices ? (
                <div className="grid grid-cols-2 gap-3">
                  {options.choices.map((opt: string) => (
                    <button key={opt} onClick={() => setAnswer(opt)}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${answer === opt ? 'border-brand-500 bg-brand-500/10 text-brand-400' : 'border-surface-700/50 bg-surface-800/50 text-surface-300 hover:border-surface-600'}`}
                    >{opt}</button>
                  ))}
                </div>
              ) : (
                <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Enter your prediction..." className="input-field" />
              )}
              <button onClick={handleSubmit} disabled={!answer} className="btn-primary mt-4 text-sm w-full sm:w-auto disabled:opacity-50">Submit Answer</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
