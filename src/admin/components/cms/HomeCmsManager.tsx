import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Textarea, DeviceImageUpload } from '../ui';
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

export const HomeCmsManager: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const [home, setHome] = useState<HomepageContent>(defaultHomepageData);
  const [heroBackgroundImage, setHeroBackgroundImage] = useState('');
  const [faqs, setFaqs] = useState<FaqItem[]>(defaultFaqs);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    hero: true,
    story: true,
    stats: true,
    marquee: true,
    faq: true,
    cta: true,
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

  // Hero background image and FAQ list live in the generic settings store
  // (there is no dedicated column for them in homepage_content), same pattern
  // already used for contact_artist_image etc.
  useEffect(() => {
    if (settings?.hero_background_image !== undefined) {
      setHeroBackgroundImage(settings.hero_background_image);
    }
    if (settings?.homepage_faqs) {
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
          hero_background_image: heroBackgroundImage,
          homepage_faqs: JSON.stringify(faqs),
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
    const newStat: HomepageStat = { label: 'New Metric', value: '0' };
    setHome((prev) => ({ ...prev, statistics_json: [...(prev.statistics_json || []), newStat] }));
  };

  const handleRemoveStat = (index: number) => {
    setHome((prev) => ({
      ...prev,
      statistics_json: (prev.statistics_json || []).filter((_, i) => i !== index),
    }));
  };

  const handleUpdateStat = (index: number, field: keyof HomepageStat, val: string) => {
    setHome((prev) => ({
      ...prev,
      statistics_json: (prev.statistics_json || []).map((s, i) =>
        i === index ? { ...s, [field]: val } : s
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
              Edit hero, story, statistics, marquee, FAQ, and CTA content. Saved directly to MySQL.
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
            <button
              type="button"
              onClick={() => toggleSection('hero')}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-zinc-950/50 border-b border-slate-200/60 dark:border-zinc-800 text-left font-bold text-slate-900 dark:text-zinc-100 text-sm hover:bg-slate-100/50 dark:hover:bg-zinc-900/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-mono">01</span>
                <span>Hero Section</span>
              </span>
              {openSections.hero ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.hero && (
              <div className="p-5 space-y-4 text-xs">
                <DeviceImageUpload
                  label="Hero Background Image"
                  value={heroBackgroundImage}
                  onChange={setHeroBackgroundImage}
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
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Primary Button Text</label>
                    <Input
                      type="text"
                      value={home.hero_cta_primary_text || ''}
                      onChange={(e) => setHome((prev) => ({ ...prev, hero_cta_primary_text: e.target.value }))}
                      placeholder="Chat With Us"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      This button always opens the live chat widget; only its label is editable here.
                    </p>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Secondary Button Text</label>
                    <Input
                      type="text"
                      value={home.hero_cta_secondary_text || ''}
                      onChange={(e) => setHome((prev) => ({ ...prev, hero_cta_secondary_text: e.target.value }))}
                      placeholder="View Portfolio"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      This button always navigates to the Projects page; only its label is editable here.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: STORY / MISSION / VISION / PHILOSOPHY */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('story')}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-zinc-950/50 border-b border-slate-200/60 dark:border-zinc-800 text-left font-bold text-slate-900 dark:text-zinc-100 text-sm hover:bg-slate-100/50 dark:hover:bg-zinc-900/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-mono">02</span>
                <span>Story, Mission, Vision & Philosophy</span>
              </span>
              {openSections.story ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.story && (
              <div className="p-5 space-y-4 text-xs">
                <p className="text-slate-500 dark:text-zinc-400">
                  This content also powers the "Origin & Craft" preview section on the homepage
                  (heading, story, mission/vision/philosophy cards, and statistics).
                </p>
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
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Story Content</label>
                  <Textarea
                    rows={4}
                    value={home.story_content || ''}
                    onChange={(e) => setHome((prev) => ({ ...prev, story_content: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Mission Statement</label>
                    <Textarea
                      rows={3}
                      value={home.mission_statement || ''}
                      onChange={(e) => setHome((prev) => ({ ...prev, mission_statement: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Vision Statement</label>
                    <Textarea
                      rows={3}
                      value={home.vision_statement || ''}
                      onChange={(e) => setHome((prev) => ({ ...prev, vision_statement: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Philosophy Statement</label>
                    <Textarea
                      rows={3}
                      value={home.philosophy_statement || ''}
                      onChange={(e) => setHome((prev) => ({ ...prev, philosophy_statement: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: STATISTICS */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('stats')}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-zinc-950/50 border-b border-slate-200/60 dark:border-zinc-800 text-left font-bold text-slate-900 dark:text-zinc-100 text-sm hover:bg-slate-100/50 dark:hover:bg-zinc-900/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-mono">03</span>
                <span>Statistics ({(home.statistics_json || []).length})</span>
              </span>
              {openSections.stats ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.stats && (
              <div className="p-5 space-y-3 text-xs">
                {(home.statistics_json || []).map((stat, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
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
                      placeholder="Value"
                      className="w-24"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveStat(index)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={handleAddStat}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Statistic
                </Button>
              </div>
            )}
          </div>

          {/* SECTION 4: MARQUEE */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('marquee')}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-zinc-950/50 border-b border-slate-200/60 dark:border-zinc-800 text-left font-bold text-slate-900 dark:text-zinc-100 text-sm hover:bg-slate-100/50 dark:hover:bg-zinc-900/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-mono">04</span>
                <span>Marquee Ribbon ({(home.marquee_items_json || []).length})</span>
              </span>
              {openSections.marquee ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

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
              </div>
            )}
          </div>

          {/* SECTION 5: FAQ */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('faq')}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-zinc-950/50 border-b border-slate-200/60 dark:border-zinc-800 text-left font-bold text-slate-900 dark:text-zinc-100 text-sm hover:bg-slate-100/50 dark:hover:bg-zinc-900/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-mono">05</span>
                <span>FAQ ({faqs.length})</span>
              </span>
              {openSections.faq ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.faq && (
              <div className="p-5 space-y-3 text-xs">
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
            )}
          </div>

          {/* SECTION 6: CTA BANNER FIELDS (reserved for future use) */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('cta')}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-zinc-950/50 border-b border-slate-200/60 dark:border-zinc-800 text-left font-bold text-slate-900 dark:text-zinc-100 text-sm hover:bg-slate-100/50 dark:hover:bg-zinc-900/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-mono">06</span>
                <span>CTA Banner Content</span>
              </span>
              {openSections.cta ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.cta && (
              <div className="p-5 space-y-4 text-xs">
                <p className="text-slate-500 dark:text-zinc-400">
                  Note: the homepage currently uses the Contact form (Forms → Contact Page Editor) as its closing
                  call-to-action, so this content is not yet rendered anywhere on the page. It is saved to the
                  database and available for a future CTA banner section without requiring further backend work.
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
