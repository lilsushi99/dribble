import React from 'react';
import {
  LayoutDashboard,
  Layers,
  FileText,
  Image,
  Inbox,
  Search,
  Settings,
  Users,
  Activity,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'layout-builder'
  | 'content-management'
  | 'media-library'
  | 'forms'
  | 'seo'
  | 'settings'
  | 'users'
  | 'activity-logs';

export interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onViewWebsite: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  onViewWebsite,
}) => {
  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'layout-builder' as AdminTab, label: 'Layout Builder', icon: Layers, badge: 'Core' },
    { id: 'content-management' as AdminTab, label: 'Content Management', icon: FileText, badge: null },
    { id: 'media-library' as AdminTab, label: 'Media Library', icon: Image, badge: null },
    { id: 'forms' as AdminTab, label: 'Forms', icon: Inbox, badge: '2 New' },
    { id: 'seo' as AdminTab, label: 'SEO Settings', icon: Search, badge: null },
    { id: 'settings' as AdminTab, label: 'System Settings', icon: Settings, badge: null },
    { id: 'users' as AdminTab, label: 'Users & Roles', icon: Users, badge: null },
    { id: 'activity-logs' as AdminTab, label: 'Activity Logs', icon: Activity, badge: null },
  ];

  return (
    <aside
      className={`relative z-30 flex flex-col h-screen border-r border-slate-200/90 dark:border-zinc-800/80 bg-slate-50/80 dark:bg-zinc-950/90 backdrop-blur-md transition-all duration-300 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200/80 dark:border-zinc-800/80 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-sm text-slate-900 dark:text-zinc-100 tracking-wider">
                KINETIC
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                ADMIN ENGINE
              </span>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-200/60 dark:hover:bg-zinc-800/60 transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/30'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200/60 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                  isActive ? 'text-white' : 'text-slate-400 dark:text-zinc-500 group-hover:text-blue-500'
                }`}
              />
              {!isCollapsed && (
                <div className="flex items-center justify-between w-full overflow-hidden">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-md shrink-0 ml-1 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Public View Trigger at Footer */}
      <div className="p-3 border-t border-slate-200/80 dark:border-zinc-800/80 shrink-0">
        <button
          onClick={onViewWebsite}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all ${
            isCollapsed ? 'p-2' : ''
          }`}
          title="View Live Website"
        >
          <ExternalLink className="w-4 h-4 text-blue-500 shrink-0" />
          {!isCollapsed && <span>View Live Site</span>}
        </button>
      </div>
    </aside>
  );
};
