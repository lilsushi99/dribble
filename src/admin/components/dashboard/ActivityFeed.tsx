import React from 'react';
import { Card, Badge, Button } from '../ui';
import { Activity, Inbox, FileText, FolderKanban, Clock, User, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { ActivityLogItem, FormSubmissionData } from '../../types/admin.types';

export interface ActivityFeedProps {
  activityLogs: ActivityLogItem[];
  formSubmissions: FormSubmissionData[];
  onViewAllLogs: () => void;
  onViewAllForms: () => void;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activityLogs,
  formSubmissions,
  onViewAllLogs,
  onViewAllForms,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Recent Activity Stream */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Recent Admin Activity</h4>
          </div>
          <Button variant="ghost" size="sm" onClick={onViewAllLogs}>
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {activityLogs.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Activity className="w-6 h-6 text-slate-300 dark:text-zinc-700 mx-auto" />
              <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400">No activity recorded yet</p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">Administrator changes and logins will automatically log here.</p>
            </div>
          ) : (
            activityLogs.slice(0, 4).map((log) => {
              const timeFormatted = new Date(log.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={log.id}
                  className="flex items-start justify-between p-3 rounded-xl border border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/40 hover:bg-slate-100/60 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                          {log.first_name} {log.last_name}
                        </span>
                        <Badge variant="blue" size="sm">
                          {log.action}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-zinc-300 mt-1">
                        {log.details_json?.change || log.details_json?.filename || log.details_json?.title || 'Executed standard CMS operation'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {timeFormatted}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Latest Form Submissions Feed */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-blue-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Latest Lead Submissions</h4>
          </div>
          <Button variant="ghost" size="sm" onClick={onViewAllForms}>
            View Submissions
          </Button>
        </div>

        <div className="space-y-3">
          {formSubmissions.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Inbox className="w-6 h-6 text-slate-300 dark:text-zinc-700 mx-auto" />
              <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400">No lead submissions received yet</p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">Public contact form inquiries will appear here in real time.</p>
            </div>
          ) : (
            formSubmissions.map((sub) => {
              let data: any = {};
              try {
                data = JSON.parse(sub.data_json);
              } catch (e) {
                data = {};
              }

              return (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/40 hover:bg-slate-100/60 dark:hover:bg-zinc-800/40 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                      {data.full_name || 'Anonymous Client'}
                    </span>
                    <Badge variant="emerald" size="sm">
                      {data.budget || 'New Lead'}
                    </Badge>
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                    {data.company} • {data.email}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-zinc-300 line-clamp-2 pt-1 border-t border-slate-100 dark:border-zinc-800/60">
                    "{data.message}"
                  </p>
                </div>
              );
            })
          )}
        </div>

      </Card>
    </div>
  );
};
