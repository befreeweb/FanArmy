import { Zap } from 'lucide-react';
import type { DailyQuestion } from '../../types';
import DailyQuestionWidget from '../DailyQuestionWidget';

interface Props {
  question: DailyQuestion | null;
}

export default function DailyChallenge({ question }: Props) {
  if (!question) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-950/20 via-transparent to-brand-950/20 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5" />
            Daily Challenge
          </div>
          <h2 className="text-3xl font-bold text-white">First Day First Show</h2>
          <p className="text-surface-400 mt-1">One question a day. Build your streak. Prove your instincts.</p>
        </div>

        <DailyQuestionWidget question={question} />
      </div>
    </section>
  );
}
