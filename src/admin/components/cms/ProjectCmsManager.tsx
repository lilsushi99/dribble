import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Textarea, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, DeviceImageUpload } from '../ui';
import { adminApi } from '../../services/adminApi';
import { ProjectCMSItem } from '../../types/admin.types';
import { FolderKanban, Plus, Edit2, Trash2, Check, X, Eye, ExternalLink, RefreshCw } from 'lucide-react';

export const ProjectCmsManager: React.FC = () => {
  const [projects, setProjects] = useState<ProjectCMSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Partial<ProjectCMSItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getProjects();
      setProjects(data);
    } catch (e) {
      console.error('Failed to load projects', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject({
      title: '',
      slug: '',
      client: '',
      year: new Date().getFullYear().toString(),
      description: '',
      full_case_study: '',
      image_url: '',
      grid_span: 'col-span-12 md:col-span-6',
      aspect_ratio: 'aspect-[4/3]',
      is_featured: true,
      is_published: true,
      sort_order: projects.length + 1,
    });
    setIsModalOpen(true);
  };


  const handleOpenEdit = (proj: ProjectCMSItem) => {
    setEditingProject({ ...proj });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project? This will remove it from MySQL database.')) return;
    try {
      await adminApi.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      alert(e.message || 'Failed to delete project');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.slug) {
      alert('Title and Slug are required');
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">Project Portfolio Repository</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Managed directly in MySQL database with Express REST API.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadProjects} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <Button variant="primary" size="sm" onClick={handleOpenAdd}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Project
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading projects from MySQL...</div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No projects found in database. Create your first project!</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Project Title</TableHead>
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
                    <img
                      src={proj.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'}
                      alt={proj.title}
                      className="w-12 h-9 object-cover rounded-md border border-slate-200 dark:border-zinc-800"
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900 dark:text-zinc-100">
                    <div>{proj.title}</div>
                    <div className="text-[11px] font-normal text-slate-400 dark:text-zinc-500 font-mono">/{proj.slug}</div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 dark:text-zinc-300">{proj.client}</TableCell>
                  <TableCell className="text-xs text-slate-600 dark:text-zinc-300">{proj.year}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {proj.is_published ? (
                        <Badge variant="blue">Published</Badge>
                      ) : (
                        <Badge variant="neutral">Draft</Badge>
                      )}
                      {proj.is_featured && <Badge variant="accent">Featured</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(proj)} title="Edit Project">
                        <Edit2 className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(proj.id)} title="Delete Project">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Edit/Create Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                {editingProject.id ? 'Edit Project Entry' : 'Create New Project Entry'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Project Title *</label>
                  <Input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setEditingProject((prev) => ({ ...prev, title, slug: prev?.slug ? prev.slug : slug }));
                    }}
                    placeholder="e.g. Cybernetic Command UI"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">URL Slug *</label>
                  <Input
                    type="text"
                    required
                    value={editingProject.slug || ''}
                    onChange={(e) => setEditingProject((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="cybernetic-command-ui"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Client Name</label>
                  <Input
                    type="text"
                    value={editingProject.client || ''}
                    onChange={(e) => setEditingProject((prev) => ({ ...prev, client: e.target.value }))}
                    placeholder="e.g. Vanguard Aerospace"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Completion Year</label>
                  <Input
                    type="text"
                    value={editingProject.year || ''}
                    onChange={(e) => setEditingProject((prev) => ({ ...prev, year: e.target.value }))}
                    placeholder="2026"
                  />
                </div>
              </div>

              <DeviceImageUpload
                label="Cover Image (Upload From Device Only)"
                value={editingProject.image_url || ''}
                onChange={(url) => setEditingProject((prev) => ({ ...prev, image_url: url }))}
                category="projects"
              />

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Short Description</label>
                <Textarea
                  rows={2}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief architectural summary of the project..."
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Full Case Study Narrative</label>
                <Textarea
                  rows={4}
                  value={editingProject.full_case_study || ''}
                  onChange={(e) => setEditingProject((prev) => ({ ...prev, full_case_study: e.target.value }))}
                  placeholder="Detailed breakdown of architectural methodology, engineering stack, and results..."
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingProject.is_published}
                    onChange={(e) => setEditingProject((prev) => ({ ...prev, is_published: e.target.checked }))}
                    className="w-4 h-4 rounded-sm border-slate-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">Is Published</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingProject.is_featured}
                    onChange={(e) => setEditingProject((prev) => ({ ...prev, is_featured: e.target.checked }))}
                    className="w-4 h-4 rounded-sm border-slate-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">Is Featured on Homepage</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={saving}>
                  {saving ? 'Saving to MySQL...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
