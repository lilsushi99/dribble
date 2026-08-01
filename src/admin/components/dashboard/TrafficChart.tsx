import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card } from '../ui';
import { TrendingUp, Users, Eye } from 'lucide-react';

export interface TrafficChartProps {
  data: Array<{ date: string; visitors: number; pageViews: number }>;
}

export const TrafficChart: React.FC<TrafficChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="w-full text-center py-12 space-y-2">
        <TrendingUp className="w-8 h-8 text-slate-400 dark:text-zinc-600 mx-auto" />
        <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300">No Visitor Telemetry Recorded Yet</h3>
        <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-sm mx-auto">
          Traffic trends will dynamically chart pageviews and unique visitors in real-time as users visit your website.
        </p>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              Visitor & Pageview Traffic Trends
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Real-time analytics recorded across all KINETIC CMS digital touchpoints
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
            <Users className="w-3.5 h-3.5" />
            <span>Unique Visitors</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-400">
            <span className="w-3 h-3 rounded-full bg-sky-300 inline-block" />
            <Eye className="w-3.5 h-3.5" />
            <span>Total Pageviews</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0097FF" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0097FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              dy={5}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: 'rgba(51, 65, 85, 0.8)',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
              }}
            />
            <Area
              type="monotone"
              dataKey="pageViews"
              stroke="#38bdf8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#viewsGradient)"
            />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#0097FF"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#visitorGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
