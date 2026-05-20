import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  color?: string;
}

export default function StatCard({ icon: Icon, label, value, trend, color = 'brand' }: StatCardProps) {
  const colorMap: Record<string, string> = {
    brand: 'text-brand-400 bg-brand-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    red: 'text-red-400 bg-red-500/10',
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${colorMap[color] || colorMap.brand}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-emerald-400">{trend}</span>
        )}
      </div>
      <div className="mt-4">
        <p className="stat-value">{value}</p>
        <p className="stat-label mt-1">{label}</p>
      </div>
    </div>
  );
}
