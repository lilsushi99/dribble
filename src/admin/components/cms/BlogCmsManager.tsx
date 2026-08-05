import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Textarea, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, DeviceImageUpload } from '../ui';
import { adminApi } from '../../services/adminApi';
import { BlogPostItem } from '../../types/admin.types';
import { useSettings } from '../../../context/SettingsContext';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  Sparkles,
  Search,
  CheckCircle2,
  Eye,
  FileText,
  Upload,
  Link as LinkIcon,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Image as ImageIcon,
  Video as VideoIcon,
  Globe,
  Tag,
  Calendar,
  User,
  ExternalLink,
} from 'lucide-react';

export const BlogCmsManager: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  // Active sub-tab in Blog Admin
  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'page-settings'>('posts');

  // Blog Posts List
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Blog Page Settings State
  const [heroHeading, setHeroHeading] = useState(settings.blog_hero_heading || 'Our Archive of Stories & Thoughts');
  const [heroSubheading, setHeroSubheading] = useState(
    settings.blog_hero_subheading ||
      'Insights, behind-the-scenes perspectives, comic development breakdowns, illustration processes, and visual storytelling essays published by Comic Art Studio.'
  );
  const [featuredTitle, setFeaturedTitle] = useState(settings.blog_featured_title || 'Featured Articles');
  const [recentTitle, setRecentTitle] = useState(settings.blog_recent_title || 'Recent Articles');
  const [subscribeHeading, setSubscribeHeading] = useState(
    settings.blog_subscribe_heading || 'Subscribe to Comic Art Studio Journal'
  );
  const [subscribeDesc, setSubscribeDesc] = useState(
    settings.blog_subscribe_desc ||
      'Quarterly dispatches on design theory, motion architecture, and studio research published on Substack.'
  );
  const [subscribeBtnText, setSubscribeBtnText] = useState(settings.blog_subscribe_btn_text || 'Subscribe on Substack');
  const [subscribeBtnUrl, setSubscribeBtnUrl] = useState(
    settings.blog_subscribe_btn_url || 'https://substack.com'
  );
  const [savingSettings, setSavingSettings] = useState(false);

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorStep, setEditorStep] = useState<'write' | 'settings' | 'review'>('write');

  // Article being created/edited
  const [editingPost, setEditingPost] = useState<Partial<BlogPostItem>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category_name: 'Comic Art & Storytelling',
    author_name: 'Comic Art Studio Team',
    author_role: 'Editorial Partner',
    read_time: '5 min read',
    is_featured: false,
    is_published: true,
    published_at: new Date().toISOString().split('T')[0],
    meta_title: '',
    meta_description: '',
    keywords: '',
    tags: ['Comic Art', 'Visual Narrative'],
  });

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

  // Sync settings when context updates
  useEffect(() => {
    if (settings.blog_hero_heading) setHeroHeading(settings.blog_hero_heading);
    if (settings.blog_hero_subheading) setHeroSubheading(settings.blog_hero_subheading);
    if (settings.blog_featured_title) setFeaturedTitle(settings.blog_featured_title);
    if (settings.blog_recent_title) setRecentTitle(settings.blog_recent_title);
    if (settings.blog_subscribe_heading) setSubscribeHeading(settings.blog_subscribe_heading);
    if (settings.blog_subscribe_desc) setSubscribeDesc(settings.blog_subscribe_desc);
    if (settings.blog_subscribe_btn_text) setSubscribeBtnText(settings.blog_subscribe_btn_text);
    if (settings.blog_subscribe_btn_url) setSubscribeBtnUrl(settings.blog_subscribe_btn_url);
  }, [settings]);

  // Open "Write New Article"
  const handleOpenAdd = () => {
    setEditingPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      cover_image: '/assets/images/project_artwork_1_1785513185877.jpg',
      category_name: 'Sequential Art',
      author_name: 'Comic Art Studio Team',
      author_role: 'Editorial Team',
      read_time: '6 min read',
      is_featured: false,
      is_published: true,
      published_at: new Date().toISOString().split('T')[0],
      meta_title: '',
      meta_description: '',
      keywords: 'comic books, character design, visual storytelling',
      tags: ['Comic Art', 'Sequential Storytelling'],
    });
    setEditorStep('write');
    setIsEditorOpen(true);
  };

  // Open Edit Article
  const handleOpenEdit = (post: BlogPostItem) => {
    setEditingPost({ ...post });
    setEditorStep('write');
    setIsEditorOpen(true);
  };

  // Delete Article
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this blog article?')) return;
    try {
      await adminApi.deleteBlogPost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      alert(e.message || 'Failed to delete post');
    }
  };

  // Title -> Slug Generator
  const handleTitleChange = (newTitle: string) => {
    const slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    setEditingPost((prev) => ({
      ...prev,
      title: newTitle,
      slug: prev.slug ? prev.slug : slug,
      meta_title: prev.meta_title ? prev.meta_title : `${newTitle} | Comic Art Studio`,
    }));
  };

  // Save Page Settings
  const handleSavePageSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateSettings(
        {
          blog_hero_heading: heroHeading,
          blog_hero_subheading: heroSubheading,
          blog_featured_title: featuredTitle,
          blog_recent_title: recentTitle,
          blog_subscribe_heading: subscribeHeading,
          blog_subscribe_desc: subscribeDesc,
          blog_subscribe_btn_text: subscribeBtnText,
          blog_subscribe_btn_url: subscribeBtnUrl,
        },
        'blog'
      );
      alert('Blog page settings updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // Save / Publish Article
  const handlePublishArticle = async () => {
    if (!editingPost.title || !editingPost.slug) {
      alert('Article Title and URL Slug are required.');
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<BlogPostItem> = {
        ...editingPost,
        published_at: editingPost.published_at || new Date().toISOString().split('T')[0],
        meta_title: editingPost.meta_title || `${editingPost.title} | Comic Art Studio`,
        meta_description: editingPost.meta_description || editingPost.excerpt || '',
      };

      if (editingPost.id) {
        const updated = await adminApi.updateBlogPost(editingPost.id, payload);
        setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const created = await adminApi.createBlogPost(payload);
        setPosts((prev) => [created, ...prev]);
      }
      setIsEditorOpen(false);
      alert('Article published successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to publish article');
    } finally {
      setSaving(false);
    }
  };

  // Helper formatting injectors for Area 1 Editor
  const insertFormatting = (tagStart: string, tagEnd = '') => {
    const content = editingPost.content || '';
    setEditingPost((prev) => ({
      ...prev,
      content: content + `${tagStart}Text${tagEnd}`,
    }));
  };

  // Handle direct media upload from device into editor content
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, isVideo = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    if (isVideo) {
      insertFormatting(`\n<video controls class="w-full rounded-xl my-4" src="${fileUrl}"></video>\n`);
    } else {
      insertFormatting(`\n<img class="w-full rounded-xl my-4 border border-white/10" src="${fileUrl}" alt="Uploaded media" />\n`);
    }
  };

  // Filtered posts
  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Tab Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Blog & Article Management Engine</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Publish editorial articles, manage hero text, and configure external newsletter subscriptions.
            </p>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 p-1.5 rounded-xl">
          <button
            onClick={() => setActiveSubTab('posts')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'posts'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Articles & Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveSubTab('page-settings')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'page-settings'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Blog Page Content
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: Articles & Posts Manager */}
      {activeSubTab === 'posts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={loadPosts} disabled={loading}>
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
                Sync
              </Button>
              <Button variant="primary" size="sm" onClick={handleOpenAdd}>
                <Plus className="w-4 h-4 mr-1.5" />
                Write New Article
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">Loading published articles...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">No blog articles found. Click "Write New Article" to publish your first post!</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cover</TableHead>
                    <TableHead>Article Title & Slug</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <img
                          src={
                            post.cover_image ||
                            '/assets/images/project_artwork_1_1785513185877.jpg'
                          }
                          alt={post.title}
                          className="w-14 h-10 object-cover rounded-lg border border-slate-200 dark:border-zinc-800"
                        />
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900 dark:text-zinc-100 max-w-xs">
                        <div className="truncate text-sm">{post.title}</div>
                        <div className="text-[11px] font-normal text-slate-400 dark:text-zinc-500 font-mono truncate">
                          /blog/{post.slug}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 dark:text-zinc-300">
                        {post.author_name || 'Comic Art Studio Team'}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="blue">{post.category_name || 'Sequential Art'}</Badge>
                      </TableCell>
                      <TableCell>
                        {post.is_published ? (
                          <Badge variant="blue">Published</Badge>
                        ) : (
                          <Badge variant="neutral">Draft</Badge>
                        )}
                        {post.is_featured && (
                          <span className="ml-1 text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-bold">
                            FEATURED
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-blue-500 transition-colors"
                            title="Preview Article Page"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
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
        </div>
      )}

      {/* SUB-TAB 2: Blog Page Content Settings */}
      {activeSubTab === 'page-settings' && (
        <form onSubmit={handleSavePageSettings} className="space-y-6 max-w-4xl">
          {/* Section 1: Hero Settings */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Section 1 — Blog Hero Settings</span>
            </h4>
            <div className="space-y-3">
              <Input
                label="Main Heading"
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
                placeholder="Our Archive of Stories & Thoughts"
              />
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Sub Heading / Description
                </label>
                <textarea
                  rows={3}
                  value={heroSubheading}
                  onChange={(e) => setHeroSubheading(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                  placeholder="Supporting description..."
                />
              </div>
            </div>
          </div>

          {/* Section 2: Articles Titles Settings */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Section 2 — Blog Articles Display Labels</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Featured Articles Section Title"
                value={featuredTitle}
                onChange={(e) => setFeaturedTitle(e.target.value)}
                placeholder="Featured Articles"
              />
              <Input
                label="Recent Articles Section Title"
                value={recentTitle}
                onChange={(e) => setRecentTitle(e.target.value)}
                placeholder="Recent Articles"
              />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 italic">
              Note: Monograph wording has been replaced with Articles / Blog throughout the frontend.
            </p>
          </div>

          {/* Section 3: Subscribe CTA Settings */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-500" />
              <span>Section 3 — Subscribe CTA & Outbound Link</span>
            </h4>
            <div className="space-y-3">
              <Input
                label="Subscribe Section Heading"
                value={subscribeHeading}
                onChange={(e) => setSubscribeHeading(e.target.value)}
                placeholder="Subscribe to Comic Art Studio Journal"
              />
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Description Text
                </label>
                <textarea
                  rows={2}
                  value={subscribeDesc}
                  onChange={(e) => setSubscribeDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Button Text"
                  value={subscribeBtnText}
                  onChange={(e) => setSubscribeBtnText(e.target.value)}
                  placeholder="Subscribe on Substack"
                />
                <Input
                  label="External Outbound URL (Substack, Medium, etc.)"
                  value={subscribeBtnUrl}
                  onChange={(e) => setSubscribeBtnUrl(e.target.value)}
                  placeholder="https://substack.com"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="primary" type="submit" disabled={savingSettings}>
              {savingSettings ? 'Saving Settings...' : 'Save Blog Page Settings'}
            </Button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* WORDPRESS-STYLE FULL ARTICLE EDITOR MODAL */}
      {/* ========================================================= */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Navigation Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800 shrink-0 bg-slate-50/50 dark:bg-zinc-950/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  WP
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                    {editingPost.id ? 'Edit Blog Article' : 'Write New Article'}
                  </h3>
                  <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
                    slug: /blog/{editingPost.slug || 'article-slug'}
                  </span>
                </div>
              </div>

              {/* Steps Progress */}
              <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-zinc-800 p-1 rounded-xl">
                <button
                  onClick={() => setEditorStep('write')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    editorStep === 'write' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  1. Content & Live Preview
                </button>
                <button
                  onClick={() => setEditorStep('settings')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    editorStep === 'settings' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  2. Settings & SEO
                </button>
                <button
                  onClick={() => setEditorStep('review')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    editorStep === 'review' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  3. Review & Publish
                </button>
              </div>

              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Scroll */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* STEP 1: Rich Text Editor (Area 1) + Live Preview (Area 2) */}
              {editorStep === 'write' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                  {/* Area 1: Editor & Toolbar (7 cols) */}
                  <div className="lg:col-span-6 space-y-4 flex flex-col">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                        Article Title *
                      </label>
                      <input
                        type="text"
                        value={editingPost.title || ''}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. How We Create Comic Characters"
                        className="w-full text-lg font-bold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Rich Formatting Toolbar */}
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 flex flex-wrap items-center gap-1.5 text-xs text-slate-700 dark:text-zinc-300">
                      <button
                        type="button"
                        onClick={() => insertFormatting('<strong>', '</strong>')}
                        className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700"
                        title="Bold"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('<em>', '</em>')}
                        className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700"
                        title="Italic"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('<u>', '</u>')}
                        className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700"
                        title="Underline"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>
                      <div className="h-4 w-[1px] bg-slate-300 dark:bg-zinc-700 my-auto" />
                      <button
                        type="button"
                        onClick={() => insertFormatting('<h2>', '</h2>')}
                        className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 font-bold text-[11px]"
                        title="Heading 2"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('<h3>', '</h3>')}
                        className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 font-bold text-[11px]"
                        title="Heading 3"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('<p>', '</p>')}
                        className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 font-semibold text-[11px]"
                        title="Paragraph"
                      >
                        P
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('<blockquote>"', '"</blockquote>')}
                        className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700"
                        title="Quote"
                      >
                        <Quote className="w-3.5 h-3.5" />
                      </button>
                      <div className="h-4 w-[1px] bg-slate-300 dark:bg-zinc-700 my-auto" />
                      <button
                        type="button"
                        onClick={() => insertFormatting('<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>')}
                        className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700"
                        title="Bulleted List"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('<ol>\n  <li>First point</li>\n  <li>Second point</li>\n</ol>')}
                        className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700"
                        title="Numbered List"
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt('Enter link URL:');
                          if (url) insertFormatting(`<a href="${url}" target="_blank" class="text-[#0097FF] underline">`, '</a>');
                        }}
                        className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700"
                        title="Insert Link"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                      </button>
                      <div className="h-4 w-[1px] bg-slate-300 dark:bg-zinc-700 my-auto" />

                      {/* Device Media Upload buttons */}
                      <label className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 cursor-pointer flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleMediaUpload(e, false)}
                        />
                      </label>
                      <label className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 cursor-pointer flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                        <VideoIcon className="w-3.5 h-3.5" />
                        <span>Upload Video</span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => handleMediaUpload(e, true)}
                        />
                      </label>
                    </div>

                    <div className="flex-1 space-y-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                        Article Body Content (Rich Text)
                      </label>
                      <textarea
                        rows={14}
                        value={editingPost.content || ''}
                        onChange={(e) => setEditingPost((prev) => ({ ...prev, content: e.target.value }))}
                        className="w-full h-full font-mono text-xs p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500 leading-relaxed"
                        placeholder="Write article body content here..."
                      />
                    </div>
                  </div>

                  {/* Area 2: Live Preview (5 cols) */}
                  <div className="lg:col-span-6 space-y-2 flex flex-col">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        <Eye className="w-4 h-4" /> Live Website Preview
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                        Renders exactly as on live site
                      </span>
                    </div>

                    <div className="flex-1 p-6 rounded-2xl bg-[#050505] text-[#f3f3f3] border border-white/10 overflow-y-auto max-h-[520px] space-y-4">
                      <div className="text-[10px] text-[#E6A800] uppercase font-bold tracking-widest">
                        {editingPost.category_name || 'Sequential Art'} • {editingPost.read_time || '5 min read'}
                      </div>
                      <h1 className="font-outfit text-2xl font-light text-white leading-tight">
                        {editingPost.title || 'Untitled Article Title'}
                      </h1>
                      <div className="flex items-center gap-2 text-xs text-[#9a9a9e] border-b border-white/10 pb-3">
                        <User className="w-3.5 h-3.5" />
                        <span>{editingPost.author_name || 'Comic Art Studio Team'}</span>
                        <span>•</span>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{editingPost.published_at || new Date().toISOString().split('T')[0]}</span>
                      </div>

                      {editingPost.cover_image && (
                        <div className="rounded-xl overflow-hidden border border-white/10">
                          <img
                            src={editingPost.cover_image}
                            alt="Cover"
                            className="w-full h-44 object-cover"
                          />
                        </div>
                      )}

                      {/* Clean HTML Rendered Content */}
                      <div
                        className="prose prose-invert prose-sm text-[#d1d1d6] font-inter leading-relaxed space-y-3"
                        dangerouslySetInnerHTML={{
                          __html: editingPost.content || '<p class="text-white/40 italic">Start typing content to see live preview...</p>',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Article Settings & SEO (Area 3) */}
              {editorStep === 'settings' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      <span>Article Information & Metadata</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                          Article Title *
                        </label>
                        <Input
                          value={editingPost.title || ''}
                          onChange={(e) => handleTitleChange(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                          URL Slug (Auto-generated) *
                        </label>
                        <Input
                          value={editingPost.slug || ''}
                          onChange={(e) => setEditingPost((prev) => ({ ...prev, slug: e.target.value }))}
                        />
                        <span className="text-[10px] text-slate-400">
                          Route: /blog/{editingPost.slug || 'slug'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Author Name"
                        value={editingPost.author_name || ''}
                        onChange={(e) => setEditingPost((prev) => ({ ...prev, author_name: e.target.value }))}
                        placeholder="e.g. Evelyn Kuroda"
                      />
                      <Input
                        label="Author Role"
                        value={editingPost.author_role || ''}
                        onChange={(e) => setEditingPost((prev) => ({ ...prev, author_role: e.target.value }))}
                        placeholder="e.g. Lead Comic Artist"
                      />
                      <Input
                        label="Publish Date"
                        type="date"
                        value={editingPost.published_at || ''}
                        onChange={(e) => setEditingPost((prev) => ({ ...prev, published_at: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Category Name"
                        value={editingPost.category_name || ''}
                        onChange={(e) => setEditingPost((prev) => ({ ...prev, category_name: e.target.value }))}
                        placeholder="e.g. Sequential Art"
                      />
                      <Input
                        label="Estimated Read Time"
                        value={editingPost.read_time || ''}
                        onChange={(e) => setEditingPost((prev) => ({ ...prev, read_time: e.target.value }))}
                        placeholder="e.g. 6 min read"
                      />
                    </div>

                    <DeviceImageUpload
                      label="Cover / Featured Image (Upload From Device)"
                      value={editingPost.cover_image || ''}
                      onChange={(url) => setEditingPost((prev) => ({ ...prev, cover_image: url }))}
                      category="blog"
                    />

                    <div>
                      <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                        Short Excerpt / Summary (Displayed on Cards)
                      </label>
                      <Textarea
                        rows={2}
                        value={editingPost.excerpt || ''}
                        onChange={(e) => setEditingPost((prev) => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="Hook text summarizing the article..."
                      />
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!editingPost.is_featured}
                          onChange={(e) => setEditingPost((prev) => ({ ...prev, is_featured: e.target.checked }))}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                          Feature as Main Top Article
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!editingPost.is_published}
                          onChange={(e) => setEditingPost((prev) => ({ ...prev, is_published: e.target.checked }))}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                          Publish Article
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* SEO SETTINGS SECTION */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                      <Search className="w-4 h-4 text-emerald-500" />
                      <span>SEO & Search Engine Optimization</span>
                    </h4>

                    <div className="space-y-3">
                      <Input
                        label="Meta Title"
                        value={editingPost.meta_title || ''}
                        onChange={(e) => setEditingPost((prev) => ({ ...prev, meta_title: e.target.value }))}
                        placeholder="Article Title | Comic Art Studio"
                      />
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                          Meta Description
                        </label>
                        <textarea
                          rows={2}
                          value={editingPost.meta_description || ''}
                          onChange={(e) => setEditingPost((prev) => ({ ...prev, meta_description: e.target.value }))}
                          className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                          placeholder="Search engine snippet description..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Keywords (comma separated)"
                          value={editingPost.keywords || ''}
                          onChange={(e) => setEditingPost((prev) => ({ ...prev, keywords: e.target.value }))}
                          placeholder="comic art, storytelling, illustration"
                        />
                        <Input
                          label="Tags (comma separated)"
                          value={
                            Array.isArray(editingPost.tags)
                              ? editingPost.tags.join(', ')
                              : editingPost.tags || ''
                          }
                          onChange={(e) =>
                            setEditingPost((prev) => ({
                              ...prev,
                              tags: e.target.value.split(',').map((t) => t.trim()),
                            }))
                          }
                          placeholder="Manga, UI Design, Craft"
                        />
                      </div>
                    </div>

                    {/* SEO Live Search Result Preview */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Search Engine Live Preview (Google)
                      </span>
                      <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer truncate">
                        {editingPost.meta_title || `${editingPost.title || 'Article Title'} | Comic Art Studio`}
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                        https://comicartstudio.com/blog/{editingPost.slug || 'article-slug'}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2">
                        {editingPost.meta_description ||
                          editingPost.excerpt ||
                          'Comprehensive article breakdown published by Comic Art Studio.'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Review and Publish Flow */}
              {editorStep === 'review' && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                          Final Review Before Publishing
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                          Verify article parameters, SEO attributes, and URL structure.
                        </p>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-slate-400 block font-semibold">Title:</span>
                          <span className="font-bold text-slate-900 dark:text-zinc-100">{editingPost.title}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold">URL Route:</span>
                          <span className="font-mono text-blue-600 dark:text-blue-400">/blog/{editingPost.slug}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold">Author:</span>
                          <span>{editingPost.author_name} ({editingPost.author_role || 'Author'})</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold">Date:</span>
                          <span>{editingPost.published_at}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold">Category:</span>
                          <Badge variant="blue">{editingPost.category_name}</Badge>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold">Status:</span>
                          <Badge variant={editingPost.is_published ? 'blue' : 'neutral'}>
                            {editingPost.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 dark:border-zinc-800">
                        <span className="text-slate-400 block font-semibold mb-1">SEO Title & Snippet:</span>
                        <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1">
                          <div className="font-bold text-blue-600 dark:text-blue-400">{editingPost.meta_title}</div>
                          <div className="text-slate-500 text-[11px]">{editingPost.meta_description}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800">
                      <Button variant="outline" onClick={() => setEditorStep('write')}>
                        Back to Editor
                      </Button>
                      <Button variant="primary" size="lg" onClick={handlePublishArticle} disabled={saving}>
                        {saving ? 'Publishing to MySQL...' : 'Publish Article Now'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-zinc-800 shrink-0 bg-slate-50/50 dark:bg-zinc-950/50 flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setIsEditorOpen(false)}>
                Cancel
              </Button>

              <div className="flex items-center gap-2">
                {editorStep === 'write' && (
                  <Button variant="primary" size="sm" onClick={() => setEditorStep('settings')}>
                    Next: Settings & SEO &rarr;
                  </Button>
                )}
                {editorStep === 'settings' && (
                  <Button variant="primary" size="sm" onClick={() => setEditorStep('review')}>
                    Next: Final Review &rarr;
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
