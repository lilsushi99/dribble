import React, { useState } from 'react';
import { ActivityLogItem } from '../types/admin.types';
import { Card, Badge, Input } from '../components/ui';
import { Activity, Search, Clock, ShieldAlert } from 'lucide-react';

export interface ActivityLogsPageProps {
  logs: ActivityLogItem[];
}

export const ActivityLogsPage: React.FC<ActivityLogsPageProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = logs.filter((log) => {
    const text = `${log.action} ${log.email} ${log.first_name} ${log.ip_address}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <span>Audit Trail & Activity Logs</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Immutable operation record stored in Hostinger MySQL `activity_logs` table.
          </p>
        </div>

        <Input
          icon={<Search className="w-4 h-4" />}
          placeholder="Filter audit logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64"
        />
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-zinc-800 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider bg-slate-50/50 dark:bg-zinc-950/40">
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">Operator</th>
              <th className="py-3.5 px-4">Action Trigger</th>
              <th className="py-3.5 px-4">Payload Summary</th>
              <th className="py-3.5 px-4">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80 text-xs">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
                <td className="py-3 px-4 font-mono text-slate-500 dark:text-zinc-400">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-zinc-100">
                  {log.first_name || 'System'} ({log.email || 'Automated'})
                </td>
                <td className="py-3 px-4">
                  <Badge variant="blue">{log.action}</Badge>
                </td>
                <td className="py-3 px-4 text-slate-600 dark:text-zinc-300">
                  {JSON.stringify(log.details_json)}
                </td>
                <td className="py-3 px-4 font-mono text-slate-500 dark:text-zinc-400">
                  {log.ip_address || '127.0.0.1'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
