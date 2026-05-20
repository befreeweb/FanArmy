import { Link } from 'react-router-dom';
import { Target, ChevronRight } from 'lucide-react';
import type { Mission } from '../../types';
import MissionCard from '../MissionCard';

interface Props {
  missions: Mission[];
}

export default function MissionsHub({ missions }: Props) {
  if (missions.length === 0) return null;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Target className="w-3.5 h-3.5" />
              Active Missions
            </div>
            <h2 className="text-3xl font-bold text-white">Earn Points Now</h2>
            <p className="text-surface-400 mt-1">Complete missions to power up your army and climb the ranks</p>
          </div>
          <Link to="/missions" className="hidden sm:flex btn-ghost text-sm">
            All Missions <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {missions.slice(0, 4).map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>

        <div className="sm:hidden text-center mt-6">
          <Link to="/missions" className="btn-ghost text-sm">
            View All Missions <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
