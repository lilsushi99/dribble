import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Textarea, DeviceImageUpload, DeviceMultiImageUpload } from '../ui';
import { adminApi, defaultHomepageData } from '../../services/adminApi';
import { useSettings } from '../../../context/SettingsContext';
import { HomepageContent, HomepageStat } from '../../types/admin.types';
import {
  Home,
  Save,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const defaultFaqs: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What is the typical engagement timeline for a full commission?',
    answer:
      'A comprehensive brand architecture and interaction design project typically spans 8 to 14 weeks. We restrict our active client roster to a maximum of three concurrent projects to guarantee senior partner involvement at every keyframe.',
  },
  {
    id: 'faq-2',
    question: 'How does Comic Art Studio structure project deliverables and source code?',
    answer:
      'All commissions include fully documented, production-ready code repositories, bespoke typography licenses, physical asset guidelines, and componentized design tokens. You retain 100% intellectual property ownership.',
  },
  {
    id: 'faq-3',
    question: 'Do you offer ongoing retainer partnerships after launch?',
    answer:
      'Yes. Following initial launch, we offer selective quarter-by-quarter retainers for continuous spatial refinement, design system maintenance, and strategic visual evolution.',
  },
];

// Fields with no column in homepage_content live in the generic settings store instead
// (same mechanism already used for contact_* fields) rather than requiring a schema change.
interface SiteFields {
  heroBackgroundImage: string;
  comicPanelHeading: string;
  comicPanelSubtitle: string;
  comicPanel1Images: string[];
  comicPanel2Images: string[];
  comicPanel3Images: string[];
  projectsHeading: string;
  projectsSubtitle: string;
  projectsCount: string;
  faqHeading: string;
  faqSubtitle: string;
  marqueeSpeed: string;
}

const emptySiteFields: SiteFields = {
  heroBackgroundImage: '',
  comicPanelHeading: '',
  comicPanelSubtitle: '',
  comicPanel1Images: [],
  comicPanel2Images: [],
  comicPanel3Images: [],
  projectsHeading: '',
  projectsSubtitle: '',
  projectsCount: '6',
  faqHeading: '',
  faqSubtitle: '',
  marqueeSpeed: '30',
};

export const HomeCmsManager: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const [home, setHome] = useState<HomepageContent>(defaultHomepageData);
  const [site, setSite] = useState<SiteFields>(emptySiteFields);
  const [faqs, setFaqs] = useState<FaqItem[]>(defaultFaqs);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    hero: true,
    comic: false,
    marquee: false,
    projects: false,
    studio: false,
    faq: false,
    contact: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const loadHome = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getHomepageData();
      if (data) {
        setHome({
          ...data,
          statistics_json: data.statistics_json || [],
          marquee_items_json: data.marquee_items_json || [],
        });
      }
    } catch (e) {
      console.error('Failed to load homepage data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHome();
  }, []);

  useEffect(() => {
    if (!settings) return;
    const parseArr = (raw: string | undefined): string[] => {
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    };
    setSite({
      heroBackgroundImage: settings.hero_background_image || '',
      comicPanelHeading: settings.comic_panel_heading || '',
      comicPanelSubtitle: settings.comic_panel_subtitle || '',
      comicPanel1Images: parseArr(settings.comic_panel_1_images),
      comicPanel2Images: parseArr(settings.comic_panel_2_images),
      comicPanel3Images: parseArr(settings.comic_panel_3_images),
      projectsHeading: settings.homepage_projects_heading || '',
      projectsSubtitle: settings.homepage_projects_subtitle || '',
      projectsCount: settings.homepage_projects_count || '6',
      faqHeading: settings.homepage_faq_heading || '',
      faqSubtitle: settings.homepage_faq_subtitle || '',
      marqueeSpeed: settings.marquee_speed || '30',
    });
    if (settings.homepage_faqs) {
      try {
        const parsed = JSON.parse(settings.homepage_faqs);
        if (Array.isArray(parsed) && parsed.length > 0) setFaqs(parsed);
      } catch (e) {
        // keep defaults
      }
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveStatus(null);
    try {
      const updated = await adminApi.updateHomepageData(home);
      setHome(updated);
      await updateSettings(
        {
          hero_background_image: site.heroBackgroundImage,
          comic_panel_heading: site.comicPanelHeading,
          comic_panel_subtitle: site.comicPanelSubtitle,
          comic_panel_1_images: JSON.stringify(site.comicPanel1Images),
          comic_panel_2_images: JSON.stringify(site.comicPanel2Images),
          comic_panel_3_images: JSON.stringify(site.comicPanel3Images),
          homepage_projects_heading: site.projectsHeading,
          homepage_projects_subtitle: site.projectsSubtitle,
          homepage_projects_count: site.projectsCount,
          homepage_faq_heading: site.faqHeading,
          homepage_faq_subtitle: site.faqSubtitle,
          homepage_faqs: JSON.stringify(faqs),
          marquee_speed: site.marqueeSpeed,
        },
        'homepage'
      );
      setSaveStatus('Homepage content saved successfully to MySQL database!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      setSaveStatus(err.message || 'Failed to save homepage data');
    } finally {
      setSaving(false);
    }
  };

  // Statistics Handlers
  const handleAddStat = () => {
    const newStat: HomepageStat = { label: 'New Metric', value: '0', images: [] };
    setHome((prev) => ({ ...prev, statistics_json: [...(prev.statistics_json || []), newStat] }));
  };

  const handleRemoveStat = (index: number) => {
    setHome((prev) => ({
      ...prev,
      statistics_json: (prev.statistics_json || []).filter((_, i) => i !== index),
    }));
  };

  const handleUpdateStat = (index: number, field: 'label' | 'value', val: string) => {
    setHome((prev) => ({
      ...prev,
      statistics_json: (prev.statistics_json || []).map((s, i) =>
        i === index ? { ...s, [field]: val } : s
      ),
    }));
  };

  const handleUpdateStatImages = (index: number, images: string[]) => {
    setHome((prev) => ({
      ...prev,
      statistics_json: (prev.statistics_json || []).map((s, i) =>
        i === index ? { ...s, images } : s
      ),
    }));
  };

  // Marquee Handlers
  const handleAddMarqueeItem = () => {
    setHome((prev) => ({
      ...prev,
      marquee_items_json: [...(prev.marquee_items_json || []), 'New Discipline'],
    }));
  };

  const handleRemoveMarqueeItem = (index: number) => {
    setHome((prev) => ({
      ...prev,
      marquee_items_json: (prev.marquee_items_json || []).filter((_, i) => i !== index),
    }));
  };

  const handleUpdateMarqueeItem = (index: number, val: string) => {
    setHome((prev) => ({
      ...prev,
      marquee_items_json: (prev.marquee_items_json || []).map((w, i) => (i === index ? val : w)),
    }));
  };

  // FAQ Handlers
  const handleAddFaq = () => {
    const newFaq: FaqItem = {
      id: 'faq-' + Date.now(),
      question: 'New question?',
      answer: 'Answer goes here...',
    };
    setFaqs((prev) => [...prev, newFaq]);
  };

  const handleRemoveFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  const handleMoveFaq = (index: number, direction: 'up' | 'down') => {
    const items = [...faqs];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;
    setFaqs(items);
  };

  const handleUpdateFaq = (id: string, field: keyof FaqItem, val: string) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: val } : f)));
  };

  const SectionHeader = ({
    id,
    number,
    title,
    count,
  }: {
    id: string;
    number: string;
    title: string;
    count?: number;
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-zinc-950/50 border-b border-slate-200/60 dark:border-zinc-800 text-left font-bold text-slate-900 dark:text-zinc-100 text-sm hover:bg-slate-100/50 dark:hover:bg-zinc-900/50 transition-colors"
    >
      <span className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-mono">
          {number}
        </span>
        <span>
          {title}
          {count !== undefined ? ` (${count})` : ''}
        </span>
      </span>
      {openSections[id] ? (
        <ChevronUp className="w-4 h-4 text-slate-400" />
      ) : (
        <ChevronDown className="w-4 h-4 text-slate-400" />
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">Homepage CMS</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Sections below follow the actual homepage order, top to bottom. Saved directly to MySQL.
            </p>
          </div>
        </div>
      </div>

      {saveStatus && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold border ${
            saveStatus.includes('Failed') || saveStatus.includes('failed')
              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
              : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
          }`}
        >
          {saveStatus}
        </div>
      )}

      {loading ? (
        <div className="p-10 text-center text-xs text-slate-400">Loading homepage content...</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          {/* SECTION 1: HERO */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <SectionHeader id="hero" number="01" title="Hero" />
            {openSections.hero && (
              <div className="p-5 space-y-4 text-xs">
                <DeviceImageUpload
                  label="Hero Background Image"
                  value={site.heroBackgroundImage}
                  onChange={(url) => setSite((prev) => ({ ...prev, heroBackgroundImage: url }))}
                  category="homepage"
                />

                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Heading</label>
                  <Input
                    type="text"
                    value={home.hero_heading || ''}
                    onChange={(e) => setHome((prev) => ({ ...prev, hero_heading: e.target.value }))}
                    placeholder="Crafting Digital Monuments with Sequential Comic Precision"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    The final word is automatically rendered in the accent color.
                  </p>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Subtitle</label>
                  <Textarea
                    rows={3}
                    value={home.hero_subtitle || ''}
                    onChange={(e) => setHome((prev) => ({ ...prev, hero_subtitle: e.target.value }))}
                    placeholder="Comic Art Studio operates as an independent design laboratory..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                    <div className="font-semibold text-slate-700 dark:text-zinc-300">Button 1 (Primary)</div>
                    <div>
                      <label className="block text-slate-600 dark:text-zinc-400 mb-1">Text</label>
                      <Input
                        type="text"
                        value={home.hero_cta_primary_text || ''}
                        onChange={(e) => setHome((prev) => ({ ...prev, hero_cta_primary_text: e.target.value }))}
                        placeholder="Chat With Us"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-zinc-400 mb-1">Link / URL</label>
                      <Input
                        type="text"
                        value={home.hero_cta_primary_url || ''}
                        onChange={(e) => setHome((prev) => ({ ...prev, hero_cta_primary_url: e.target.value }))}
                        placeholder="Leave empty or '#' to open the chat widget"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Empty or "#" opens the live chat widget (original behavior). An internal path
                      (e.g. "/projects") navigates there. A full https:// URL opens in a new tab —
                      use this for a backlink to another site.
                    </p>
                  </div>
                  <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                    <div className="font-semibold text-slate-700 dark:text-zinc-300">Button 2 (Secondary)</div>
                    <div>
                      <label className="block text-slate-600 dark:text-zinc-400 mb-1">Text</label>
                      <Input
                        type="text"
                        value={home.hero_cta_secondary_text || ''}
                        onChange={(e) => setHome((prev) => ({ ...prev, hero_cta_secondary_text: e.target.value }))}
                        placeholder="View Portfolio"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-zinc-400 mb-1">Link / URL</label>
                      <Input
                        type="text"
                        value={home.hero_cta_secondary_url || ''}
                        onChange={(e) => setHome((prev) => ({ ...prev, hero_cta_secondary_url: e.target.value }))}
                        placeholder="Leave empty or '#' to go to /projects"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Empty or "#" goes to the Projects page (original behavior). Same URL rules as Button 1.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: COMIC PANEL */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <SectionHeader id="comic" number="02" title="Comic Panel" />
            {openSections.comic && (
              <div className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Heading</label>
                  <Input
                    type="text"
                    value={site.comicPanelHeading}
                    onChange={(e) => setSite((prev) => ({ ...prev, comicPanelHeading: e.target.value }))}
                    placeholder="Comic Panels"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    The final word is automatically rendered in the accent color.
                  </p>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Subtitle</label>
                  <Textarea
                    rows={2}
                    value={site.comicPanelSubtitle}
                    onChange={(e) => setSite((prev) => ({ ...prev, comicPanelSubtitle: e.target.value }))}
                    placeholder="Immerse yourself in cinematic storytelling..."
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                    <div className="font-semibold text-slate-700 dark:text-zinc-300">
                      Comic Panel 1 ({site.comicPanel1Images.length} image{site.comicPanel1Images.length === 1 ? '' : 's'})
                    </div>
                    <DeviceMultiImageUpload
                      values={site.comicPanel1Images}
                      onChange={(urls) => setSite((prev) => ({ ...prev, comicPanel1Images: urls }))}
                      category="comic-panels"
                    />
                  </div>
                  <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                    <div className="font-semibold text-slate-700 dark:text-zinc-300">
                      Comic Panel 2 ({site.comicPanel2Images.length} image{site.comicPanel2Images.length === 1 ? '' : 's'})
                    </div>
                    <DeviceMultiImageUpload
                      values={site.comicPanel2Images}
                      onChange={(urls) => setSite((prev) => ({ ...prev, comicPanel2Images: urls }))}
                      category="comic-panels"
                    />
                  </div>
                  <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                    <div className="font-semibold text-slate-700 dark:text-zinc-300">
                      Comic Panel 3 ({site.comicPanel3Images.length} image{site.comicPanel3Images.length === 1 ? '' : 's'})
                    </div>
                    <DeviceMultiImageUpload
                      values={site.comicPanel3Images}
                      onChange={(urls) => setSite((prev) => ({ ...prev, comicPanel3Images: urls }))}
                      category="comic-panels"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Each panel loops through its own images independently, exactly like before — only
                  the number of images per panel changed from fixed-at-one to however many you add here.
                </p>
              </div>
            )}
          </div>

          {/* SECTION 3: MARQUEE */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <SectionHeader id="marquee" number="03" title="Marquee Ribbon" count={(home.marquee_items_json || []).length} />
            {openSections.marquee && (
              <div className="p-5 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(home.marquee_items_json || []).map((word, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={word}
                        onChange={(e) => handleUpdateMarqueeItem(index, e.target.value)}
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMarqueeItem(index)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleAddMarqueeItem}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Word
                </Button>
                <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 max-w-xs">
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                    Speed (seconds per loop — lower is faster)
                  </label>
                  <Input
                    type="number"
                    min={5}
                    max={120}
                    value={site.marqueeSpeed}
                    onChange={(e) => setSite((prev) => ({ ...prev, marqueeSpeed: e.target.value }))}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Default is 30. Leave as-is if unsure.</p>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: PROJECTS (homepage preview) */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <SectionHeader id="projects" number="04" title="Projects" />
            {openSections.projects && (
              <div className="p-5 space-y-4 text-xs">
                <p className="text-slate-500 dark:text-zinc-400">
                  This only controls the heading, subtitle, and how many projects show on the homepage.
                  The projects themselves come from Content Management → Project — add or edit them
                  there and they'll automatically appear here.
                </p>
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Heading</label>
                  <Input
                    type="text"
                    value={site.projectsHeading}
                    onChange={(e) => setSite((prev) => ({ ...prev, projectsHeading: e.target.value }))}
                    placeholder="Take a Look at Our Projects"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Subtitle</label>
                  <Textarea
                    rows={2}
                    value={site.projectsSubtitle}
                    onChange={(e) => setSite((prev) => ({ ...prev, projectsSubtitle: e.target.value }))}
                    placeholder="Discover Comic Art Studio's portfolio..."
                  />
                </div>
                <div className="max-w-xs">
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                    Number of Projects to Display
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    value={site.projectsCount}
                    onChange={(e) => setSite((prev) => ({ ...prev, projectsCount: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 5: STUDIO PREVIEW / STORY / MISSION / VISION / PHILOSOPHY / STATISTICS */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <SectionHeader id="studio" number="05" title="Studio / Statistics" />
            {openSections.studio && (
              <div className="p-5 space-y-6 text-xs">
                <p className="text-slate-500 dark:text-zinc-400">
                  This is the "Origin & Craft" studio preview section further down the homepage.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Story Title</label>
                    <Input
                      type="text"
                      value={home.story_title || ''}
                      onChange={(e) => setHome((prev) => ({ ...prev, story_title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Story Subtitle</label>
                    <Input
                      type="text"
                      value={home.story_subtitle || ''}
                      onChange={(e) => setHome((prev) => ({ ...prev, story_subtitle: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                      Story Content (paragraphs)
                    </label>
                    <Textarea
                      rows={6}
                      value={home.story_content || ''}
                      onChange={(e) => setHome((prev) => ({ ...prev, story_content: e.target.value }))}
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Press Enter once between paragraphs. Each line becomes its own justified paragraph
                      on the homepage.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-zinc-800">
                  <p className="text-slate-500 dark:text-zinc-400">
                    "Our Process" (the numbered timeline shown below the story) is edited from
                    Content Management → Studio → Process Steps — the same data powers both this
                    homepage section and the Studio page, so there's one place to manage it.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 space-y-3">
                  <div className="font-bold text-slate-700 dark:text-zinc-300">
                    Statistics ({(home.statistics_json || []).length})
                  </div>
                  {(home.statistics_json || []).map((stat, index) => (
                    <div key={index} className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2">
                      <div className="flex items-center gap-3">
                        <Input
                          type="text"
                          value={stat.label}
                          onChange={(e) => handleUpdateStat(index, 'label', e.target.value)}
                          placeholder="Label"
                          className="flex-1"
                        />
                        <Input
                          type="text"
                          value={stat.value}
                          onChange={(e) => handleUpdateStat(index, 'value', e.target.value)}
                          placeholder="Value (e.g. 148+, 99.8%, $1M)"
                          className="w-40"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveStat(index)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <DeviceMultiImageUpload
                        values={stat.images || []}
                        onChange={(urls) => handleUpdateStatImages(index, urls)}
                        category="studio"
                      />
                      <p className="text-[11px] text-slate-400">
                        Add up to several images ({(stat.images || []).length} added) — they cycle
                        through the same popup animation as before.
                      </p>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={handleAddStat}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Statistic
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 6: FAQ */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <SectionHeader id="faq" number="06" title="FAQ" count={faqs.length} />
            {openSections.faq && (
              <div className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Heading</label>
                  <Input
                    type="text"
                    value={site.faqHeading}
                    onChange={(e) => setSite((prev) => ({ ...prev, faqHeading: e.target.value }))}
                    placeholder="Frequently Asked Questions"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Subtitle</label>
                  <Textarea
                    rows={2}
                    value={site.faqSubtitle}
                    onChange={(e) => setSite((prev) => ({ ...prev, faqSubtitle: e.target.value }))}
                    placeholder="Clear answers regarding our engagement methodology..."
                  />
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-zinc-800">
                  {faqs.map((faq, index) => (
                    <div key={faq.id} className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-zinc-100">FAQ #{index + 1}</span>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => handleMoveFaq(index, 'up')} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => handleMoveFaq(index, 'down')} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => handleRemoveFaq(faq.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <Input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleUpdateFaq(faq.id, 'question', e.target.value)}
                        placeholder="Question"
                      />
                      <Textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => handleUpdateFaq(faq.id, 'answer', e.target.value)}
                        placeholder="Answer"
                      />
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={handleAddFaq}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add FAQ
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 7: CONTACT / CTA */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <SectionHeader id="contact" number="07" title="Contact / CTA" />
            {openSections.contact && (
              <div className="p-5 space-y-4 text-xs">
                <p className="text-slate-500 dark:text-zinc-400">
                  The homepage closes with the Contact form, which is already fully editable from
                  Forms → Contact Page Editor — no changes made here. The fields below save to the
                  database for a possible future CTA banner, but nothing on the page displays them yet.
                </p>
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Heading</label>
                  <Input
                    type="text"
                    value={home.cta_title || ''}
                    onChange={(e) => setHome((prev) => ({ ...prev, cta_title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Subtitle</label>
                  <Textarea
                    rows={2}
                    value={home.cta_subtitle || ''}
                    onChange={(e) => setHome((prev) => ({ ...prev, cta_subtitle: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Button Text</label>
                    <Input
                      type="text"
                      value={home.cta_button_text || ''}
                      onChange={(e) => setHome((prev) => ({ ...prev, cta_button_text: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Button URL</label>
                    <Input
                      type="text"
                      value={home.cta_button_url || ''}
                      onChange={(e) => setHome((prev) => ({ ...prev, cta_button_url: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Save Action */}
          <div className="pt-4 flex justify-end">
            <Button variant="primary" size="md" type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-1.5" />
              {saving ? 'Saving to Database...' : 'Save Homepage Content'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
