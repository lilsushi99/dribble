import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Textarea, DeviceMultiImageUpload } from '../ui';
import { adminApi } from '../../services/adminApi';
import { StudioPageData, StatCardItem, ValueCardItem } from '../../types/admin.types';
import { Sparkles, Save, ChevronDown, ChevronUp, Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Eye } from 'lucide-react';

export const StudioCmsManager: React.FC = () => {
  const [studio, setStudio] = useState<StudioPageData>({
    intro_heading: 'Engineering digital monuments with architectural discipline.',
    intro_subtitle: 'KINETIC operates as an independent design laboratory bridging physical motion architecture, editorial visual identity, and high-performance digital systems.',
    story_heading: 'The Origin & Craft',
    story_content: 'Founded in 2018, KINETIC emerged from a conviction that modern digital interfaces had succumbed to disposable SaaS visual formulas, homogenized component libraries, and visual noise. With over eight years of international practice, our partners approach digital architecture with the same material gravity, tactile inertia, and editorial permanence as stone, steel, and light.',
    stats_cards: [
      { id: '1', title: 'Clients Served', value: '82', images: [] },
      { id: '2', title: 'Projects Delivered', value: '120', images: [] },
      { id: '3', title: 'Countries', value: '14', images: [] },
      { id: '4', title: 'Awards', value: '6', images: [] },
    ],
    value_cards: [
      { id: '1', title: 'Discover', description: 'We start by understanding your goals, audience, and the story you need told, grounding every decision in a clear creative brief.' },
      { id: '2', title: 'Design', description: 'Concepts, character studies, and layout exploration follow, refined through iteration until the direction feels right.' },
      { id: '3', title: 'Create', description: 'Full production begins: inking, coloring, and page assembly, crafted with the same discipline at every stage.' },
      { id: '4', title: 'Deliver', description: 'Final review, polish, and handoff of production-ready files, with support available after launch.' },
    ],
    show_comic_panel: true,
    show_counter: true,
    cta_heading: "You've seen how we think. Now explore what we've built.",
    cta_description: 'Examine our curated archive of interactive monuments, physical artefacts, and digital brand architecture.',
    cta_button_text: 'Explore Selected Projects',
    cta_button_url: '/projects',
    show_cta: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Accordion open/close state for the 7 sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    intro: true,
    story: true,
    stats: true,
    values: true,
    comic: true,
    counter: true,
    cta: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const loadStudio = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getStudioData();
      if (data) {
        setStudio({
          ...data,
          stats_cards: data.stats_cards || [],
          value_cards: data.value_cards || [],
        });
      }
    } catch (e) {
      console.error('Failed to load studio data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudio();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await adminApi.updateStudioData(studio);
      setStudio(updated);
      alert('Studio Page content saved successfully to MySQL database!');
    } catch (err: any) {
      alert(err.message || 'Failed to save studio data');
    } finally {
      setSaving(false);
    }
  };

  // Stats Cards Handlers
  const handleAddStatCard = () => {
    const newCard: StatCardItem = {
      id: Date.now().toString(),
      title: 'New Metric',
      value: '100',
      images: [],
    };
    setStudio((prev) => ({ ...prev, stats_cards: [...prev.stats_cards, newCard] }));
  };

  const handleRemoveStatCard = (id: string) => {
    setStudio((prev) => ({
      ...prev,
      stats_cards: prev.stats_cards.filter((c) => c.id !== id),
    }));
  };

  const handleMoveStatCard = (index: number, direction: 'up' | 'down') => {
    const cards = [...studio.stats_cards];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= cards.length) return;
    const temp = cards[index];
    cards[index] = cards[targetIdx];
    cards[targetIdx] = temp;
    setStudio((prev) => ({ ...prev, stats_cards: cards }));
  };

  const handleUpdateStatCard = (id: string, field: keyof StatCardItem, val: any) => {
    setStudio((prev) => ({
      ...prev,
      stats_cards: prev.stats_cards.map((c) => (c.id === id ? { ...c, [field]: val } : c)),
    }));
  };

  // Value Cards Handlers
  const handleAddValueCard = () => {
    const newCard: ValueCardItem = {
      id: Date.now().toString(),
      title: 'New Value',
      description: 'Describe your vision, goals, or philosophy...',
    };
    setStudio((prev) => ({ ...prev, value_cards: [...prev.value_cards, newCard] }));
  };

  const handleRemoveValueCard = (id: string) => {
    setStudio((prev) => ({
      ...prev,
      value_cards: prev.value_cards.filter((c) => c.id !== id),
    }));
  };

  const handleMoveValueCard = (index: number, direction: 'up' | 'down') => {
    const cards = [...studio.value_cards];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= cards.length) return;
    const temp = cards[index];
    cards[index] = cards[targetIdx];
    cards[targetIdx] = temp;
    setStudio((prev) => ({ ...prev, value_cards: cards }));
  };

  const handleUpdateValueCard = (id: string, field: keyof ValueCardItem, val: string) => {
    setStudio((prev) => ({
      ...prev,
      value_cards: prev.value_cards.map((c) => (c.id === id ? { ...c, [field]: val } : c)),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">Studio CMS</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Manage all 7 sections of the Studio page with MySQL backend sync.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-1.5" />
            {saving ? 'Saving...' : 'Save Studio Content'}
          </Button>
        </div>
      </div>

      {loading ? (
        <Card className="p-12 text-center text-xs text-slate-500">Loading Studio Page Content...</Card>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          {/* SECTION 1: STUDIO INTRODUCTION */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('intro')}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-zinc-950/50 border-b border-slate-200/60 dark:border-zinc-800 text-left font-bold text-slate-900 dark:text-zinc-100 text-sm hover:bg-slate-100/50 dark:hover:bg-zinc-900/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-mono">01</span>
                <span>Studio Introduction</span>
              </span>
              {openSections.intro ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.intro && (
              <div className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Main Heading</label>
                  <Input
                    type="text"
                    value={studio.intro_heading || ''}
                    onChange={(e) => setStudio((prev) => ({ ...prev, intro_heading: e.target.value }))}
                    placeholder="Engineering digital monuments with architectural discipline."
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Subtitle</label>
                  <Textarea
                    rows={3}
                    value={studio.intro_subtitle || ''}
                    onChange={(e) => setStudio((prev) => ({ ...prev, intro_subtitle: e.target.value }))}
                    placeholder="KINETIC operates as an independent design laboratory..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: STUDIO STORY */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('story')}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-zinc-950/50 border-b border-slate-200/60 dark:border-zinc-800 text-left font-bold text-slate-900 dark:text-zinc-100 text-sm hover:bg-slate-100/50 dark:hover:bg-zinc-900/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-mono">02</span>
                <span>Studio Story</span>
              </span>
              {openSections.story ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.story && (
              <div className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Story Heading</label>
                  <Input
                    type="text"
                    value={studio.story_heading || ''}
                    onChange={(e) => setStudio((prev) => ({ ...prev, story_heading: e.target.value }))}
                    placeholder="The Origin & Craft"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Long Story Paragraph</label>
                  <Textarea
                    rows={5}
                    value={studio.story_content || ''}
                    onChange={(e) => setStudio((prev) => ({ ...prev, story_content: e.target.value }))}
                    placeholder="Founded in 2018, KINETIC emerged from a conviction..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: STATISTICS CARDS */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('stats')}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-zinc-950/50 border-b border-slate-200/60 dark:border-zinc-800 text-left font-bold text-slate-900 dark:text-zinc-100 text-sm hover:bg-slate-100/50 dark:hover:bg-zinc-900/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-mono">03</span>
                <span>Statistics Cards ({studio.stats_cards.length} Cards)</span>
              </span>
              {openSections.stats ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.stats && (
              <div className="p-5 space-y-6 text-xs">
                <div className="flex items-center justify-between">
                  <p className="text-slate-500 dark:text-zinc-400 text-xs">
                    Add, edit, or reorder statistics cards. Each card can upload multiple hover images (Upload from Device Only).
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddStatCard}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Statistics Card
                  </Button>
                </div>

                <div className="space-y-4">
                  {studio.stats_cards.map((card, idx) => (
                    <div
                      key={card.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/70 space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-zinc-800 pb-2">
                        <div className="font-bold text-slate-800 dark:text-zinc-200 text-xs flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span>Card: {card.title || 'Untitled'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveStatCard(idx, 'up')}
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-500 disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === studio.stats_cards.length - 1}
                            onClick={() => handleMoveStatCard(idx, 'down')}
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-500 disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveStatCard(card.id)}
                            className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-500 cursor-pointer ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Card Title</label>
                          <Input
                            type="text"
                            value={card.title}
                            onChange={(e) => handleUpdateStatCard(card.id, 'title', e.target.value)}
                            placeholder="e.g. Clients Served"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Numeric Value</label>
                          <Input
                            type="text"
                            value={card.value}
                            onChange={(e) => handleUpdateStatCard(card.id, 'value', e.target.value)}
                            placeholder="e.g. 82 or 120 or 14"
                          />
                        </div>
                      </div>

                      <DeviceMultiImageUpload
                        label="Hover Images (Upload from Device Only)"
                        values={card.images || []}
                        onChange={(urls) => handleUpdateStatCard(card.id, 'images', urls)}
                        category="studio_metrics"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: MISSION, VISION, PHILOSOPHY (VALUE CARDS) */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('values')}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-zinc-950/50 border-b border-slate-200/60 dark:border-zinc-800 text-left font-bold text-slate-900 dark:text-zinc-100 text-sm hover:bg-slate-100/50 dark:hover:bg-zinc-900/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-mono">04</span>
                <span>Process Steps ({studio.value_cards.length} Steps)</span>
              </span>
              {openSections.values ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.values && (
              <div className="p-5 space-y-6 text-xs">
                <div className="flex items-center justify-between">
                  <p className="text-slate-500 dark:text-zinc-400 text-xs">
                    Displayed as a numbered timeline (Step 1 → 2 → 3 → 4...) on the Studio page.
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddValueCard}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Step
                  </Button>
                </div>

                <div className="space-y-4">
                  {studio.value_cards.map((card, idx) => (
                    <div
                      key={card.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/70 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-zinc-800 pb-2">
                        <div className="font-bold text-slate-800 dark:text-zinc-200 text-xs flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span>Card: {card.title || 'Untitled'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveValueCard(idx, 'up')}
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-500 disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === studio.value_cards.length - 1}
                            onClick={() => handleMoveValueCard(idx, 'down')}
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-500 disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveValueCard(card.id)}
                            className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-500 cursor-pointer ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Title (Optional)</label>
                        <Input
                          type="text"
                          value={card.title || ''}
                          onChange={(e) => handleUpdateValueCard(card.id, 'title', e.target.value)}
                          placeholder="e.g. Mission / Vision / Philosophy / Goals"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Description</label>
                        <Textarea
                          rows={3}
                          value={card.description}
                          onChange={(e) => handleUpdateValueCard(card.id, 'description', e.target.value)}
                          placeholder="Describe this pillar..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 5: COMIC PANEL COMPONENT TOGGLE */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('comic')}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-zinc-950/50 border-b border-slate-200/60 dark:border-zinc-800 text-left font-bold text-slate-900 dark:text-zinc-100 text-sm hover:bg-slate-100/50 dark:hover:bg-zinc-900/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-mono">05</span>
                <span>Comic Panel Component</span>
              </span>
              {openSections.comic ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.comic && (
              <div className="p-5 text-xs space-y-3">
                <p className="text-slate-500 dark:text-zinc-400">
                  Note: The Comic Panel artwork editor already exists in the Layout Builder. Use this setting to toggle display on the Studio Page.
                </p>
                <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!studio.show_comic_panel}
                    onChange={(e) => setStudio((prev) => ({ ...prev, show_comic_panel: e.target.checked }))}
                    className="w-5 h-5 rounded border-slate-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-zinc-100">Show Comic Panel on Studio Page</span>
                    <p className="text-[11px] text-slate-400">Renders the interactive sequential artwork manifesto panel on the Studio Page.</p>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* SECTION 6: COUNTER COMPONENT TOGGLE */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('counter')}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-zinc-950/50 border-b border-slate-200/60 dark:border-zinc-800 text-left font-bold text-slate-900 dark:text-zinc-100 text-sm hover:bg-slate-100/50 dark:hover:bg-zinc-900/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-mono">06</span>
                <span>Counter Component</span>
              </span>
              {openSections.counter ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.counter && (
              <div className="p-5 text-xs space-y-3">
                <p className="text-slate-500 dark:text-zinc-400">
                  Reuses existing counter configuration. Toggle whether counting animation is enabled for Statistics Cards.
                </p>
                <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!studio.show_counter}
                    onChange={(e) => setStudio((prev) => ({ ...prev, show_counter: e.target.checked }))}
                    className="w-5 h-5 rounded border-slate-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-zinc-100">Enable Animated Counter</span>
                    <p className="text-[11px] text-slate-400">Animates statistics card numbers from zero when scrolled into view.</p>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* SECTION 7: FINAL CTA */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('cta')}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-zinc-950/50 border-b border-slate-200/60 dark:border-zinc-800 text-left font-bold text-slate-900 dark:text-zinc-100 text-sm hover:bg-slate-100/50 dark:hover:bg-zinc-900/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-mono">07</span>
                <span>Final CTA Section</span>
              </span>
              {openSections.cta ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.cta && (
              <div className="p-5 space-y-4 text-xs">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={!!studio.show_cta}
                    onChange={(e) => setStudio((prev) => ({ ...prev, show_cta: e.target.checked }))}
                    className="w-5 h-5 rounded border-slate-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-zinc-100">Show Final CTA Section</span>
                    <p className="text-[11px] text-slate-400">Display the call-to-action block at the bottom of the Studio Page.</p>
                  </div>
                </label>

                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Heading</label>
                  <Input
                    type="text"
                    value={studio.cta_heading || ''}
                    onChange={(e) => setStudio((prev) => ({ ...prev, cta_heading: e.target.value }))}
                    placeholder="You've seen how we think. Now explore what we've built."
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Description</label>
                  <Textarea
                    rows={2}
                    value={studio.cta_description || ''}
                    onChange={(e) => setStudio((prev) => ({ ...prev, cta_description: e.target.value }))}
                    placeholder="Examine our curated archive of interactive monuments..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Button Text</label>
                    <Input
                      type="text"
                      value={studio.cta_button_text || ''}
                      onChange={(e) => setStudio((prev) => ({ ...prev, cta_button_text: e.target.value }))}
                      placeholder="Explore Selected Projects"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Button URL (Internal or External)</label>
                    <Input
                      type="text"
                      value={studio.cta_button_url || ''}
                      onChange={(e) => setStudio((prev) => ({ ...prev, cta_button_url: e.target.value }))}
                      placeholder="/projects or https://..."
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
              {saving ? 'Saving to Database...' : 'Save Studio Content'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
