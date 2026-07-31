import React, { useState, useEffect } from 'react';
import { LayoutSection } from '../../types/admin.types';
import { Drawer, Input, Switch, Button } from '../ui';
import { Save, Image as ImageIcon, Sparkles, Sliders, Type, Link, Layout } from 'lucide-react';

export interface SectionEditorDrawerProps {
  isOpen: boolean;
  section: LayoutSection | null;
  onClose: () => void;
  onSave: (updated: LayoutSection) => void;
  onOpenMediaPicker?: (onSelect: (url: string) => void) => void;
}

export const SectionEditorDrawer: React.FC<SectionEditorDrawerProps> = ({
  isOpen,
  section,
  onClose,
  onSave,
  onOpenMediaPicker,
}) => {
  const [formData, setFormData] = useState<LayoutSection | null>(section);

  useEffect(() => {
    setFormData(section);
  }, [section]);

  if (!formData) return null;

  const handleChange = (field: keyof LayoutSection, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Section: ${formData.name}`}
      subtitle="Modify typography, primary actions, background parameters, and animation triggers."
    >
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Main Heading & Sub Heading */}
        <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <Type className="w-4 h-4" />
            <span>Headings & Copywriting</span>
          </div>

          <Input
            label="Main Section Heading"
            value={formData.heading}
            onChange={(e) => handleChange('heading', e.target.value)}
            placeholder="e.g. ENGINEERING DIGITAL MONUMENTS"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Sub Heading / Description
            </label>
            <textarea
              rows={3}
              value={formData.subheading}
              onChange={(e) => handleChange('subheading', e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <Link className="w-4 h-4" />
            <span>Call To Action Buttons</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Primary Button Text"
              value={formData.primaryButtonText || ''}
              onChange={(e) => handleChange('primaryButtonText', e.target.value)}
              placeholder="e.g. EXPLORE ARCHIVE"
            />
            <Input
              label="Primary Button Link"
              value={formData.primaryButtonLink || ''}
              onChange={(e) => handleChange('primaryButtonLink', e.target.value)}
              placeholder="e.g. /projects"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Secondary Button Text"
              value={formData.secondaryButtonText || ''}
              onChange={(e) => handleChange('secondaryButtonText', e.target.value)}
              placeholder="e.g. BOOK DIAGNOSTIC"
            />
            <Input
              label="Secondary Button Link"
              value={formData.secondaryButtonLink || ''}
              onChange={(e) => handleChange('secondaryButtonLink', e.target.value)}
              placeholder="e.g. /contact"
            />
          </div>
        </div>

        {/* Visual Media & Image URL */}
        <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <ImageIcon className="w-4 h-4" />
              <span>Section Asset Image</span>
            </div>
            {onOpenMediaPicker && (
              <button
                type="button"
                onClick={() =>
                  onOpenMediaPicker((url) => handleChange('imageUrl', url))
                }
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Choose from Media Library
              </button>
            )}
          </div>

          <Input
            label="Image Asset Path / URL"
            value={formData.imageUrl || ''}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            placeholder="e.g. /uploads/projects/vortex-hero.webp"
          />

          {formData.imageUrl && (
            <div className="relative h-28 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-900">
              <img
                src={formData.imageUrl}
                alt="Section Preview"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          )}
        </div>

        {/* Layout Styling & Animation Toggles */}
        <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>Styling & Spacing</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                Background Theme
              </label>
              <select
                value={formData.bgStyle}
                onChange={(e) => handleChange('bgStyle', e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
              >
                <option value="dark">Dark Slate (#050505)</option>
                <option value="darker">Deep Charcoal (#0a0a0a)</option>
                <option value="accent">Blue Accent Gradient</option>
                <option value="glass">Glassmorphism Overlay</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                Vertical Spacing
              </label>
              <select
                value={formData.spacing}
                onChange={(e) => handleChange('spacing', e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
              >
                <option value="compact">Compact (py-12)</option>
                <option value="default">Default (py-20)</option>
                <option value="spacious">Spacious (py-32)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/80 dark:border-zinc-800 space-y-3">
            <Switch
              label="Section Visibility"
              description="Toggle whether this section renders on the public homepage."
              checked={formData.visible}
              onChange={(checked) => handleChange('visible', checked)}
            />

            <Switch
              label="Kinetic Motion Dynamics"
              description="Enable smooth parallax and entrance scroll animations."
              checked={formData.animationEnabled}
              onChange={(checked) => handleChange('animationEnabled', checked)}
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />}>
            Apply Changes
          </Button>
        </div>
      </form>
    </Drawer>
  );
};
