import { Shield } from 'lucide-react';

const RANK_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  rookie: { label: 'Rookie', color: 'text-surface-400', bg: 'bg-surface-700/50' },
  analyst: { label: 'Analyst', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  strategist: { label: 'Strategist', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  oracle: { label: 'Oracle', color: 'text-brand-400', bg: 'bg-brand-500/10' },
  scout: { label: 'Scout', color: 'text-red-400', bg: 'bg-red-500/10' },
};

export default function RankBadge({ rank, size = 'md' }: { rank: string; size?: 'sm' | 'md' }) {
  const config = RANK_CONFIG[rank] || RANK_CONFIG.rookie;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeClasses} rounded-full font-medium ${config.color} ${config.bg}`}>
      <Shield className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {config.label}
    </span>
  );
}
