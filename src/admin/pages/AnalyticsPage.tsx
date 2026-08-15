import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '../components/ui';
import {
  BarChart3,
  Users,
  Eye,
  MousePointerClick,
  Globe,
  Smartphone,
  Laptop,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Activity,
  MapPin,
  Compass,
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { DashboardAnalytics } from '../types/admin.types';

// Small, non-exhaustive lookup so common country codes show a readable name — falls back
// to the raw code for anything not listed rather than guessing.
const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States', GB: 'United Kingdom', DE: 'Germany', FR: 'France', JP: 'Japan',
  CA: 'Canada', AU: 'Australia', NG: 'Nigeria', IN: 'India', BR: 'Brazil', ES: 'Spain',
  IT: 'Italy', NL: 'Netherlands', SE: 'Sweden', SG: 'Singapore', ZA: 'South Africa',
  Unknown: 'Unknown',
};

const DEVICE_ICONS: Record<string, any> = {
  desktop: Laptop,
  mobile: Smartphone,
  tablet: Compass,
  Unknown: Globe,
};

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '1y'>('7d');
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    adminApi.getDashboardAnalytics().then((result) => {
      if (isMounted) {
        setData(result);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const totalVisitors = data?.totalVisitors || 0;
  const totalPageViews = data?.totalPageViews || 0;
  const totalCtaClicks = data?.ctaClicks || 0;
  const conversionRate = totalVisitors > 0 ? `${((totalCtaClicks / totalVisitors) * 100).toFixed(1)}%` : '0%';

  const knownPageViews = (data?.homeViews || 0) + (data?.projectsListViews || 0) + (data?.studioViews || 0) + (data?.blogViews || 0) + (data?.contactViews || 0);
  const topPages = [
    { path: '/', views: data?.homeViews || 0 },
    { path: '/projects', views: data?.projectsListViews || 0 },
    { path: '/studio', views: data?.studioViews || 0 },
    { path: '/blog', views: data?.blogViews || 0 },
    { path: '/contact', views: data?.contactViews || 0 },
  ]
    .sort((a, b) => b.views - a.views)
    .map((p) => ({
      ...p,
      percentage: knownPageViews > 0 ? `${((p.views / knownPageViews) * 100).toFixed(1)}%` : '0%',
    }));

  const devices = (data?.deviceBreakdown || []).map((d) => ({
    name: d.name,
    count: d.value,
    percentage: `${d.value}%`,
    icon: DEVICE_ICONS[d.name] || Globe,
  }));

  const countries = (data?.countryBreakdown || []).map((c) => ({
    code: c.code,
    country: COUNTRY_NAMES[c.code] || c.code,
    visitors: c.visitors,
    percentage: `${c.percentage}%`,
  }));

  const ctaEvents = [
    { name: 'Chat Widget Opened', count: data?.chatClicks || 0, target: 'Live chat' },
    { name: 'Book a Call Clicked', count: data?.bookCallClicks || 0, target: 'Booking modal' },
    { name: 'View Portfolio Clicked', count: data?.portfolioClicks || 0, target: '/projects' },
  ];

  if (loading) {
    return <div className="p-10 text-center text-xs text-slate-400">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Analytics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <span>Visitor Traffic, Pageviews & CTA Analytics</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Real-time metric telemetry tracking pageviews, visitor metadata (Device, Location, Referrer), and CTA engagement.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
          {(['24h', '7d', '30d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Total Unique Visitors</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
              {totalVisitors.toLocaleString()}
            </span>
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Total Pageviews</span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
              {totalPageViews.toLocaleString()}
            </span>
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">CTA Button Clicks</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
              {totalCtaClicks.toLocaleString()}
            </span>
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Conversion Rate</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
              {conversionRate}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">CTA clicks / visitors</span>
          </div>
        </Card>
      </div>

      {/* Detail Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Pages */}
        <Card className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
            <Eye className="w-4 h-4 text-blue-500" /> Most Visited Pages & Routes
          </h3>

          <div className="space-y-3">
            {topPages.map((page, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">{page.path}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 dark:text-zinc-400">{page.views.toLocaleString()} views</span>
                    <Badge variant="blue">{page.percentage}</Badge>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: page.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Device Breakdown */}
        <Card className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
            <Laptop className="w-4 h-4 text-blue-500" /> Visitors Device Category
          </h3>

          <div className="space-y-4">
            {devices.map((device, idx) => {
              const DeviceIcon = device.icon;
              return (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">
                      <DeviceIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100">{device.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">{device.count.toLocaleString()} visitors</p>
                    </div>
                  </div>
                  <Badge variant="emerald">{device.percentage}</Badge>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Top Countries */}
        <Card className="lg:col-span-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
            <MapPin className="w-4 h-4 text-blue-500" /> Geographic Visitor Distribution
          </h3>

          <div className="space-y-3">
            {countries.map((c, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/40">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 font-bold text-slate-700 dark:text-zinc-300">
                    {c.code}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">{c.country}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 dark:text-zinc-400">{c.visitors.toLocaleString()}</span>
                  <Badge variant="blue">{c.percentage}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* CTA Conversions */}
        <Card className="lg:col-span-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
            <MousePointerClick className="w-4 h-4 text-blue-500" /> CTA Conversions & Event Logs
          </h3>

          <div className="space-y-3">
            {ctaEvents.map((cta, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-zinc-100">{cta.name}</h4>
                  <Badge variant="purple">{cta.count} conversions</Badge>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">Target: {cta.target}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
