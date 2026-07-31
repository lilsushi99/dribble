import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Textarea, Badge } from '../components/ui';
import { Search, Save, Globe, Share2, CheckCircle2, FileCode, RefreshCw, Eye, Sparkles } from 'lucide-react';
import { adminApi } from '../services/adminApi';

interface PageSeoData {
  meta_title: string;
  meta_description: string;
  keywords: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  canonical_url?: string;
}

export const SeoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'global' | 'homepage' | 'studio' | 'projects' | 'blog' | 'contact'>('global');

  const [seoState, setSeoState] = useState<Record<string, PageSeoData>>({
    global: {
      meta_title: 'KINETIC — High-Performance Motion Architecture & Digital Systems',
      meta_description: 'KINETIC operates as an independent design laboratory bridging physical motion architecture, editorial visual identity, and high-performance digital systems.',
      keywords: 'motion architecture, digital studio, design laboratory, kinetic systems',
      og_title: 'KINETIC — High-Performance Digital Systems',
      og_description: 'Independent design laboratory engineering digital monuments with architectural discipline.',
      og_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      canonical_url: 'https://kinetic.studio',
    },
    homepage: {
      meta_title: 'KINETIC | Kinetic Motion & Digital Architecture',
      meta_description: 'Welcome to KINETIC. We build bespoke digital spaces and motion systems.',
      keywords: 'kinetic, motion design, architectural web, luxury digital',
      og_title: 'KINETIC | Home',
      og_description: 'Explore our latest motion architecture and kinetic studio projects.',
      og_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    },
    studio: {
      meta_title: 'Studio & Laboratory — KINETIC',
      meta_description: 'Our design philosophy, laboratory practices, and kinetic team.',
      keywords: 'studio philosophy, kinetic laboratory, spatial typography',
      og_title: 'Studio & Laboratory — KINETIC',
      og_description: 'Engineering digital monuments with architectural discipline.',
      og_image_url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop',
    },
    projects: {
      meta_title: 'Selected Projects & Portfolio — KINETIC',
      meta_description: 'Explore selected architectural digital projects and case studies.',
      keywords: 'portfolio, architectural projects, case studies, digital monuments',
      og_title: 'Selected Projects — KINETIC',
      og_description: 'Explore selected architectural digital projects and case studies.',
      og_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    },
    blog: {
      meta_title: 'Editorial Archives & Essays — KINETIC',
      meta_description: 'Manifestos, technical essays, and spatial design perspectives.',
      keywords: 'blog, essays, spatial typography, design manifesto',
      og_title: 'Editorial Archives — KINETIC',
      og_description: 'Manifestos, technical essays, and spatial design perspectives.',
      og_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    },
    contact: {
      meta_title: 'Initiate Commission — KINETIC Contact',
      meta_description: 'Connect with KINETIC for high-impact spatial design and digital commissions.',
      keywords: 'contact, commission, hire kinetic studio, inquiry',
      og_title: 'Initiate Commission — KINETIC',
      og_description: 'Connect with KINETIC for high-impact spatial design and digital commissions.',
      og_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sitemapGenerating, setSitemapGenerating] = useState(false);
  const [sitemapInfo, setSitemapInfo] = useState<{ generatedAt?: string; urlCount?: number; xml?: string } | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSeo() {
      setLoading(true);
      try {
        const res = await adminApi.getSeoSettings();
        if (res && Object.keys(res).length > 0) {
          setSeoState((prev) => ({ ...prev, ...res }));
        }
      } catch (e) {
        console.error('Failed to load SEO settings:', e);
      } finally {
        setLoading(false);
      }
    }
    loadSeo();
  }, []);

  const handleFieldChange = (key: keyof PageSeoData, value: string) => {
    setSeoState((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [key]: value,
      },
    }));
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.saveSeoSettings(seoState);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save SEO settings');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateSitemap = async () => {
    setSitemapGenerating(true);
    try {
      const res = await adminApi.generateSitemap();
      setSitemapInfo(res);
      alert(`Sitemap successfully generated with ${res.urlCount} indexed URLs! Available at /sitemap.xml`);
    } catch (e: any) {
      alert(e.message || 'Failed to generate sitemap.xml');
    } finally {
      setSitemapGenerating(false);
    }
  };

  const currentPage = seoState[activeTab] || seoState['global'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-500" />
            <span>Search Engine Optimization (SEO) & Sitemap System</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Configure global meta tags, OpenGraph social previews, page-specific metadata, and generate standard sitemap.xml.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateSitemap}
            disabled={sitemapGenerating}
          >
            <FileCode className={`w-3.5 h-3.5 mr-1.5 ${sitemapGenerating ? 'animate-spin' : ''}`} />
            {sitemapGenerating ? 'Generating XML...' : 'Generate Sitemap'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveSeo}
            disabled={saving}
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                SEO Stored!
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {saving ? 'Saving MySQL...' : 'Save All SEO'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-x-auto">
        {[
          { id: 'global', label: 'Global SEO' },
          { id: 'homepage', label: 'Homepage' },
          { id: 'studio', label: 'Studio Page' },
          { id: 'projects', label: 'Projects Page' },
          { id: 'blog', label: 'Blog Page' },
          { id: 'contact', label: 'Contact Page' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SEO Config Form + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              Meta Data Configuration ({activeTab.toUpperCase()})
            </h3>
            <Badge variant="blue">MySQL Persistence</Badge>
          </div>

          <form onSubmit={handleSaveSeo} className="space-y-4 text-xs">
            {activeTab === 'global' && (
              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Domain Canonical Base URL</label>
                <Input
                  value={currentPage.canonical_url || 'https://kinetic.studio'}
                  onChange={(e) => handleFieldChange('canonical_url', e.target.value)}
                  placeholder="https://kinetic.studio"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Meta Title Tag *</label>
              <Input
                required
                value={currentPage.meta_title || ''}
                onChange={(e) => handleFieldChange('meta_title', e.target.value)}
                placeholder="e.g. KINETIC | Motion Architecture"
              />
              <p className="text-[11px] text-slate-400 mt-1">Recommended length: 50–60 characters.</p>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Meta Description *</label>
              <Textarea
                rows={3}
                required
                value={currentPage.meta_description || ''}
                onChange={(e) => handleFieldChange('meta_description', e.target.value)}
                placeholder="Enter compelling meta description..."
              />
              <p className="text-[11px] text-slate-400 mt-1">Recommended length: 140–160 characters.</p>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Meta Keywords (Comma Separated)</label>
              <Input
                value={currentPage.keywords || ''}
                onChange={(e) => handleFieldChange('keywords', e.target.value)}
                placeholder="motion, architecture, digital studio"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-blue-500" /> OpenGraph Social Sharing Preview
              </h4>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">OpenGraph Title</label>
                <Input
                  value={currentPage.og_title || ''}
                  onChange={(e) => handleFieldChange('og_title', e.target.value)}
                  placeholder="Title shown on Twitter/LinkedIn"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">OpenGraph Description</label>
                <Textarea
                  rows={2}
                  value={currentPage.og_description || ''}
                  onChange={(e) => handleFieldChange('og_description', e.target.value)}
                  placeholder="Summary shown on social platforms..."
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">OpenGraph Image URL</label>
                <Input
                  value={currentPage.og_image_url || ''}
                  onChange={(e) => handleFieldChange('og_image_url', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
              <Button variant="primary" type="submit" disabled={saving}>
                <Save className="w-4 h-4 mr-1.5" />
                {saving ? 'Updating MySQL...' : 'Save Meta Configurations'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Live Search Engine Snippet Preview & Sitemap Status */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-500" /> Google SERP Snippet Preview
            </h3>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 space-y-1 font-sans">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium block truncate font-mono">
                {seoState['global']?.canonical_url || 'https://kinetic.studio'}
                {activeTab !== 'global' && activeTab !== 'homepage' ? `/${activeTab}` : ''}
              </span>
              <h4 className="text-sm font-bold text-blue-800 dark:text-blue-400 hover:underline cursor-pointer leading-snug">
                {currentPage.meta_title || 'KINETIC Studio'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                {currentPage.meta_description || 'No meta description provided.'}
              </p>
            </div>
          </Card>

          {/* Social Card Preview */}
          <Card className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-blue-500" /> Social Card Media Card
            </h3>

            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-900 text-white">
              <img
                src={currentPage.og_image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'}
                alt="Social Card Preview"
                className="w-full h-36 object-cover"
              />
              <div className="p-3.5 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">kinetic.studio</span>
                <h5 className="text-xs font-bold text-zinc-100 truncate">{currentPage.og_title || currentPage.meta_title}</h5>
                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-tight">
                  {currentPage.og_description || currentPage.meta_description}
                </p>
              </div>
            </div>
          </Card>

          {/* Sitemap Status Panel */}
          <Card className="space-y-3 p-5 bg-gradient-to-br from-blue-50/50 to-indigo-50/20 dark:from-blue-950/20 dark:to-zinc-900 border-blue-200/60 dark:border-blue-900/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-500" /> sitemap.xml Status
              </span>
              <Badge variant="blue">Manual Engine</Badge>
            </div>

            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Standardized XML index collecting active pages, published projects, and blog posts.
            </p>

            {sitemapInfo && (
              <div className="p-3 rounded-lg bg-white/80 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Indexed URLs:</span>
                  <span className="font-bold text-slate-900 dark:text-zinc-100">{sitemapInfo.urlCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Last Generated:</span>
                  <span className="font-mono text-[11px] text-slate-700 dark:text-zinc-300">
                    {new Date(sitemapInfo.generatedAt || '').toLocaleTimeString()}
                  </span>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center text-xs">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
              >
                View Public /sitemap.xml
              </a>
              <Button size="sm" variant="outline" onClick={handleGenerateSitemap} disabled={sitemapGenerating}>
                Generate Sitemap
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
