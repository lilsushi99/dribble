import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  ExternalLink,
  ChevronDown,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AdminUser } from '../types/admin.types';

export interface AdminHeaderProps {
  activeTabTitle: string;
  currentUser: AdminUser | null;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  onViewWebsite: () => void;
  onOpenSettings: () => void;
  onSearchChange?: (query: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTabTitle,
  currentUser,
  darkMode,
  onToggleDarkMode,
  onLogout,
  onViewWebsite,
  onOpenSettings,
  onSearchChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  const notifications = [
    {
      id: 1,
      title: 'New Lead Form Submission',
      time: '12 mins ago',
      read: false,
      desc: 'Elena Rostova submitted a project request ($50k-$100k)',
    },
    {
      id: 2,
      title: 'System Deployment Successful',
      time: '1 hour ago',
      read: true,
      desc: 'Backend version 1.0.0 compiled clean on Cloud Run',
    },
    {
      id: 3,
      title: 'Homepage Layout Saved',
      time: '3 hours ago',
      read: true,
      desc: 'Sections reordered and stored in MySQL database',
    },
  ];

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-6 border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-200">
      {/* Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
          <span>{activeTabTitle}</span>
        </h1>
        <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 rounded-md border border-blue-200/60 dark:border-blue-800/50 uppercase tracking-wider">
          LIVE CONNECTED
        </span>
      </div>

      {/* Center Global Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
        <Search className="w-4 h-4 absolute left-3.5 text-slate-400 dark:text-zinc-500 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Quick search dashboard, media, settings..."
          className="w-full pl-10 pr-4 py-1.5 text-xs rounded-xl bg-slate-100/80 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              if (onSearchChange) onSearchChange('');
            }}
            className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* View Site Quick Button */}
        <button
          onClick={onViewWebsite}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-colors"
          title="Open Website View"
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
          <span>Site Preview</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-zinc-950" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden z-30 animate-in fade-in duration-150">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">
                  Notifications
                </span>
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">3 New</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-zinc-800/60 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors ${
                      !n.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100">{n.title}</p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {n.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 pl-2 pr-2.5 rounded-xl border border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/50 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {currentUser?.first_name ? currentUser.first_name[0] : 'A'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100 leading-tight">
                {currentUser?.first_name || 'Principal'} {currentUser?.last_name || 'Admin'}
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                {currentUser?.role_name || 'Super Admin'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden z-30 p-1.5 animate-in fade-in duration-150">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-zinc-800 mb-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                  {currentUser?.first_name || 'Principal'} {currentUser?.last_name || 'Admin'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                  {currentUser?.email || 'admin@kinetic.studio'}
                </p>
              </div>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onOpenSettings();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Account Settings</span>
              </button>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors mt-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
