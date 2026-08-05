import React, { useState, useEffect } from 'react';
import {
  adminApi,
  getAuthToken,
  getAuthUser,
  defaultLayoutSections,
  defaultMediaFiles,
  defaultActivityLogs,
  defaultSubmissions,
  defaultAnalytics,
} from './services/adminApi';
import { AdminTab, AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { AdminUser, LayoutSection, MediaFile, ActivityLogItem, FormSubmissionData, DashboardAnalytics } from './types/admin.types';

import { AdminLoginPage } from './pages/AdminLoginPage';
import { DashboardOverviewPage } from './pages/DashboardOverviewPage';
import { LayoutBuilderPage } from './pages/LayoutBuilderPage';
import { MediaLibraryPage } from './pages/MediaLibraryPage';
import { ContentManagementPage } from './pages/ContentManagementPage';
import { BlogCmsManager } from './components/cms/BlogCmsManager';
import { FormsPage } from './pages/FormsPage';
import { SeoPage } from './pages/SeoPage';
import { SettingsPage } from './pages/SettingsPage';
import { UsersPage } from './pages/UsersPage';
import { ActivityLogsPage } from './pages/ActivityLogsPage';
import { InstallationGuidePage } from './pages/InstallationGuidePage';

export interface AdminLayoutProps {
  onViewWebsite: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onViewWebsite }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getAuthToken());
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(getAuthUser());

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Data states
  const [sections, setSections] = useState<LayoutSection[]>(defaultLayoutSections);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(defaultMediaFiles);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(defaultActivityLogs);
  const [formSubmissions, setFormSubmissions] = useState<FormSubmissionData[]>(defaultSubmissions);
  const [analytics, setAnalytics] = useState<DashboardAnalytics>(defaultAnalytics);

  // Handle Dark Mode toggling on document html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Initial Data Fetch when Authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadAdminData() {
      try {
        const layoutData = await adminApi.getHomepageLayout();
        if (layoutData && layoutData.length > 0) setSections(layoutData);

        const mediaData = await adminApi.getMediaFiles();
        if (mediaData && mediaData.length > 0) setMediaFiles(mediaData);

        const logsData = await adminApi.getActivityLogs();
        if (logsData && logsData.length > 0) setActivityLogs(logsData);

        const subsData = await adminApi.getFormSubmissions(1);
        if (subsData && subsData.length > 0) setFormSubmissions(subsData);

        const analyticsData = await adminApi.getDashboardAnalytics();
        if (analyticsData) setAnalytics(analyticsData);
      } catch (err) {
        console.warn('Backend API offline or initial fallback active.', err);
      }
    }

    loadAdminData();
  }, [isAuthenticated]);

  // Login handler
  const handleLogin = async (email: string, pass: string) => {
    try {
      const res = await adminApi.login(email, pass);
      setIsAuthenticated(true);
      if (res.user) setCurrentUser(res.user);
    } catch (e: any) {
      setIsAuthenticated(false);
      setCurrentUser(null);
      throw new Error(e?.message || 'Invalid email or password');
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await adminApi.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Save layout sections
 const handleSaveSections = async (updatedSections: LayoutSection[]) => {
    const ok = await adminApi.saveHomepageLayout(updatedSections);
    if (!ok) {
      throw new Error('Failed to save layout to the database. Check that you are logged in and the backend is reachable.');
    }
    setSections(updatedSections);
  };

  // Upload Media
  const handleUploadMedia = async (file: File, category: string): Promise<MediaFile> => {
    try {
      const created = await adminApi.uploadMedia(file, category);
      setMediaFiles((prev) => [created, ...prev]);
      return created;
    } catch (e) {
      // Fallback memory creation
      const localUrl = URL.createObjectURL(file);
      const newMedia: MediaFile = {
        id: Date.now(),
        filename: file.name,
        original_name: file.name,
        mime_type: file.type || 'image/jpeg',
        file_size: file.size,
        file_path: localUrl,
        category: category as any,
        created_at: new Date().toISOString(),
      };
      setMediaFiles((prev) => [newMedia, ...prev]);
      return newMedia;
    }
  };

  // Delete Media
  const handleDeleteMedia = async (id: number): Promise<boolean> => {
    try {
      await adminApi.deleteMedia(id);
    } catch (e) {
      // Memory fallback
    }
    setMediaFiles((prev) => prev.filter((m) => m.id !== id));
    return true;
  };

  if (!isAuthenticated) {
    return <AdminLoginPage onLoginSuccess={handleLogin} />;
  }

  const tabTitles: Record<AdminTab, string> = {
    dashboard: 'Dashboard Overview',
    'layout-builder': 'Homepage Layout Builder',
    'content-management': 'Content Management Engine',
    blog: 'Blog Page & Article Management',
    'media-library': 'Digital Media Library',
    forms: 'Form Submissions & Leads',
    seo: 'SEO & Meta Settings',
    settings: 'System Infrastructure Settings',
    users: 'Users & Roles Management',
    'activity-logs': 'Audit Trail & Activity Logs',
    'installation-guide': 'Hostinger Production Installation Guide',
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Reusable Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onViewWebsite={onViewWebsite}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Reusable Header */}
        <AdminHeader
          activeTabTitle={tabTitles[activeTab]}
          currentUser={currentUser}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onLogout={handleLogout}
          onViewWebsite={onViewWebsite}
          onOpenSettings={() => setActiveTab('settings')}
        />

        {/* Dynamic Page View Scroll Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'dashboard' && (
              <DashboardOverviewPage
                analytics={analytics}
                activityLogs={activityLogs}
                formSubmissions={formSubmissions}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'layout-builder' && (
              <LayoutBuilderPage
                sections={sections}
                onSaveSections={handleSaveSections}
                mediaFiles={mediaFiles}
                onUploadMedia={handleUploadMedia}
                onDeleteMedia={handleDeleteMedia}
              />
            )}

            {activeTab === 'content-management' && (
              <ContentManagementPage onNavigateTab={setActiveTab} />
            )}

            {activeTab === 'blog' && <BlogCmsManager />}

            {activeTab === 'media-library' && (
              <MediaLibraryPage
                mediaFiles={mediaFiles}
                onUploadMedia={handleUploadMedia}
                onDeleteMedia={handleDeleteMedia}
              />
            )}

            {activeTab === 'forms' && <FormsPage submissions={formSubmissions} />}

            {activeTab === 'seo' && <SeoPage />}

            {activeTab === 'settings' && <SettingsPage />}

            {activeTab === 'users' && <UsersPage />}

            {activeTab === 'activity-logs' && <ActivityLogsPage logs={activityLogs} />}

            {activeTab === 'installation-guide' && <InstallationGuidePage />}
          </div>
        </main>
      </div>
    </div>
  );
};
