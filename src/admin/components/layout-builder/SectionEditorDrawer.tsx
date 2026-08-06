import React, { useState, useEffect } from 'react';
import { LayoutSection } from '../../types/admin.types';
import { Drawer, Input, Switch, Button, DeviceImageUpload, DeviceMultiImageUpload } from '../ui';
import { Save, Sparkles, Type, Link, Layers, Plus, Trash2, HelpCircle, Film, SlidersHorizontal, Palette, ArrowUp, ArrowDown } from 'lucide-react';

export interface SectionEditorDrawerProps {
  isOpen: boolean;
  section: LayoutSection | null;
  onClose: () => void;
  onSave: (updated: LayoutSection) => Promise<void>;
  onOpenMediaPicker?: (onSelect: (url: string) => void) => void;
}

export const SectionEditorDrawer: React.FC<SectionEditorDrawerProps> = ({
  isOpen,
  section,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<LayoutSection | null>(section);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(section);
    setSaveError(null);
  }, [section]);

  if (!formData) return null;

  const handleChange = (field: keyof LayoutSection, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleCustomSettingChange = (key: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      const customSettings = { ...(prev.customSettings || {}), [key]: value };
      return { ...prev, customSettings };
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      // Keep the drawer open with the entered data intact and show the real reason
      // instead of closing regardless of whether the save actually succeeded.
      setSaveError(err?.message || 'Failed to save this section. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const key = formData.key.toLowerCase();
  const custom = formData.customSettings || {};

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Section: ${formData.name}`}
      subtitle={`Configure production CMS parameters specifically for the ${formData.name} section.`}
    >
      <form onSubmit={handleFormSubmit} className="space-y-6 pb-12">
        {/* Section Visibility Switch */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Section Visibility</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Toggle whether this section is displayed on the live site.</p>
          </div>
          <Switch
            label=""
            checked={formData.visible}
            onChange={(checked) => handleChange('visible', checked)}
          />
        </div>

        {/* ------------------- 1. HERO SECTION ------------------- */}
        {key === 'hero' && (
          <>
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <Type className="w-4 h-4" />
                <span>Hero Typography</span>
              </div>

              <Input
                label="Main Heading"
                value={formData.heading || ''}
                onChange={(e) => handleChange('heading', e.target.value)}
                placeholder="e.g. WE ENGINEER HIGH-INTENSITY DIGITAL EXPERIENCES"
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Sub Heading / Tagline
                </label>
                <textarea
                  rows={3}
                  value={formData.subheading || ''}
                  onChange={(e) => handleChange('subheading', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. A elite studio delivering kinetic web products and high-impact digital solutions."
                />
              </div>
            </div>

            <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <Link className="w-4 h-4" />
                <span>Call To Action Buttons</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">Primary Button (Default: Chat with Us)</span>
                <Input
                  label="Button Text"
                  value={formData.primaryButtonText || ''}
                  onChange={(e) => handleChange('primaryButtonText', e.target.value)}
                  placeholder="Chat with Us"
                />
                <Input
                  label="Destination URL (Internal e.g. /contact or External https://...)"
                  value={formData.primaryButtonLink || ''}
                  onChange={(e) => handleChange('primaryButtonLink', e.target.value)}
                  placeholder="/contact"
                />
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">Secondary Button (Default: View Project Portfolio)</span>
                <Input
                  label="Button Text"
                  value={formData.secondaryButtonText || ''}
                  onChange={(e) => handleChange('secondaryButtonText', e.target.value)}
                  placeholder="View Project Portfolio"
                />
                <Input
                  label="Destination URL (Internal e.g. /projects or External https://...)"
                  value={formData.secondaryButtonLink || ''}
                  onChange={(e) => handleChange('secondaryButtonLink', e.target.value)}
                  placeholder="/projects"
                />
              </div>
            </div>

            {/* Background Config */}
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <Palette className="w-4 h-4" />
                <span>Hero Background Configuration</span>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Background Type
                </label>
                <select
                  value={custom.bgType || 'image'}
                  onChange={(e) => handleCustomSettingChange('bgType', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value="image">Hero Image Background</option>
                  <option value="color">Solid Colour Background</option>
                </select>
              </div>

              {(custom.bgType || 'image') === 'image' ? (
                <DeviceImageUpload
                  label="Hero Background Image (Upload From Device Only)"
                  value={formData.imageUrl || ''}
                  onChange={(url) => handleChange('imageUrl', url)}
                  category="general"
                />
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Solid Background Colour
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={custom.bgColor || '#000000'}
                      onChange={(e) => handleCustomSettingChange('bgColor', e.target.value)}
                      className="w-12 h-10 rounded-lg cursor-pointer border border-slate-200 dark:border-zinc-800 bg-transparent"
                    />
                    <Input
                      label=""
                      value={custom.bgColor || '#000000'}
                      onChange={(e) => handleCustomSettingChange('bgColor', e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ------------------- 2. COMIC PANEL SECTION ------------------- */}
        {key === 'comic' && (
          <>
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <Type className="w-4 h-4" />
                <span>Comic Panel Copywriting</span>
              </div>

              <Input
                label="Main Heading"
                value={formData.heading || ''}
                onChange={(e) => handleChange('heading', e.target.value)}
                placeholder="e.g. STORIES IN MOTION"
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.subheading || ''}
                  onChange={(e) => handleChange('subheading', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Assembling our creative visual narratives panel by panel."
                />
              </div>
            </div>

            {/* Panel 1 */}
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <Film className="w-4 h-4 text-blue-500" />
                <span>Panel 1 (Left Comic Container)</span>
              </h4>
              <Input
                label="Animation Speed"
                value={custom.panel1Speed || '3.5s'}
                onChange={(e) => handleCustomSettingChange('panel1Speed', e.target.value)}
                placeholder="e.g. 3.5s"
              />
              <DeviceMultiImageUpload
                label="Upload Panel 1 Frame Burst Images (Upload From Device)"
                value={custom.panel1Images || []}
                onChange={(urls) => handleCustomSettingChange('panel1Images', urls)}
                category="comic_panels"
              />
            </div>

            {/* Panel 2 */}
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <Film className="w-4 h-4 text-blue-500" />
                <span>Panel 2 (Center Comic Container)</span>
              </h4>
              <Input
                label="Animation Speed"
                value={custom.panel2Speed || '2.8s'}
                onChange={(e) => handleCustomSettingChange('panel2Speed', e.target.value)}
                placeholder="e.g. 2.8s"
              />
              <DeviceMultiImageUpload
                label="Upload Panel 2 Frame Burst Images (Upload From Device)"
                value={custom.panel2Images || []}
                onChange={(urls) => handleCustomSettingChange('panel2Images', urls)}
                category="comic_panels"
              />
            </div>

            {/* Panel 3 */}
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <Film className="w-4 h-4 text-blue-500" />
                <span>Panel 3 (Right Comic Container)</span>
              </h4>
              <Input
                label="Animation Speed"
                value={custom.panel3Speed || '4.0s'}
                onChange={(e) => handleCustomSettingChange('panel3Speed', e.target.value)}
                placeholder="e.g. 4.0s"
              />
              <DeviceMultiImageUpload
                label="Upload Panel 3 Frame Burst Images (Upload From Device)"
                value={custom.panel3Images || []}
                onChange={(urls) => handleCustomSettingChange('panel3Images', urls)}
                category="comic_panels"
              />
            </div>
          </>
        )}

        {/* ------------------- 3. MARQUEE SECTION ------------------- */}
        {key === 'marquee' && (
          <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Marquee Ticker Configuration</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Top Row Words (Comma separated)
              </label>
              <textarea
                rows={3}
                value={custom.topRowWords || 'HIGH INTENSITY, BRAND IDENTITY, MOTION GRAPHICS, CUSTOM WEB, DESIGN SYSTEMS'}
                onChange={(e) => handleCustomSettingChange('topRowWords', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2 text-sm text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Bottom Row Words (Comma separated)
              </label>
              <textarea
                rows={3}
                value={custom.bottomRowWords || 'FULL-STACK DEVELOPMENT, EXPERIMENTAL DIGITAL, PRODUCT STRATEGY, ULTRA-PERFORMANT'}
                onChange={(e) => handleCustomSettingChange('bottomRowWords', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2 text-sm text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Animation Speed (e.g. 25s)"
                value={custom.marqueeSpeed || '25s'}
                onChange={(e) => handleCustomSettingChange('marqueeSpeed', e.target.value)}
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Scroll Direction
                </label>
                <select
                  value={custom.marqueeDirection || 'left-to-right'}
                  onChange={(e) => handleCustomSettingChange('marqueeDirection', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value="left-to-right">Left to Right</option>
                  <option value="right-to-left">Right to Left</option>
                </select>
              </div>
            </div>

            <Switch
              label="Pause on Hover"
              description="Pause marquee ticker scroll when mouse hovers over banner."
              checked={custom.pauseOnHover ?? true}
              onChange={(checked) => handleCustomSettingChange('pauseOnHover', checked)}
            />
          </div>
        )}

        {/* ------------------- 4. PROJECTS SECTION ------------------- */}
        {key === 'projects' && (
          <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <Type className="w-4 h-4" />
              <span>Project Section Parameters</span>
            </div>

            <Input
              label="Main Heading"
              value={formData.heading || ''}
              onChange={(e) => handleChange('heading', e.target.value)}
              placeholder="SELECTED WORKS"
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Description
              </label>
              <textarea
                rows={2}
                value={formData.subheading || ''}
                onChange={(e) => handleChange('subheading', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2 text-sm text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <Input
              label="Number of Projects To Display on Homepage"
              type="number"
              value={custom.limit || 6}
              onChange={(e) => handleCustomSettingChange('limit', parseInt(e.target.value, 10) || 6)}
            />
          </div>
        )}

        {/* ------------------- 5. STUDIO STORY SECTION ------------------- */}
        {key === 'studio' && (
          <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <Type className="w-4 h-4" />
              <span>Studio Story Editor</span>
            </div>

            <Input
              label="Main Heading"
              value={formData.heading || ''}
              onChange={(e) => handleChange('heading', e.target.value)}
              placeholder="OUR PHILOSOPHY & CRAFT"
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Studio Story (Long Text)
              </label>
              <textarea
                rows={6}
                value={formData.subheading || ''}
                onChange={(e) => handleChange('subheading', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2 text-sm text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                placeholder="We are a specialized digital atelier pushing the boundary of modern web engineering..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Button Text"
                value={formData.primaryButtonText || 'View Studio'}
                onChange={(e) => handleChange('primaryButtonText', e.target.value)}
              />
              <Input
                label="Button Destination URL"
                value={formData.primaryButtonLink || '/studio'}
                onChange={(e) => handleChange('primaryButtonLink', e.target.value)}
              />
            </div>

            {/* Mission / Vision / Philosophy Cards Management */}
            <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Mission / Vision / Philosophy Cards</span>
              </h4>

              <div className="space-y-3 p-3 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">01 / Mission Card</span>
                <Input
                  label="Mission Title"
                  value={custom.missionTitle || 'Eliminate Noise'}
                  onChange={(e) => handleCustomSettingChange('missionTitle', e.target.value)}
                />
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Mission Description
                  </label>
                  <textarea
                    rows={2}
                    value={custom.missionDesc || 'To strip away superfluous digital decoration and build quiet, high-contrast digital monuments that command immediate respect and lasting clarity.'}
                    onChange={(e) => handleCustomSettingChange('missionDesc', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-1.5 text-xs text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3 p-3 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">02 / Vision Card</span>
                <Input
                  label="Vision Title"
                  value={custom.visionTitle || 'Permanence & Inertia'}
                  onChange={(e) => handleCustomSettingChange('visionTitle', e.target.value)}
                />
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Vision Description
                  </label>
                  <textarea
                    rows={2}
                    value={custom.visionDesc || 'A web ecosystem where interactive architecture exhibits physical weight, tactile responsiveness, and editorial craftsmanship worthy of museum archival status.'}
                    onChange={(e) => handleCustomSettingChange('visionDesc', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-1.5 text-xs text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3 p-3 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">03 / Philosophy Card</span>
                <Input
                  label="Philosophy Title"
                  value={custom.philosophyTitle || 'Sculptural Rigor'}
                  onChange={(e) => handleCustomSettingChange('philosophyTitle', e.target.value)}
                />
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Philosophy Description
                  </label>
                  <textarea
                    rows={2}
                    value={custom.philosophyDesc || 'We treat layout margins, typographic scale ratios, and animation inertia curves as mathematical laws, ensuring every interface feels bespoke and deliberate.'}
                    onChange={(e) => handleCustomSettingChange('philosophyDesc', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-1.5 text-xs text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Statistics Boxes Management */}
            <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span>Statistics Boxes Management</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Add, edit, reorder counter boxes and upload hover images directly from your computer.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentCards = custom.statsCards || [
                      { id: '1', title: 'Clients Served', value: '83', images: [] },
                      { id: '2', title: 'Projects Completed', value: '120', images: [] },
                      { id: '3', title: 'Countries Worked In', value: '130', images: [] },
                      { id: '4', title: 'Awards', value: '6', images: [] },
                    ];
                    const newCard = {
                      id: Date.now().toString(),
                      title: 'New Metric',
                      value: '100',
                      images: [],
                    };
                    handleCustomSettingChange('statsCards', [...currentCards, newCard]);
                  }}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Statistic Box
                </Button>
              </div>

              <div className="space-y-4">
                {(custom.statsCards || [
                  { id: '1', title: 'Clients Served', value: '83', images: [] },
                  { id: '2', title: 'Projects Completed', value: '120', images: [] },
                  { id: '3', title: 'Countries Worked In', value: '130', images: [] },
                  { id: '4', title: 'Awards', value: '6', images: [] },
                ]).map((card: any, idx: number, arr: any[]) => (
                  <div
                    key={card.id || idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span>{card.title || `Box #${idx + 1}`}</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const cards = [...(custom.statsCards || arr)];
                            const temp = cards[idx];
                            cards[idx] = cards[idx - 1];
                            cards[idx - 1] = temp;
                            handleCustomSettingChange('statsCards', cards);
                          }}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === arr.length - 1}
                          onClick={() => {
                            const cards = [...(custom.statsCards || arr)];
                            const temp = cards[idx];
                            cards[idx] = cards[idx + 1];
                            cards[idx + 1] = temp;
                            handleCustomSettingChange('statsCards', cards);
                          }}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const cards = (custom.statsCards || arr).filter((_: any, i: number) => i !== idx);
                            handleCustomSettingChange('statsCards', cards);
                          }}
                          className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-500 cursor-pointer ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Box Title"
                        value={card.title || ''}
                        onChange={(e) => {
                          const cards = [...(custom.statsCards || arr)];
                          cards[idx] = { ...cards[idx], title: e.target.value };
                          handleCustomSettingChange('statsCards', cards);
                        }}
                        placeholder="e.g. Clients Served"
                      />
                      <Input
                        label="Statistic Number"
                        value={card.value || ''}
                        onChange={(e) => {
                          const cards = [...(custom.statsCards || arr)];
                          cards[idx] = { ...cards[idx], value: e.target.value };
                          handleCustomSettingChange('statsCards', cards);
                        }}
                        placeholder="e.g. 83"
                      />
                    </div>

                    <DeviceMultiImageUpload
                      label="Hover Images (Upload from Device Only)"
                      values={card.images || []}
                      onChange={(urls) => {
                        const cards = [...(custom.statsCards || arr)];
                        cards[idx] = { ...cards[idx], images: urls };
                        handleCustomSettingChange('statsCards', cards);
                      }}
                      category="studio_metrics"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------- 6. METRIC BOXES SECTION ------------------- */}
        {(key === 'metrics' || key === 'stats') && (
          <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Metric Cards Configuration</span>
            </div>

            <Input
              label="Main Heading"
              value={formData.heading || ''}
              onChange={(e) => handleChange('heading', e.target.value)}
            />

            <Input
              label="Sub Heading"
              value={formData.subheading || ''}
              onChange={(e) => handleChange('subheading', e.target.value)}
            />

            <DeviceMultiImageUpload
              label="Metric Card Burst Assets (Upload From Device Only)"
              value={custom.metricImages || []}
              onChange={(urls) => handleCustomSettingChange('metricImages', urls)}
              category="general"
            />
          </div>
        )}

        {/* ------------------- 7. FAQ SECTION ------------------- */}
        {key === 'faq' && (
          <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>FAQ Editor</span>
            </div>

            <Input
              label="Main Heading"
              value={formData.heading || ''}
              onChange={(e) => handleChange('heading', e.target.value)}
              placeholder="FREQUENTLY ASKED QUESTIONS"
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Description
              </label>
              <textarea
                rows={2}
                value={formData.subheading || ''}
                onChange={(e) => handleChange('subheading', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2 text-sm text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">Questions & Answers</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => {
                    const faqs = custom.faqs || [];
                    handleCustomSettingChange('faqs', [
                      ...faqs,
                      { id: Date.now().toString(), question: 'New Question?', answer: 'New Answer content.' },
                    ]);
                  }}
                >
                  Add FAQ
                </Button>
              </div>

              {(custom.faqs || []).map((faqItem: any, idx: number) => (
                <div key={faqItem.id || idx} className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">FAQ Item #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const faqs = [...(custom.faqs || [])];
                        faqs.splice(idx, 1);
                        handleCustomSettingChange('faqs', faqs);
                      }}
                      className="text-red-500 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <Input
                    label="Question"
                    value={faqItem.question}
                    onChange={(e) => {
                      const faqs = [...(custom.faqs || [])];
                      faqs[idx].question = e.target.value;
                      handleCustomSettingChange('faqs', faqs);
                    }}
                  />
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                      Answer
                    </label>
                    <textarea
                      rows={2}
                      value={faqItem.answer}
                      onChange={(e) => {
                        const faqs = [...(custom.faqs || [])];
                        faqs[idx].answer = e.target.value;
                        handleCustomSettingChange('faqs', faqs);
                      }}
                      className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-1.5 text-xs text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------- 8. FALLBACK / DEFAULT FOR OTHER SECTIONS ------------------- */}
        {!['hero', 'comic', 'marquee', 'projects', 'studio', 'metrics', 'stats', 'faq'].includes(key) && (
          <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <Type className="w-4 h-4" />
              <span>Section Copywriting</span>
            </div>

            <Input
              label="Main Section Heading"
              value={formData.heading || ''}
              onChange={(e) => handleChange('heading', e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Sub Heading / Description
              </label>
              <textarea
                rows={3}
                value={formData.subheading || ''}
                onChange={(e) => handleChange('subheading', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2 text-sm text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        {saveError && (
          <div className="p-3 rounded-xl text-xs font-semibold border bg-rose-500/10 text-rose-500 border-rose-500/20">
            {saveError}
          </div>
        )}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />} disabled={isSaving}>
            {isSaving ? 'Applying...' : 'Apply Changes'}
          </Button>
        </div>
      </form>
    </Drawer>
  );
};
