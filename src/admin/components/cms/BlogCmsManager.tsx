import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Textarea, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, DeviceImageUpload } from '../ui';
import { adminApi } from '../../services/adminApi';
import { BlogPostItem } from '../../types/admin.types';
import { BookOpen, Plus, Edit2, Trash2, X, RefreshCw } from 'lucide-react';

export const BlogCmsManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Partial<BlogPostItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getBlogPosts();
      setPosts(data);
    } catch (e) {
      console.error('Failed to load blog posts', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleOpenAdd = () => {
    setEditingPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      cover_image: '',
      category_name: 'Design Manifesto',
      is_published: true,
      published_at: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };


  const handleOpenEdit = (post: BlogPostItem) => {
    setEditingPost({ ...post });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await adminApi.deleteBlogPost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      alert(e.message || 'Failed to delete post');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title || !editingPost?.slug) {
      alert('Title and Slug are required');
      return;
    }

    setSaving(true);
    try {
      if (editingPost.id) {
        const updated = await adminApi.updateBlogPost(editingPost.id, editingPost);
        setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const created = await adminApi.createBlogPost(editingPost);
        setPosts((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
      setEditingPost(null);
    } catch (err: any) {
      alert(err.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">Editorial Blog & Articles</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Publish design manifestos, technical essays, and industry perspectives.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadPosts} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <Button variant="primary" size="sm" onClick={handleOpenAdd}>
            <Plus className="w-4 h-4 mr-1.5" />
            New Post
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading articles from MySQL...</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No blog posts found. Create your first post!</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cover</TableHead>
                <TableHead>Article Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <img
                      src={post.cover_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'}
                      alt={post.title}
                      className="w-12 h-9 object-cover rounded-md border border-slate-200 dark:border-zinc-800"
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900 dark:text-zinc-100">
                    <div>{post.title}</div>
                    <div className="text-[11px] font-normal text-slate-400 dark:text-zinc-500 font-mono">/{post.slug}</div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 dark:text-zinc-300">
                    <Badge variant="blue">{post.category_name || 'Manifesto'}</Badge>
                  </TableCell>
                  <TableCell>
                    {post.is_published ? <Badge variant="blue">Published</Badge> : <Badge variant="neutral">Draft</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(post)} title="Edit Article">
                        <Edit2 className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} title="Delete Article">
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
      {isModalOpen && editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                {editingPost.id ? 'Edit Editorial Post' : 'Create New Editorial Post'}
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
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Article Title *</label>
                  <Input
                    type="text"
                    required
                    value={editingPost.title || ''}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setEditingPost((prev) => ({ ...prev, title, slug: prev?.slug ? prev.slug : slug }));
                    }}
                    placeholder="e.g. The Discipline of Spatial Typography"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">URL Slug *</label>
                  <Input
                    type="text"
                    required
                    value={editingPost.slug || ''}
                    onChange={(e) => setEditingPost((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="discipline-of-spatial-typography"
                  />
                </div>
              </div>

              <DeviceImageUpload
                label="Cover Image (Upload From Device Only)"
                value={editingPost.cover_image || ''}
                onChange={(url) => setEditingPost((prev) => ({ ...prev, cover_image: url }))}
                category="blog"
              />

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Excerpt / Summary</label>
                <Textarea
                  rows={2}
                  value={editingPost.excerpt || ''}
                  onChange={(e) => setEditingPost((prev) => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Short introductory hook for article cards..."
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Full Article Content</label>
                <Textarea
                  rows={6}
                  value={editingPost.content || ''}
                  onChange={(e) => setEditingPost((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Write post body content..."
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingPost.is_published}
                    onChange={(e) => setEditingPost((prev) => ({ ...prev, is_published: e.target.checked }))}
                    className="w-4 h-4 rounded-sm border-slate-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">Is Published</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={saving}>
                  {saving ? 'Saving to MySQL...' : 'Save Article'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
