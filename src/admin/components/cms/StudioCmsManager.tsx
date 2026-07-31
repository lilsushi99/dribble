import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Textarea, Badge } from '../ui';
import { adminApi } from '../../services/adminApi';
import { StudioPageData } from '../../types/admin.types';
import { Sparkles, Save, RefreshCw } from 'lucide-react';

export const StudioCmsManager: React.FC = () => {
  const [studio, setStudio] = useState<StudioPageData>({
    hero_title: '',
    hero_subtitle: '',
    philosophy_content: '',
    metrics_json: '[]',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadStudio = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getStudioData();
      if (data) setStudio(data);
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
      alert('Studio Page content saved successfully to MySQL!');
    } catch (err: any) {
      alert(err.message || 'Failed to save studio data');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">Studio Page & Laboratory CMS</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Edit studio mission statement, philosophy, and operational metrics.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadStudio} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Sync
          </Button>
        </div>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading Studio Content from MySQL...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1.5">Hero Headline Title</label>
              <Input
                type="text"
                value={studio.hero_title || ''}
                onChange={(e) => setStudio((prev) => ({ ...prev, hero_title: e.target.value }))}
                placeholder="Engineering digital monuments with architectural discipline"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1.5">Hero Subtitle Narrative</label>
              <Textarea
                rows={3}
                value={studio.hero_subtitle || ''}
                onChange={(e) => setStudio((prev) => ({ ...prev, hero_subtitle: e.target.value }))}
                placeholder="KINETIC operates as an independent design laboratory..."
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1.5">Studio Philosophy & Methodology</label>
              <Textarea
                rows={4}
                value={studio.philosophy_content || ''}
                onChange={(e) => setStudio((prev) => ({ ...prev, philosophy_content: e.target.value }))}
                placeholder="We view digital spaces not as disposable interfaces..."
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1.5">Operational Metrics (JSON Array)</label>
              <Textarea
                rows={3}
                className="font-mono text-[11px]"
                value={studio.metrics_json || ''}
                onChange={(e) => setStudio((prev) => ({ ...prev, metrics_json: e.target.value }))}
                placeholder='[{"label": "Monuments Built", "value": "48+"}]'
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
              <Button variant="primary" type="submit" disabled={saving}>
                <Save className="w-4 h-4 mr-1.5" />
                {saving ? 'Updating MySQL...' : 'Save Studio Content'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
