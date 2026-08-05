import React, { useState } from 'react';
import { FolderKanban, Sparkles, Home as HomeIcon } from 'lucide-react';
import { ProjectCmsManager } from '../components/cms/ProjectCmsManager';
import { StudioCmsManager } from '../components/cms/StudioCmsManager';
import { HomeCmsManager } from '../components/cms/HomeCmsManager';

export interface ContentManagementPageProps {
  onNavigateTab: (tab: any) => void;
}

export type CmsSubModule = 'home' | 'projects' | 'studio';

export const ContentManagementPage: React.FC<ContentManagementPageProps> = () => {
  const [activeSubModule, setActiveSubModule] = useState<CmsSubModule>('home');

  const tabs: Array<{ id: CmsSubModule; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'studio', label: 'Studio', icon: Sparkles },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Sub Module Tabs Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeSubModule === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubModule(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Manager */}
      {activeSubModule === 'home' && <HomeCmsManager />}
      {activeSubModule === 'projects' && <ProjectCmsManager />}
      {activeSubModule === 'studio' && <StudioCmsManager />}
    </div>
  );
};
