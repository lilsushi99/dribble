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
            <Sparkles className="w-5 h-5 text-blue-400 animate-spin" />
            <h2 className="text-xl font-bold text-white tracking-tight">KINETIC Executive Command Center</h2>
          </div>
          <p className="text-xs text-zinc-300 mt-1 max-w-2xl">
            Live telemetry stream monitoring digital engagement, portfolio interactions, form leads, and storage capacity across all host nodes.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-400/30 text-blue-300">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>Last Admin Session: {analytics.lastLogin}</span>
        </div>
      </div>

      {/* Row 1: Primary Traffic & Storage */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3">
          Overall Telemetry & Storage
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatWidgetCard
            title="Total Visitors"
            value={analytics.totalVisitors}
            change="+12.4%"
            trend="up"
            subtitle="Lifetime unique visitors"
            icon={<Users className="w-4 h-4" />}
          />
          <StatWidgetCard
            title="Visitors Today"
            value={analytics.visitorsToday}
            change="+8.1%"
            trend="up"
            subtitle="Since midnight UTC"
            icon={<Users className="w-4 h-4" />}
          />
          <StatWidgetCard
            title="Visitors This Month"
            value={analytics.visitorsThisMonth}
            change="+15.2%"
            trend="up"
            subtitle="July 2026 total"
            icon={<Users className="w-4 h-4" />}
          />
          <StatWidgetCard
            title="Storage Usage"
            value={`${analytics.storageUsageGb} GB`}
            subtitle={`Cap: ${analytics.storageMaxGb} GB`}
            badge="Hostinger Node"
            icon={<HardDrive className="w-4 h-4" />}
          />
          <StatWidgetCard
            title="Last Admin Login"
            value="12:42 PM"
            subtitle="IP: 192.168.1.1"
            badge="Super Admin"
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
            value={analytics.projectViews}
            change="+18.5%"
            trend="up"
            subtitle="Portfolio item opens"
            icon={<Eye className="w-4 h-4" />}
          />
          <StatWidgetCard
            title="Studio Views"
            value={analytics.studioViews}
            change="+9.2%"
            trend="up"
            subtitle="Laboratory overview"
            icon={<Eye className="w-4 h-4" />}
          />
          <StatWidgetCard
            title="Blog Views"
            value={analytics.blogViews}
            change="+14.0%"
            trend="up"
            subtitle="Editorial articles"
            icon={<Eye className="w-4 h-4" />}
          />
          <StatWidgetCard
            title="Contact Views"
            value={analytics.contactViews}
            change="+6.7%"
            trend="up"
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
            value={analytics.ctaClicks}
            change="+22.1%"
            trend="up"
            subtitle="Primary action triggers"
            icon={<MousePointerClick className="w-4 h-4" />}
          />
          <StatWidgetCard
            title="Book a Call Clicks"
            value={analytics.bookCallClicks}
            change="+11.4%"
            trend="up"
            subtitle="Diagnostic call modal"
            icon={<PhoneCall className="w-4 h-4" />}
          />
          <StatWidgetCard
            title="Chat With Us Clicks"
            value={analytics.chatClicks}
            change="+5.0%"
            trend="neutral"
            subtitle="Instant support drawer"
            icon={<MessageSquare className="w-4 h-4" />}
          />
          <StatWidgetCard
            title="Portfolio Clicks"
            value={analytics.portfolioClicks}
            change="+29.3%"
            trend="up"
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
