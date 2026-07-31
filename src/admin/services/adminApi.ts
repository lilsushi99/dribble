import {
  LayoutSection,
  MediaFile,
  FormSubmissionData,
  ActivityLogItem,
  DashboardAnalytics,
  ProjectCMSItem,
  StudioPageData,
  BlogPostItem,
  SmtpSettings,
} from '../types/admin.types';

const API_BASE = '/api/v1';

export function getAuthToken(): string | null {
  return localStorage.getItem('kinetic_admin_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('kinetic_admin_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('kinetic_admin_token');
}

export function getAuthUser(): any | null {
  const user = localStorage.getItem('kinetic_admin_user');
  return user ? JSON.parse(user) : null;
}

export function setAuthUser(user: any) {
  localStorage.setItem('kinetic_admin_user', JSON.stringify(user));
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API Request failed');
  }

  return data.data !== undefined ? data.data : data;
}

export const adminApi = {
  // Auth
  async login(email: string, password: string) {
    const res = await request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.accessToken) setAuthToken(res.accessToken);
    if (res.user) setAuthUser(res.user);
    return res;
  },

  async logout() {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore
    }
    removeAuthToken();
    localStorage.removeItem('kinetic_admin_user');
  },

  async getCurrentUser() {
    return request<any>('/auth/me');
  },

  // Settings / Layout Builder
  async getHomepageLayout(): Promise<LayoutSection[]> {
    try {
      const settings = await request<Record<string, string>>('/settings');
      if (settings && settings.homepage_layout) {
        return JSON.parse(settings.homepage_layout);
      }
    } catch (e) {
      console.warn('Could not fetch homepage layout from API, using default layout.', e);
    }
    return defaultLayoutSections;
  },

  async saveHomepageLayout(sections: LayoutSection[]): Promise<boolean> {
    try {
      await request('/settings', {
        method: 'PUT',
        body: JSON.stringify({
          settings: {
            homepage_layout: JSON.stringify(sections),
          },
          category: 'layout',
        }),
      });
      return true;
    } catch (e) {
      console.error('Failed to save layout:', e);
      return false;
    }
  },

  // Media Library
  async getMediaFiles(): Promise<MediaFile[]> {
    try {
      return await request<MediaFile[]>('/media');
    } catch (e) {
      console.warn('Using fallback memory media list', e);
      return defaultMediaFiles;
    }
  },

  async uploadMedia(file: File, category = 'general'): Promise<MediaFile> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    return request<MediaFile>('/media/upload', {
      method: 'POST',
      body: formData,
    });
  },

  async deleteMedia(id: number): Promise<boolean> {
    await request(`/media/${id}`, { method: 'DELETE' });
    return true;
  },

  // Activity & Analytics
  async getActivityLogs(): Promise<ActivityLogItem[]> {
    try {
      return await request<ActivityLogItem[]>('/analytics/logs');
    } catch (e) {
      return defaultActivityLogs;
    }
  },

  async getFormSubmissions(formId = 1): Promise<FormSubmissionData[]> {
    try {
      return await request<FormSubmissionData[]>(`/forms/${formId}/submissions`);
    } catch (e) {
      return defaultSubmissions;
    }
  },

  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    return defaultAnalytics;
  },

  // Projects CMS
  async getProjects(): Promise<ProjectCMSItem[]> {
    try {
      return await request<ProjectCMSItem[]>('/projects');
    } catch (e) {
      return defaultProjects;
    }
  },

  async createProject(project: Partial<ProjectCMSItem>): Promise<ProjectCMSItem> {
    return request<ProjectCMSItem>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  },

  async updateProject(id: number, project: Partial<ProjectCMSItem>): Promise<ProjectCMSItem> {
    return request<ProjectCMSItem>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  },

  async deleteProject(id: number): Promise<boolean> {
    await request(`/projects/${id}`, { method: 'DELETE' });
    return true;
  },

  // Studio CMS
  async getStudioData(): Promise<StudioPageData> {
    try {
      return await request<StudioPageData>('/studio');
    } catch (e) {
      return defaultStudioData;
    }
  },

  async updateStudioData(data: Partial<StudioPageData>): Promise<StudioPageData> {
    return request<StudioPageData>('/studio', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Blog CMS
  async getBlogPosts(): Promise<BlogPostItem[]> {
    try {
      return await request<BlogPostItem[]>('/blog');
    } catch (e) {
      return defaultBlogPosts;
    }
  },

  async createBlogPost(post: Partial<BlogPostItem>): Promise<BlogPostItem> {
    return request<BlogPostItem>('/blog', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  },

  async updateBlogPost(id: number, post: Partial<BlogPostItem>): Promise<BlogPostItem> {
    return request<BlogPostItem>(`/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(post),
    });
  },

  async deleteBlogPost(id: number): Promise<boolean> {
    await request(`/blog/${id}`, { method: 'DELETE' });
    return true;
  },

  // SMTP Settings
  async getSmtpSettings(): Promise<SmtpSettings> {
    try {
      const res = await request<SmtpSettings>('/settings/smtp');
      return res;
    } catch (e) {
      return defaultSmtpSettings;
    }
  },

  async updateSmtpSettings(smtp: Partial<SmtpSettings>): Promise<SmtpSettings> {
    return request<SmtpSettings>('/settings/smtp', {
      method: 'PUT',
      body: JSON.stringify(smtp),
    });
  },

  // Users Management
  async getUsers(): Promise<any[]> {
    try {
      return await request<any[]>('/users');
    } catch (e) {
      return [
        { id: 1, email: 'admin@kinetic.studio', first_name: 'Super', last_name: 'Admin', role_id: 1, role_name: 'Super Admin', is_active: 1 },
        { id: 2, email: 'editor@kinetic.studio', first_name: 'Design', last_name: 'Lead', role_id: 3, role_name: 'Editor', is_active: 1 },
      ];
    }
  },

  async createUser(user: any): Promise<any> {
    return request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },

  async updateUser(id: number, user: any): Promise<any> {
    return request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  },

  async deleteUser(id: number): Promise<boolean> {
    await request(`/users/${id}`, { method: 'DELETE' });
    return true;
  },

  // SEO Settings
  async getSeoSettings(): Promise<Record<string, any>> {
    try {
      return await request<Record<string, any>>('/seo');
    } catch (e) {
      return {};
    }
  },

  async saveSeoSettings(seoMap: Record<string, any>): Promise<any> {
    return request<any>('/seo', {
      method: 'PUT',
      body: JSON.stringify({ seoMap }),
    });
  },

  async generateSitemap(): Promise<{ xml: string; generatedAt: string; urlCount: number }> {
    return request<{ xml: string; generatedAt: string; urlCount: number }>('/seo/sitemap/generate', {
      method: 'POST',
    });
  },

  // Global Settings & Variables
  async getGlobalSettings(): Promise<Record<string, string>> {
    try {
      return await request<Record<string, string>>('/settings');
    } catch (e) {
      return {};
    }
  },

  async updateGlobalSettings(settings: Record<string, string>, category = 'general'): Promise<any> {
    return request<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify({ settings, category }),
    });
  },
};

// Default Initial Layout Sections (if DB not populated yet)
export const defaultLayoutSections: LayoutSection[] = [
  {
    id: 'sec-hero',
    key: 'hero',
    name: 'Hero Section',
    description: 'Main landing hero with interactive kinetic typography and fluid motion dynamics.',
    visible: true,
    order: 1,
    heading: 'ENGINEERING DIGITAL MONUMENTS',
    subheading: 'KINETIC operates as an independent design laboratory bridging physical motion architecture, editorial visual identity, and high-performance digital systems.',
    primaryButtonText: 'EXPLORE ARCHIVE',
    primaryButtonLink: '/projects',
    secondaryButtonText: 'BOOK DIAGNOSTIC',
    secondaryButtonLink: '/contact',
    bgStyle: 'dark',
    spacing: 'default',
    animationEnabled: true,
  },
  {
    id: 'sec-comic',
    key: 'comic',
    name: 'Comic Panels Manifesto',
    description: 'Manga and editorial style panel grid showcasing design philosophy and methodology.',
    visible: true,
    order: 2,
    heading: 'ARCHITECTURAL MANIFESTO IN 4 PANELS',
    subheading: 'We dismantle generic SaaS tropes and reconstruct digital experience with mathematical rhythm.',
    bgStyle: 'darker',
    spacing: 'default',
    animationEnabled: true,
  },
  {
    id: 'sec-projects',
    key: 'projects',
    name: 'Featured Projects Showcase',
    description: 'Dynamic grid showcasing flagship client projects with video hover states and modal details.',
    visible: true,
    order: 3,
    heading: 'SELECTED MONUMENTS (2024–2026)',
    subheading: 'Curated architectural digital installations for high-velocity technology platforms.',
    primaryButtonText: 'VIEW ALL PROJECTS',
    primaryButtonLink: '/projects',
    bgStyle: 'dark',
    spacing: 'spacious',
    animationEnabled: true,
  },
  {
    id: 'sec-studio',
    key: 'studio',
    name: 'Studio & Methodology',
    description: 'Metrics overview, core design tenets, and operational capabilities.',
    visible: true,
    order: 4,
    heading: 'THE KINETIC LABORATORY',
    subheading: 'Operating at the intersection of spatial layout, precise front-end engineering, and brand strategy.',
    bgStyle: 'accent',
    spacing: 'default',
    animationEnabled: true,
  },
  {
    id: 'sec-faq',
    key: 'faq',
    name: 'Frequently Asked Questions',
    description: 'Accordion list addressing engagement models, timelines, and technical stack.',
    visible: true,
    order: 5,
    heading: 'ENGAGEMENT FAQS',
    subheading: 'Clear protocols on project scope, timeline expectations, and custom development.',
    bgStyle: 'dark',
    spacing: 'default',
    animationEnabled: false,
  },
  {
    id: 'sec-footer',
    key: 'footer',
    name: 'Footer & CTA Bar',
    description: 'Global footer banner with contact trigger, timezone clock, and navigation links.',
    visible: true,
    order: 6,
    heading: 'INITIATE TRANSMISSION',
    subheading: 'Ready to construct your digital monument? Schedule a diagnostic call with our principal engineers.',
    primaryButtonText: 'START A PROJECT',
    primaryButtonLink: '/contact',
    bgStyle: 'darker',
    spacing: 'default',
    animationEnabled: true,
  },
];

// Fallback Mock Data for Media Files
export const defaultMediaFiles: MediaFile[] = [
  {
    id: 1,
    filename: 'kinetic-logo-dark.svg',
    original_name: 'kinetic-logo-dark.svg',
    mime_type: 'image/svg+xml',
    file_size: 14200,
    file_path: '/uploads/logos/kinetic-logo-dark.svg',
    category: 'logos',
    created_at: '2026-07-28T10:15:00Z',
  },
  {
    id: 2,
    filename: 'vortex-spatial-hero.webp',
    original_name: 'vortex-spatial-hero.webp',
    mime_type: 'image/webp',
    file_size: 245000,
    file_path: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    category: 'projects',
    created_at: '2026-07-29T14:22:00Z',
  },
  {
    id: 3,
    filename: 'aether-neural-mesh.webp',
    original_name: 'aether-neural-mesh.webp',
    mime_type: 'image/webp',
    file_size: 310000,
    file_path: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop',
    category: 'projects',
    created_at: '2026-07-30T09:10:00Z',
  },
  {
    id: 4,
    filename: 'chronos-timepiece.webp',
    original_name: 'chronos-timepiece.webp',
    mime_type: 'image/webp',
    file_size: 198000,
    file_path: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    category: 'projects',
    created_at: '2026-07-30T11:45:00Z',
  },
  {
    id: 5,
    filename: 'manga-panel-01.png',
    original_name: 'manga-panel-01.png',
    mime_type: 'image/png',
    file_size: 512000,
    file_path: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
    category: 'comic_panels',
    created_at: '2026-07-25T16:30:00Z',
  },
  {
    id: 6,
    filename: 'studio-team-workshop.jpg',
    original_name: 'studio-team-workshop.jpg',
    mime_type: 'image/jpeg',
    file_size: 420000,
    file_path: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
    category: 'studio',
    created_at: '2026-07-26T12:00:00Z',
  },
];

export const defaultActivityLogs: ActivityLogItem[] = [
  {
    id: 101,
    user_id: 1,
    first_name: 'Principal',
    last_name: 'Admin',
    email: 'admin@kinetic.studio',
    action: 'UPDATE_LAYOUT',
    target_table: 'settings',
    target_id: 1,
    details_json: { section: 'Hero Section', change: 'Updated primary headline typography' },
    ip_address: '192.168.1.1',
    created_at: '2026-07-31T12:10:00Z',
  },
  {
    id: 102,
    user_id: 1,
    first_name: 'Principal',
    last_name: 'Admin',
    email: 'admin@kinetic.studio',
    action: 'UPLOAD_MEDIA',
    target_table: 'media_library',
    target_id: 5,
    details_json: { filename: 'manga-panel-01.png', category: 'comic_panels' },
    ip_address: '192.168.1.1',
    created_at: '2026-07-31T11:42:00Z',
  },
  {
    id: 103,
    user_id: 2,
    first_name: 'Design',
    last_name: 'Lead',
    email: 'editor@kinetic.studio',
    action: 'CREATE_PROJECT',
    target_table: 'projects',
    target_id: 14,
    details_json: { title: 'Cybernetic Interface Architecture' },
    ip_address: '10.0.0.4',
    created_at: '2026-07-31T10:15:00Z',
  },
  {
    id: 104,
    user_id: 1,
    first_name: 'Principal',
    last_name: 'Admin',
    email: 'admin@kinetic.studio',
    action: 'LOGIN',
    target_table: 'users',
    target_id: 1,
    details_json: { method: 'JWT_PASSWORD', userAgent: 'Chrome/127.0' },
    ip_address: '192.168.1.1',
    created_at: '2026-07-31T08:30:00Z',
  },
];

export const defaultSubmissions: FormSubmissionData[] = [
  {
    id: 1,
    form_id: 1,
    data_json: JSON.stringify({
      full_name: 'Elena Rostova',
      company: 'Aether Digital Labs',
      email: 'elena@aetherlabs.io',
      budget: '$50,000 - $100,000',
      service: 'Full Digital Identity & Platform Engineering',
      message: 'We are seeking an architectural overhaul of our enterprise AI platform interface.',
    }),
    ip_address: '84.22.109.4',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    created_at: '2026-07-31T09:14:22Z',
  },
  {
    id: 2,
    form_id: 1,
    data_json: JSON.stringify({
      full_name: 'Marcus Vance',
      company: 'Vortex Capital',
      email: 'marcus@vortexcap.com',
      budget: '$25,000 - $50,000',
      service: 'Web Design & Kinetic Motion System',
      message: 'Looking to construct a high-impact kinetic portal for our Q3 fund launch.',
    }),
    ip_address: '172.56.21.8',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    created_at: '2026-07-30T16:48:10Z',
  },
];

export const defaultAnalytics: DashboardAnalytics = {
  totalVisitors: 142890,
  visitorsToday: 3420,
  visitorsThisMonth: 48120,
  projectViews: 19450,
  studioViews: 12830,
  blogViews: 9140,
  contactViews: 4210,
  ctaClicks: 1840,
  bookCallClicks: 620,
  chatClicks: 410,
  portfolioClicks: 8920,
  storageUsageGb: 4.2,
  storageMaxGb: 20,
  lastLogin: 'Today at 12:42 PM',
  visitorTrends: [
    { date: 'Jul 25', visitors: 2800, pageViews: 6400 },
    { date: 'Jul 26', visitors: 3100, pageViews: 7100 },
    { date: 'Jul 27', visitors: 2950, pageViews: 6800 },
    { date: 'Jul 28', visitors: 3600, pageViews: 8200 },
    { date: 'Jul 29', visitors: 4100, pageViews: 9400 },
    { date: 'Jul 30', visitors: 3800, pageViews: 8900 },
    { date: 'Jul 31', visitors: 3420, pageViews: 8150 },
  ],
  deviceBreakdown: [
    { name: 'Desktop', value: 64, fill: '#0097FF' },
    { name: 'Mobile', value: 28, fill: '#38bdf8' },
    { name: 'Tablet', value: 8, fill: '#818cf8' },
  ],
  browserBreakdown: [
    { name: 'Chrome', value: 58, fill: '#2563eb' },
    { name: 'Safari', value: 24, fill: '#0284c7' },
    { name: 'Firefox', value: 11, fill: '#6366f1' },
    { name: 'Edge', value: 7, fill: '#94a3b8' },
  ],
  countryBreakdown: [
    { country: 'United States', code: 'US', visitors: 58400, percentage: 41 },
    { country: 'United Kingdom', code: 'GB', visitors: 24300, percentage: 17 },
    { country: 'Germany', code: 'DE', visitors: 18600, percentage: 13 },
    { country: 'Japan', code: 'JP', visitors: 14200, percentage: 10 },
    { country: 'France', code: 'FR', visitors: 11100, percentage: 8 },
  ],
};

export const defaultProjects: ProjectCMSItem[] = [
  {
    id: 1,
    slug: 'vanguard-orbital',
    title: 'Vanguard Orbital HQ',
    client: 'Vanguard Aerospace',
    year: '2026',
    grid_span: 'col-span-12 md:col-span-8',
    aspect_ratio: 'aspect-[16/10]',
    description: 'Kinetic spatial architecture and command center interface system.',
    full_case_study: 'A complete architectural visual identity and real-time telemetry dashboard.',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    is_featured: true,
    is_published: true,
    sort_order: 1,
  },
  {
    id: 2,
    slug: 'kuroda-museum',
    title: 'Kuroda Museum Pavilion',
    client: 'Kuroda Foundation Tokyo',
    year: '2025',
    grid_span: 'col-span-12 md:col-span-4',
    aspect_ratio: 'aspect-[3/4]',
    description: 'Monolithic digital gallery and interactive archive exhibit.',
    full_case_study: 'Minimalist physical pavilion integrated with high-frequency e-paper display walls.',
    image_url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop',
    is_featured: true,
    is_published: true,
    sort_order: 2,
  },
];

export const defaultStudioData: StudioPageData = {
  id: 1,
  hero_title: 'Engineering digital monuments with architectural discipline',
  hero_subtitle: 'KINETIC operates as an independent design laboratory bridging physical motion architecture, editorial visual identity, and high-performance digital systems.',
  philosophy_content: 'We view digital spaces not as disposable interfaces, but as enduring architectural structures.',
  metrics_json: JSON.stringify([
    { label: 'Monuments Built', value: '48+' },
    { label: 'Design Awards', value: '18' },
    { label: 'Global Clients', value: '12' },
  ]),
};

export const defaultBlogPosts: BlogPostItem[] = [
  {
    id: 1,
    title: 'The Discipline of Spatial Typography',
    slug: 'discipline-of-spatial-typography',
    excerpt: 'Exploring architectural letterforms and continuous motion layouts in digital systems.',
    content: 'Full article body detailing grid alignment and mathematical typographic scales...',
    cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    category_id: 1,
    category_name: 'Design Manifesto',
    author_id: 1,
    author_name: 'Principal Admin',
    is_published: true,
    published_at: new Date().toISOString(),
    view_count: 342,
  },
];

export const defaultSmtpSettings: SmtpSettings = {
  host: 'smtp.hostinger.com',
  port: 465,
  username: 'noreply@kinetic-studio.com',
  from_email: 'contact@kinetic-studio.com',
  from_name: 'KINETIC Studio',
  encryption: 'ssl',
  is_active: true,
};
