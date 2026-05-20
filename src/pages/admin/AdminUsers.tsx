import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Profile } from '../../types';
import RankBadge from '../../components/ui/RankBadge';

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);

  useEffect(() => {
    supabase.from('profiles').select('*').order('total_points', { ascending: false }).limit(100).then(({ data }) => {
      if (data) setUsers(data);
    });
  }, []);

  async function updateRole(userId: string, role: string) {
    await supabase.from('profiles').update({ role }).eq('id', userId);
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: role as Profile['role'] } : u));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-brand-400" />
        Users ({users.length})
      </h1>

      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="flex items-center gap-4 p-4 rounded-lg bg-surface-900 border border-surface-800">
            <div className="w-10 h-10 rounded-full bg-surface-700 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-surface-300">{u.display_name?.charAt(0)?.toUpperCase() || '?'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{u.display_name}</p>
              <p className="text-xs text-surface-500">{u.email}</p>
            </div>
            <RankBadge rank={u.rank} size="sm" />
            <div className="text-right">
              <p className="text-sm font-bold text-brand-400">{u.total_points}</p>
              <p className="text-[10px] text-surface-500">points</p>
            </div>
            <select
              value={u.role}
              onChange={(e) => updateRole(u.id, e.target.value)}
              className="input-field !w-24 text-xs !py-1.5"
            >
              <option value="fan">Fan</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
