import React, { useState } from 'react';
import { LayoutSection } from '../../types/admin.types';
import { Card, Badge, Button, Switch } from '../ui';
import {
  GripVertical,
  Eye,
  EyeOff,
  Edit3,
  Copy,
  Trash2,
  Settings2,
  Maximize2,
  ArrowUp,
  ArrowDown,
  Save,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';

export interface LayoutBuilderProps {
  sections: LayoutSection[];
  onSaveLayout: (sections: LayoutSection[]) => Promise<void>;
  onEditSection: (section: LayoutSection) => void;
  onPreviewSection: (section: LayoutSection) => void;
}

export const LayoutBuilder: React.FC<LayoutBuilderProps> = ({
  sections: initialSections,
  onSaveLayout,
  onEditSection,
  onPreviewSection,
}) => {
  const [sections, setSections] = useState<LayoutSection[]>(initialSections);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Reorder up/down
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updated = [...sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    // reassign order
    const reordered = updated.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    setSections(reordered);
  };

  // Toggle visibility
  const toggleVisibility = (id: string) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, visible: !sec.visible } : sec))
    );
  };

  // Duplicate
  const duplicateSection = (id: string) => {
    const source = sections.find((s) => s.id === id);
    if (!source) return;

    const newSec: LayoutSection = {
      ...source,
      id: `sec-custom-${Date.now()}`,
      name: `${source.name} (Copy)`,
      order: sections.length + 1,
    };

    setSections((prev) => [...prev, newSec]);
  };

  // Delete
  const deleteSection = (id: string) => {
    if (sections.length <= 1) {
      alert('At least one section must remain on the homepage.');
      return;
    }
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveLayout(sections);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err?.message || 'Failed to save. Check console/network tab for details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-900/40 via-zinc-900 to-indigo-950/40 border border-blue-500/20 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Homepage Layout Reorder & Builder</h2>
          </div>
          <p className="text-xs text-zinc-300 mt-1 max-w-2xl">
            Drag, toggle, duplicate, or reorder homepage architectural sections. Order changes are persisted in MySQL and immediately dynamically re-render on the public frontend.
          </p>
        </div>

        <Button
          variant="primary"
          icon={savedSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          onClick={handleSave}
          disabled={isSaving}
          className="shrink-0"
        >
          {isSaving ? 'Saving to Database...' : savedSuccess ? 'Order Stored in MySQL!' : 'Save Homepage Order'}
        </Button>
      </div>

      {/* Sections Drag/Reorder List */}
      <div className="space-y-3">
        {sections.map((sec, index) => (
          <Card
            key={sec.id}
            className={`transition-all duration-200 border ${
              !sec.visible
                ? 'opacity-60 bg-slate-50 dark:bg-zinc-950/40 border-dashed border-slate-300 dark:border-zinc-800'
                : 'hover:border-blue-500/50'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              {/* Left Drag & Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex flex-col items-center gap-0.5 text-slate-400 dark:text-zinc-600">
                  <GripVertical className="w-5 h-5 cursor-grab active:cursor-grabbing text-slate-400 hover:text-blue-500" />
                  <span className="text-[10px] font-bold">0{index + 1}</span>
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-zinc-100 truncate">
                      {sec.name}
                    </span>
                    <Badge variant={sec.visible ? 'blue' : 'slate'} size="sm">
                      {sec.visible ? 'VISIBLE' : 'HIDDEN'}
                    </Badge>
                    <Badge variant="zinc" size="sm">
                      {sec.bgStyle.toUpperCase()} BG
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                    "{sec.heading}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Move Up/Down Controls */}
                <div className="flex items-center bg-slate-100 dark:bg-zinc-800/80 rounded-xl p-1 gap-1">
                  <button
                    onClick={() => moveSection(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 disabled:opacity-30 transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveSection(index, 'down')}
                    disabled={index === sections.length - 1}
                    className="p-1 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 disabled:opacity-30 transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Edit Button */}
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Edit3 className="w-3.5 h-3.5 text-blue-500" />}
                  onClick={() => onEditSection(sec)}
                >
                  Edit
                </Button>

                {/* Toggle Visibility */}
                <button
                  onClick={() => toggleVisibility(sec.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    sec.visible
                      ? 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                      : 'border-amber-300 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                  }`}
                  title={sec.visible ? 'Hide Section' : 'Show Section'}
                >
                  {sec.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Duplicate */}
                <button
                  onClick={() => duplicateSection(sec.id)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                  title="Duplicate Section"
                >
                  <Copy className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteSection(sec.id)}
                  className="p-2 rounded-xl border border-rose-200 dark:border-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete Section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
