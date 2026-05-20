import { Link } from 'react-router-dom';
import { Shield, Zap, TrendingUp, Target } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/30 via-brand-950/10 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-brand-500/8 blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
          Not Just Hype.
          <br />
          <span className="gradient-text">Intelligence.</span>
        </h2>
        <p className="mt-4 text-lg text-surface-400 max-w-lg mx-auto">
          Join thousands of cinema fans turning their knowledge into measurable power.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-sm text-surface-400">
          {[
            { icon: Shield, text: 'Join an Army' },
            { icon: TrendingUp, text: 'Make Predictions' },
            { icon: Target, text: 'Complete Missions' },
            { icon: Zap, text: 'Earn Points' },
          ].map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-900/60 border border-surface-800/50">
              <Icon className="w-3.5 h-3.5 text-brand-400" />{text}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link to="/armies" className="btn-primary text-lg px-8 py-3.5">
            <Shield className="w-5 h-5" />
            Join an Army Now
          </Link>
          <Link to="/films" className="btn-secondary text-lg px-8 py-3.5">
            Start Predicting
          </Link>
        </div>
      </div>
    </section>
  );
}
