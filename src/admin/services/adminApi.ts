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
    description: 'Main landing hero with kinetic typography and background configuration.',
    visible: true,
    order: 1,
    heading: 'ENGINEERING DIGITAL MONUMENTS',
    subheading: 'KINETIC operates as an independent design laboratory bridging physical motion architecture, editorial visual identity, and high-performance digital systems.',
    primaryButtonText: 'Chat with Us',
    primaryButtonLink: '/contact',
    secondaryButtonText: 'View Project Portfolio',
    secondaryButtonLink: '/projects',
    bgType: 'color',
    bgColor: '#000000',
    bgImage: '',
    bgStyle: 'dark',
    spacing: 'default',
    animationEnabled: true,
  },
  {
    id: 'sec-marquee',
    key: 'marquee',
    name: 'Marquee Banner',
    description: 'Continuous dual-row kinetic ticker banner.',
    visible: true,
    order: 2,
    heading: 'MARQUEE BANNER',
    subheading: 'Top and bottom row word marquee ticker.',
    marqueeData: {
      topWords: ['KINETIC', 'DESIGN', 'ARCHITECTURE', 'MOTION', 'DIGITAL'],
      bottomWords: ['MONUMENTS', 'ENGINEERING', 'INTERFACES', 'SYSTEMS', 'LABORATORY'],
      speed: 30,
      direction: 'left',
      pauseOnHover: true,
      visible: true,
    },
    bgStyle: 'darker',
    spacing: 'compact',
    animationEnabled: true,
  },
  {
    id: 'sec-comic',
    key: 'comic',
    name: 'Comic Panel Section',
    description: 'Sequential panel grid showcasing design philosophy and image bursts.',
    visible: true,
    order: 3,
    heading: 'ARCHITECTURAL MANIFESTO',
    subheading: 'We dismantle generic SaaS tropes and reconstruct digital experience.',
    comicPanels: {
      panel1: { images: [], count: 0, speed: 20 },
      panel2: { images: [], count: 0, speed: 25 },
      panel3: { images: [], count: 0, speed: 30 },
    },
    bgStyle: 'darker',
    spacing: 'default',
    animationEnabled: true,
  },
  {
    id: 'sec-projects',
    key: 'projects',
    name: 'Featured Projects Showcase',
    description: 'Dynamic grid showcasing flagship client projects.',
    visible: true,
    order: 4,
    heading: 'SELECTED MONUMENTS',
    subheading: 'Curated architectural digital installations for high-velocity technology platforms.',
    projectsLimit: 6,
    bgStyle: 'dark',
    spacing: 'spacious',
    animationEnabled: true,
  },
  {
    id: 'sec-studio',
    key: 'studio',
    name: 'Studio Story Section',
    description: 'Core design tenets, studio narrative, and direct action trigger.',
    visible: true,
    order: 5,
    heading: 'THE KINETIC LABORATORY',
    subheading: 'Operating at the intersection of spatial layout and precise front-end engineering.',
    studioStoryContent: 'We view digital spaces not as disposable interfaces, but as enduring architectural structures.',
    studioButtonText: 'LEARN MORE',
    studioButtonLink: '/studio',
    bgStyle: 'accent',
    spacing: 'default',
    animationEnabled: true,
  },
  {
    id: 'sec-faq',
    key: 'faq',
    name: 'FAQ Section',
    description: 'Accordion list addressing engagement models, timelines, and technical stack.',
    visible: true,
    order: 6,
    heading: 'ENGAGEMENT FAQS',
    subheading: 'Clear protocols on project scope, timeline expectations, and custom development.',
    faqs: [],
    bgStyle: 'dark',
    spacing: 'default',
    animationEnabled: false,
  },
];

export const defaultMediaFiles: MediaFile[] = [];

export const defaultActivityLogs: ActivityLogItem[] = [];

export const defaultSubmissions: FormSubmissionData[] = [];

export const defaultAnalytics: DashboardAnalytics = {
  totalVisitors: 0,
  visitorsToday: 0,
  visitorsThisMonth: 0,
  projectViews: 0,
  studioViews: 0,
  blogViews: 0,
  contactViews: 0,
  ctaClicks: 0,
  bookCallClicks: 0,
  chatClicks: 0,
  portfolioClicks: 0,
  storageUsageGb: 0,
  storageMaxGb: 0,
  lastLogin: 'No logins recorded yet',
  visitorTrends: [],
  deviceBreakdown: [],
  browserBreakdown: [],
  countryBreakdown: [],
};

export const defaultProjects: ProjectCMSItem[] = [];

export const defaultStudioData: StudioPageData = {
  id: 1,
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
    { id: '1', title: 'Mission', description: 'To strip away superfluous digital decoration and build quiet, high-contrast digital monuments that command immediate respect and lasting clarity.' },
    { id: '2', title: 'Vision', description: 'A web ecosystem where interactive architecture exhibits physical weight, tactile responsiveness, and editorial craftsmanship worthy of museum archival status.' },
    { id: '3', title: 'Philosophy', description: 'We treat layout margins, typographic scale ratios, and animation inertia curves as mathematical laws, ensuring every interface feels bespoke and deliberate.' },
  ],
  show_comic_panel: true,
  show_counter: true,
  cta_heading: "You've seen how we think. Now explore what we've built.",
  cta_description: 'Examine our curated archive of interactive monuments, physical artefacts, and digital brand architecture.',
  cta_button_text: 'Explore Selected Projects',
  cta_button_url: '/projects',
  show_cta: true,
};

export const defaultBlogPosts: BlogPostItem[] = [];

export const defaultSmtpSettings: SmtpSettings = {
  host: 'smtp.hostinger.com',
  port: 465,
  username: '',
  from_email: '',
  from_name: 'KINETIC Studio',
  encryption: 'ssl',
  is_active: true,
};

