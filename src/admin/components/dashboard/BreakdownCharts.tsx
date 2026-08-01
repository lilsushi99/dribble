import React from 'react';
import { Card, Badge } from '../ui';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Monitor, Smartphone, Tablet, Globe, Chrome, Compass, Globe2 } from 'lucide-react';

export interface BreakdownChartsProps {
  deviceData: Array<{ name: string; value: number; fill: string }>;
  browserData: Array<{ name: string; value: number; fill: string }>;
  countryData: Array<{ country: string; code: string; visitors: number; percentage: number }>;
}

export const BreakdownCharts: React.FC<BreakdownChartsProps> = ({
  deviceData = [],
  browserData = [],
  countryData = [],
}) => {
  const hasDevice = deviceData.length > 0;
  const hasBrowser = browserData.length > 0;
  const hasCountry = countryData.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      {/* Device Breakdown */}
      <Card className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Device Breakdown</h4>
            </div>
            {hasDevice && (
              <Badge variant="blue" size="sm">
                Recorded
              </Badge>
            )}
          </div>

          {hasDevice ? (
            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-center p-4">
              <Monitor className="w-8 h-8 text-slate-300 dark:text-zinc-700 mb-2" />
              <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400">No device telemetry yet</p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">Device categories will populate as visitors land on your site.</p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 text-[11px] text-slate-400 dark:text-zinc-500 flex justify-between">
          <span>Device Classification</span>
          <span className="font-semibold text-slate-700 dark:text-zinc-300">
            {hasDevice ? `${deviceData.length} Types` : 'Empty'}
          </span>
        </div>
      </Card>

      {/* Browser Breakdown */}
      <Card className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Browser Breakdown</h4>
            </div>
            {hasBrowser && (
              <Badge variant="emerald" size="sm">
                Active
              </Badge>
            )}
          </div>

          {hasBrowser ? (
            <div className="space-y-3 my-2">
              {browserData.map((b) => (
                <div key={b.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-zinc-300">{b.name}</span>
                    <span className="font-bold text-slate-900 dark:text-zinc-100">{b.value}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${b.value}%`, backgroundColor: b.fill }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-center p-4">
              <Compass className="w-8 h-8 text-slate-300 dark:text-zinc-700 mb-2" />
              <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400">No browser data recorded</p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">User agents will be logged during public sessions.</p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 text-[11px] text-slate-400 dark:text-zinc-500 flex justify-between">
          <span>Total User Agents Recorded</span>
          <span className="font-semibold text-slate-700 dark:text-zinc-300">
            {hasBrowser ? browserData.length : '0'}
          </span>
        </div>
      </Card>

      {/* Country Breakdown */}
      <Card className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Top Countries</h4>
            </div>
            {hasCountry && (
              <Badge variant="purple" size="sm">
                Global
              </Badge>
            )}
          </div>

          {hasCountry ? (
            <div className="space-y-2.5 my-1">
              {countryData.map((c) => (
                <div
                  key={c.code}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50/60 dark:bg-zinc-950/50 hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-4 rounded bg-slate-200 dark:bg-zinc-800 text-[10px] font-bold text-slate-600 dark:text-zinc-300 flex items-center justify-center">
                      {c.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">{c.country}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                      {c.visitors.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 w-8 text-right">{c.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-center p-4">
              <Globe2 className="w-8 h-8 text-slate-300 dark:text-zinc-700 mb-2" />
              <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400">No geographic data</p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">Visitor country origins will be mapped here.</p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 text-[11px] text-slate-400 dark:text-zinc-500 flex justify-between">
          <span>Active Geographic Nodes</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {hasCountry ? `${countryData.length} Countries` : '0 Countries'}
          </span>
        </div>
      </Card>
    </div>
  );
};

