import React from 'react';
import { DashboardAnalytics, ActivityLogItem, FormSubmissionData } from '../types/admin.types';
import { StatWidgetCard } from '../components/dashboard/StatWidgetCard';
import { TrafficChart } from '../components/dashboard/TrafficChart';
import { BreakdownCharts } from '../components/dashboard/BreakdownCharts';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import {
  Users,
  Eye,
  MousePointerClick,
  HardDrive,
  Clock,
  PhoneCall,
  MessageSquare,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';

export interface DashboardOverviewPageProps {
  analytics: DashboardAnalytics;
  activityLogs: ActivityLogItem[];
  formSubmissions: FormSubmissionData[];
  onNavigateTab: (tab: any) => void;
}

export const DashboardOverviewPage: React.FC<DashboardOverviewPageProps> = ({
  analytics,
  activityLogs,
  formSubmissions,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-900/60 via-zinc-900 to-indigo-950/60 border border-blue-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">KINETIC Executive Command Center</h2>
          </div>
          <p className="text-xs text-zinc-300 mt-1 max-w-2xl">
            Live telemetry stream monitoring digital engagement, portfolio interactions, form leads, and system telemetry across all host nodes.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-400/30 text-blue-300">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>Last Admin Session: {analytics.lastLogin || 'No logins recorded yet'}</span>
        </div>
      </div>

      {/* Row 1: Primary Traffic */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3">
          Overall Telemetry & Session Log
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatWidgetCard
            title="Total Visitors"
            value={analytics.totalVisitors || 0}
            subtitle="Lifetime unique visitors"
            icon={<Users className="w-4 h-4" />}
          />
          <StatWidgetCard
            title="Visitors Today"
            value={analytics.visitorsToday || 0}
            subtitle="Since midnight UTC"
            icon={<Users className="w-4 h-4" />}
          />
          <StatWidgetCard
            title="Visitors This Month"
            value={analytics.visitorsThisMonth || 0}
            subtitle="Current month total"
            icon={<Users className="w-4 h-4" />}
          />
          <StatWidgetCard
            title="Last Admin Login"
            value={analytics.lastLogin || 'No logins recorded yet'}
            subtitle="Administrator Session"
            badge="MySQL Session"
            icon={<Clock className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Row 2: Page Views Breakdown */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3">
          Page & Section Impressions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatWidgetCard
            title="Project Views"
            value={analytics.projectViews || 0}
            subtitle="Portfolio item opens"
            icon={<Eye className="w-4 h-4" />}
          />
          <StatWidgetCard
            title="Studio Views"
            value={analytics.studioViews || 0}
            subtitle="Laboratory overview"
            icon={<Eye className="w-4 h-4" />}
          />
          <StatWidgetCard
            title="Blog Views"
            value={analytics.blogViews || 0}
            subtitle="Editorial articles"
            icon={<Eye className="w-4 h-4" />}
          />
          <StatWidgetCard
            title="Contact Views"
            value={analytics.contactViews || 0}
            subtitle="Inquiry form visits"
            icon={<Eye className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Row 3: Interactions & Conversions */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3">
          Interactions & Action Conversions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatWidgetCard
            title="CTA Clicks"
            value={analytics.ctaClicks || 0}
            subtitle="Primary action triggers"
            icon={<MousePointerClick className="w-4 h-4" />}
          />
          <StatWidgetCard
            title="Book a Call Clicks"
            value={analytics.bookCallClicks || 0}
            subtitle="Diagnostic call modal"
            icon={<PhoneCall className="w-4 h-4" />}
          />
          <StatWidgetCard
            title="Chat With Us Clicks"
            value={analytics.chatClicks || 0}
            subtitle="Instant support drawer"
            icon={<MessageSquare className="w-4 h-4" />}
          />
          <StatWidgetCard
            title="Portfolio Clicks"
            value={analytics.portfolioClicks || 0}
            subtitle="Archive filters used"
            icon={<Briefcase className="w-4 h-4" />}
          />
        </div>
      </div>


      {/* Row 4: Responsive Traffic Area Chart */}
      <TrafficChart data={analytics.visitorTrends} />

      {/* Row 5: Device, Browser, Country Breakdown */}
      <BreakdownCharts
        deviceData={analytics.deviceBreakdown}
        browserData={analytics.browserBreakdown}
        countryData={analytics.countryBreakdown}
      />

      {/* Row 6: Recent Activity & Lead Submissions Feed */}
      <ActivityFeed
        activityLogs={activityLogs}
        formSubmissions={formSubmissions}
        onViewAllLogs={() => onNavigateTab('activity-logs')}
        onViewAllForms={() => onNavigateTab('forms')}
      />
    </div>
  );
};
