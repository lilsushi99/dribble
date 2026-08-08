import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Textarea, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, DeviceImageUpload, DeviceMultiImageUpload } from '../ui';
import { adminApi } from '../../services/adminApi';
import { ProjectCMSItem } from '../../types/admin.types';
import { FolderKanban, Plus, Edit2, Trash2, X, Eye, EyeOff, Tag, Sparkles, Save, Type, Link, MessageSquare } from 'lucide-react';

// Matches the box shapes/proportions from the original hand-built homepage showcase,
// so picking a preset here reproduces the intended asymmetrical "Lego block" composition
// instead of every project defaulting to the same uniform box.
const PROJECT_LAYOUT_PRESETS = [
  { id: 'balanced', label: 'Balanced (default, uniform)', gridSpan: 'col-span-12 md:col-span-6', aspectRatio: 'aspect-[4/3]' },
  { id: 'wide-short', label: 'Wide & Short', gridSpan: 'col-span-12 md:col-span-7', aspectRatio: 'aspect-[4/3]' },
  { id: 'tall-narrow', label: 'Tall & Narrow', gridSpan: 'col-span-12 md:col-span-5', aspectRatio: 'aspect-[3/4]' },
  { id: 'square', label: 'Square, Medium', gridSpan: 'col-span-12 md:col-span-4', aspectRatio: 'aspect-[1/1]' },
  { id: 'extra-wide', label: 'Extra Wide', gridSpan: 'col-span-12 md:col-span-8', aspectRatio: 'aspect-[16/9]' },
  { id: 'wide-tall', label: 'Wide & Tall', gridSpan: 'col-span-12 md:col-span-7', aspectRatio: 'aspect-[16/10]' },
];

export const ProjectCmsManager: React.FC = () => {
  const [projects, setProjects] = useState<ProjectCMSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Partial<ProjectCMSItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Section 1: Hero fields state
  const [heroHeading, setHeroHeading] = useState('Selected Works & Commissions');
  const [heroSubheading, setHeroSubheading] = useState('An editorial archive of interactive monuments, physical artefacts, brand identities, and spatial structures built between 2018 and present.');
  const [savingHero, setSavingHero] = useState(false);

  // Section 3: Final CTA fields state
  const [ctaHeading, setCtaHeading] = useState('Ready to build something together?');
  const [ctaSubheading, setCtaSubheading] = useState('Our partners review all project inquiries personally within 24 hours.');
  const [ctaButtonText, setCtaButtonText] = useState('Book a Call');
  const [ctaButtonUrl, setCtaButtonUrl] = useState('/contact');
  const [savingCta, setSavingCta] = useState(false);

  const SUGGESTED_TOOLS = ['Clip Studio Paint', 'Photoshop', 'Illustrator', 'Procreate', 'Figma', 'Blender'];

  const loadProjectsAndSettings = async () => {
    setLoading(true);
    try {
      const [projData, globalSettings] = await Promise.all([
        adminApi.getProjects(),
        adminApi.getGlobalSettings(),
      ]);
      setProjects(projData);

      if (globalSettings) {
        if (globalSettings.projects_hero_heading) setHeroHeading(globalSettings.projects_hero_heading);
        if (globalSettings.projects_hero_subheading) setHeroSubheading(globalSettings.projects_hero_subheading);
        if (globalSettings.projects_cta_heading) setCtaHeading(globalSettings.projects_cta_heading);
        if (globalSettings.projects_cta_subheading) setCtaSubheading(globalSettings.projects_cta_subheading);
        if (globalSettings.projects_cta_button_text) setCtaButtonText(globalSettings.projects_cta_button_text);
        if (globalSettings.projects_cta_button_url) setCtaButtonUrl(globalSettings.projects_cta_button_url);
      }
    } catch (e) {
      console.error('Failed to load projects management data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectsAndSettings();
  }, []);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHero(true);
    try {
      await adminApi.updateGlobalSettings({
        projects_hero_heading: heroHeading,
        projects_hero_subheading: heroSubheading,
      }, 'projects_page');
      alert('Projects Page Hero settings saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to save Hero settings');
    } finally {
      setSavingHero(false);
    }
  };

  const handleSaveCta = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCta(true);
    try {
      await adminApi.updateGlobalSettings({
        projects_cta_heading: ctaHeading,
        projects_cta_subheading: ctaSubheading,
        projects_cta_button_text: ctaButtonText,
        projects_cta_button_url: ctaButtonUrl,
      }, 'projects_page');
      alert('Bottom CTA settings saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to save CTA settings');
    } finally {
      setSavingCta(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProject({
      title: '',
      slug: '',
      client: '',
      year: new Date().getFullYear().toString(),
      description: '',
      full_case_study: '',
      image_url: '',
      tools_used: [],
      gallery_images: [],
      is_featured: true,
      is_published: true,
      sort_order: projects.length + 1,
    });
    setTagInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: ProjectCMSItem) => {
    setEditingProject({
      ...proj,
      tools_used: proj.tools_used || [],
      gallery_images: proj.gallery_images || [],
    });
    setTagInput('');
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (proj: ProjectCMSItem) => {
    try {
      const updated = await adminApi.updateProject(proj.id, { is_published: !proj.is_published });
      setProjects((prev) => prev.map((p) => (p.id === proj.id ? updated : p)));
    } catch (e: any) {
      alert(e.message || 'Failed to update visibility');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project? This will permanently remove it from MySQL database.')) return;
    try {
      await adminApi.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      alert(e.message || 'Failed to delete project');
    }
  };

  const handleAddTag = (toolName?: string) => {
    const tagToAdd = (toolName || tagInput).trim();
    if (!tagToAdd || !editingProject) return;
    const currentTags = editingProject.tools_used || [];
    if (!currentTags.includes(tagToAdd)) {
      setEditingProject({
        ...editingProject,
        tools_used: [...currentTags, tagToAdd],
      });
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      tools_used: (editingProject.tools_used || []).filter((t) => t !== tagToRemove),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title?.trim() || !editingProject?.slug?.trim()) {
      alert('Project Title and URL Slug are required.');
      return;
    }
    if (!editingProject.image_url?.trim()) {
      alert('Cover Image (Upload from Device) is required.');
      return;
    }
    if (!editingProject.year?.trim()) {
      alert('Completion Year is required.');
      return;
    }
    if (!editingProject.description?.trim()) {
      alert('Short Description is required.');
      return;
    }

    setSaving(true);
    try {
      if (editingProject.id) {
        const updated = await adminApi.updateProject(editingProject.id, editingProject);
        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const created = await adminApi.createProject(editingProject);
        setProjects((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
      setEditingProject(null);
    } catch (err: any) {
      alert(err.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* SECTION 1 — PROJECTS PAGE HERO */}
      <Card className="p-6 space-y-4 border border-slate-200 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Section 1 — Projects Page Hero</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Controls the main heading and subtitle displayed at the top of the Projects page.</p>
            </div>
          </div>
          <Button type="button" variant="primary" size="sm" onClick={handleSaveHero} disabled={savingHero}>
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {savingHero ? 'Saving...' : 'Save Hero Section'}
          </Button>
        </div>

        <form onSubmit={handleSaveHero} className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
              Main Heading
            </label>
            <Input
              type="text"
              value={heroHeading}
              onChange={(e) => setHeroHeading(e.target.value)}
              placeholder="e.g. Selected Works & Commissions"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
              Sub Heading
            </label>
            <Textarea
              rows={2}
              value={heroSubheading}
              onChange={(e) => setHeroSubheading(e.target.value)}
              placeholder="e.g. An editorial archive of interactive monuments..."
            />
          </div>
        </form>
      </Card>

      {/* SECTION 2 — PROJECTS LIST */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">Section 2 — Projects List</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Manage individual portfolio projects, case studies, images, and visibility.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" onClick={handleOpenAdd}>
              <Plus className="w-4 h-4 mr-1.5" />
              Add New Project
            </Button>
          </div>
        </div>

        {/* Project Repository Table */}
        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <FolderKanban className="w-10 h-10 text-slate-300 dark:text-zinc-700 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">No Projects Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your projects list is currently empty. Click "Add New Project" above to create your first portfolio entry.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cover</TableHead>
                  <TableHead>Project Title & Slug</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((proj) => (
                  <TableRow key={proj.id}>
                    <TableCell>
                      {proj.image_url ? (
                        <img
                          src={proj.image_url}
                          alt={proj.title}
                          className="w-14 h-10 object-cover rounded-md border border-slate-200 dark:border-zinc-800 bg-zinc-950"
                        />
                      ) : (
                        <div className="w-14 h-10 rounded-md border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] text-slate-400">
                          No Image
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900 dark:text-zinc-100">
                      <div>{proj.title}</div>
                      <div className="text-[11px] font-normal text-slate-400 dark:text-zinc-500 font-mono">/{proj.slug}</div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 dark:text-zinc-300">{proj.client || '—'}</TableCell>
                    <TableCell className="text-xs text-slate-600 dark:text-zinc-300">{proj.year}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {proj.is_published ? (
                          <Badge variant="blue">Visible</Badge>
                        ) : (
                          <Badge variant="neutral">Hidden</Badge>
                        )}
                        {proj.is_featured && <Badge variant="accent">Show on Homepage</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePublish(proj)}
                          title={proj.is_published ? 'Hide Project' : 'Unhide Project'}
                        >
                          {proj.is_published ? (
                            <span className="flex items-center gap-1 text-slate-500 hover:text-amber-500">
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Hide</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-slate-500 hover:text-emerald-500">
                              <Eye className="w-3.5 h-3.5" />
                              <span>Unhide</span>
                            </span>
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(proj)} title="Edit Project">
                          <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(proj.id)} title="Delete Project">
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      {/* SECTION 3 — FINAL CTA (BOTTOM OF PROJECTS PAGE) */}
      <Card className="p-6 space-y-4 border border-slate-200 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Section 3 — Final CTA (Bottom of Projects Page)</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Controls the Call-To-Action section at the bottom of the Projects page.</p>
            </div>
          </div>
          <Button type="button" variant="primary" size="sm" onClick={handleSaveCta} disabled={savingCta}>
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {savingCta ? 'Saving...' : 'Save CTA Section'}
          </Button>
        </div>

        <form onSubmit={handleSaveCta} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Main Heading
              </label>
              <Input
                type="text"
                value={ctaHeading}
                onChange={(e) => setCtaHeading(e.target.value)}
                placeholder="e.g. Ready to build something together?"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Button Text
              </label>
              <Input
                type="text"
                value={ctaButtonText}
                onChange={(e) => setCtaButtonText(e.target.value)}
                placeholder="e.g. Book a Call"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Sub Heading
              </label>
              <Textarea
                rows={2}
                value={ctaSubheading}
                onChange={(e) => setCtaSubheading(e.target.value)}
                placeholder="e.g. Our partners review all project inquiries personally within 24 hours."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Button URL
              </label>
              <Input
                type="text"
                value={ctaButtonUrl}
                onChange={(e) => setCtaButtonUrl(e.target.value)}
                placeholder="e.g. /contact or https://calendly.com/..."
              />
            </div>
          </div>
        </form>
      </Card>

      {/* Add / Edit Project Form Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                {editingProject.id ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6 text-xs">
              {/* SECTION 1: REQUIRED FIELDS */}
              <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <span>Required Fields</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Project Title *</label>
                    <Input
                      type="text"
                      required
                      value={editingProject.title || ''}
                      onChange={(e) => {
                        const title = e.target.value;
                        const autoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setEditingProject((prev) => ({
                          ...prev,
                          title,
                          slug: prev?.slug && prev.slug !== autoSlug ? prev.slug : autoSlug,
                        }));
                      }}
                      placeholder="e.g. Monolith Architectural Pavilion"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">URL Slug *</label>
                    <Input
                      type="text"
                      required
                      value={editingProject.slug || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="monolith-pavilion"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Completion Year *</label>
                    <Input
                      type="text"
                      required
                      value={editingProject.year || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, year: e.target.value }))}
                      placeholder="2026"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Homepage Layout Size</label>
                    <select
                      value={
                        PROJECT_LAYOUT_PRESETS.find(
                          (p) => p.gridSpan === editingProject.grid_span && p.aspectRatio === editingProject.aspect_ratio
                        )?.id || 'balanced'
                      }
                      onChange={(e) => {
                        const preset = PROJECT_LAYOUT_PRESETS.find((p) => p.id === e.target.value);
                        if (preset) {
                          setEditingProject((prev) => ({
                            ...prev,
                            grid_span: preset.gridSpan,
                            aspect_ratio: preset.aspectRatio,
                          }));
                        }
                      }}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-slate-900 dark:text-zinc-100"
                    >
                      {PROJECT_LAYOUT_PRESETS.map((preset) => (
                        <option key={preset.id} value={preset.id}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Controls this project's box shape in the homepage masonry grid. Vary these across
                      projects for the intended asymmetrical "Lego block" composition.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Short Description *</label>
                  <Textarea
                    rows={2}
                    required
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief architectural summary of the project..."
                  />
                </div>

                <DeviceImageUpload
                  label="Cover Image * (Upload from Device Only)"
                  value={editingProject.image_url || ''}
                  onChange={(url) => setEditingProject((prev) => ({ ...prev, image_url: url }))}
                  category="projects"
                />
              </div>

              {/* SECTION 2: OPTIONAL FIELDS */}
              <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Optional Fields
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Client Name</label>
                  <Input
                    type="text"
                    value={editingProject.client || ''}
                    onChange={(e) => setEditingProject((prev) => ({ ...prev, client: e.target.value }))}
                    placeholder="e.g. Vanguard Aerospace"
                  />
                </div>

                {/* Tools Used Tag Input */}
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Tools Used (Tags)</label>
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Type tool name (e.g. Clip Studio Paint) and press Enter"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => handleAddTag()}>
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add
                    </Button>
                  </div>

                  {/* Quick-add buttons for suggested tools */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <span className="text-[11px] text-slate-400 font-medium mr-1">Suggested:</span>
                    {SUGGESTED_TOOLS.map((tool) => (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => handleAddTag(tool)}
                        className="px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-blue-950/60 text-[11px] text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
                      >
                        + {tool}
                      </button>
                    ))}
                  </div>

                  {/* Added Tool Tag Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {(editingProject.tools_used || []).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-medium"
                      >
                        <Tag className="w-3 h-3 text-blue-500" />
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-rose-500 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <DeviceMultiImageUpload
                  label="Gallery Images (Upload from Device Only)"
                  values={editingProject.gallery_images || []}
                  onChange={(urls) => setEditingProject((prev) => ({ ...prev, gallery_images: urls }))}
                  category="projects"
                />

                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Full Narrative (Rich Story)</label>
                  <Textarea
                    rows={6}
                    value={editingProject.full_case_study || ''}
                    onChange={(e) => setEditingProject((prev) => ({ ...prev, full_case_study: e.target.value }))}
                    placeholder="Write the complete project narrative, design concept, materials, process..."
                  />
                </div>
              </div>

              {/* SECTION 3: VISIBILITY */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-zinc-200">Show on Homepage</div>
                  <p className="text-[11px] text-slate-400">Display this project in the Featured Projects section on the homepage.</p>
                </div>
                <input
                  type="checkbox"
                  checked={!!editingProject.is_featured}
                  onChange={(e) => setEditingProject((prev) => ({ ...prev, is_featured: e.target.checked }))}
                  className="w-5 h-5 rounded border-slate-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={saving}>
                  {saving ? 'Saving to Database...' : 'Save Project'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

