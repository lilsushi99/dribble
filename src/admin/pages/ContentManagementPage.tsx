import React, { useState } from 'react';
import { Card, Badge, Button } from '../components/ui';
import { FileText, FolderKanban, BookOpen, HelpCircle, Sparkles } from 'lucide-react';
import { ProjectCmsManager } from '../components/cms/ProjectCmsManager';
import { BlogCmsManager } from '../components/cms/BlogCmsManager';
import { StudioCmsManager } from '../components/cms/StudioCmsManager';

export interface ContentManagementPageProps {
  onNavigateTab: (tab: any) => void;
}

export type CmsSubModule = 'projects' | 'studio' | 'blog' | 'faq';

export const ContentManagementPage: React.FC<ContentManagementPageProps> = () => {
  const [activeSubModule, setActiveSubModule] = useState<CmsSubModule>('projects');

  const tabs: Array<{ id: CmsSubModule; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'studio', label: 'Studio', icon: Sparkles },
    { id: 'blog', label: 'Editorial Blog', icon: BookOpen },
    { id: 'faq', label: 'FAQ & Protocols', icon: HelpCircle },
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
      {activeSubModule === 'projects' && <ProjectCmsManager />}
      {activeSubModule === 'studio' && <StudioCmsManager />}
      {activeSubModule === 'blog' && <BlogCmsManager />}
      {activeSubModule === 'faq' && (
        <Card className="p-8 text-center space-y-3">
          <HelpCircle className="w-8 h-8 text-blue-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">Engagement FAQs & Protocols</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Managed through the Homepage Layout Builder FAQ section editor with full MySQL synchronization.
          </p>
        </Card>
      )}
    </div>
  );
};
