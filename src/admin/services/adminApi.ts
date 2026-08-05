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
  HomepageContent,
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

  // Homepage CMS
  async getHomepageData(): Promise<HomepageContent> {
    try {
      return await request<HomepageContent>('/homepage');
    } catch (e) {
      return defaultHomepageData;
    }
  },

  async updateHomepageData(data: Partial<HomepageContent>): Promise<HomepageContent> {
    return request<HomepageContent>('/homepage', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
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

  async getBlogPostBySlug(slug: string): Promise<BlogPostItem | null> {
    try {
      return await request<BlogPostItem>(`/blog/${slug}`);
    } catch (e) {
      const found = defaultBlogPosts.find((p) => p.slug === slug);
      return found || null;
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

  async testSmtpConnection(testEmail?: string): Promise<boolean> {
    await request('/settings/smtp/test', {
      method: 'POST',
      body: JSON.stringify({ test_email: testEmail }),
    });
    return true;
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

export const defaultHomepageData: HomepageContent = {
  id: 1,
  hero_heading: 'Crafting Digital Monuments with Sequential Comic Precision',
  hero_subtitle:
    'Comic Art Studio operates as an independent design laboratory bridging physical motion architecture, editorial visual identity, and high-performance digital systems.',
  hero_cta_primary_text: 'Chat With Us',
  hero_cta_primary_url: '#',
  hero_cta_secondary_text: 'View Portfolio',
  hero_cta_secondary_url: '/projects',
  story_title: 'The Origin & Craft',
  story_subtitle: 'Uncompromising discipline meets bespoke visual storytelling.',
  story_content:
    'Founded in 2018, Comic Art Studio emerged from a conviction that modern digital interfaces had succumbed to disposable SaaS visual formulas, homogenized component libraries, and visual noise. With over eight years of international practice, our partners approach digital architecture with the same material gravity, tactile inertia, and editorial permanence as stone, steel, and light.',
  mission_statement:
    'To strip away superfluous digital decoration and build quiet, high-contrast digital monuments that command immediate respect and lasting clarity.',
  vision_statement:
    'A web ecosystem where interactive architecture exhibits physical weight, tactile responsiveness, and editorial craftsmanship worthy of museum archival status.',
  philosophy_statement:
    'We treat layout margins, typographic scale ratios, and animation inertia curves as mathematical laws, ensuring every interface feels bespoke and deliberate.',
  statistics_json: [
    { label: 'Clients Served', value: '82' },
    { label: 'Projects Delivered', value: '120' },
    { label: 'Countries', value: '14' },
    { label: 'Design Awards', value: '6' },
  ],
  marquee_items_json: [
    'Storyboard',
    'Character Design',
    'Comic Art',
    'Visual Development',
    'Concept Art',
    'Manga',
    'Sequential Art',
    'Illustration',
    'World Building',
    'Narrative Design',
    'Digital Painting',
    'Environment Design',
    'Creative Direction',
    'Graphic Storytelling',
    'Editorial Illustration',
    'Visual Identity',
    'Motion Graphics',
    'Brand Design',
    'Typography',
    'Animation',
  ],
  cta_title: 'Initiate Your Commission',
  cta_subtitle:
    'Partner with our studio to engineer a bespoke digital monument tailored to your brand architecture.',
  cta_button_text: 'Connect with Atelier',
  cta_button_url: '/contact',
};

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

export const defaultBlogPosts: BlogPostItem[] = [
  {
    id: 1,
    title: 'Architectural Inertia in Digital Interfaces: Beyond Disposable SaaS Aesthetics',
    slug: 'architectural-inertia-in-digital-interfaces',
    excerpt: 'Why modern interactive architecture must abandon ephemeral glassmorphism and spring physics in favor of material mass, tactile friction, and structural weight that lasts across decades.',
    content: `<h2>The Philosophy of Mass and Weight</h2><p>Modern interactive design has reached a point of visual homogenization. Ephemeral drop shadows, soft pastel gradients, and generic UI components dominate web applications. At Comic Art Studio, we believe visual interfaces should possess narrative inertia—a tactile sense of physical weight and structural permanence.</p><p>Sequential art and comic design teach us that every frame, gutter, and stroke carries intentional weight. When applied to digital systems, this mindset shifts UI design from temporary skinning to architectural drafting.</p><blockquote>"Visual weight isn't merely cosmetic; it creates spatial hierarchy and guides human focus with unyielding clarity."</blockquote><h3>Principles of Structural Inking</h3><ul><li>High contrast line work with deliberate weight distribution</li><li>Clear paneling and gutter grid alignment</li><li>Editorial typography paired with expressive character dynamics</li></ul><p>By treating layout margins, typographic ratios, and panel transitions as physical constraints, digital products transcend temporary visual trends and become timeless brand monuments.</p>`,
    cover_image: '/assets/images/hero_nebula_bg_1785513204720.jpg',
    category_name: 'Design Philosophy',
    author_name: 'Evelyn Kuroda',
    author_role: 'Design Partner',
    read_time: '7 min read',
    is_featured: true,
    is_published: true,
    published_at: '2026-07-28',
    meta_title: 'Architectural Inertia in Digital Interfaces | Comic Art Studio',
    meta_description: 'Explore why modern digital architecture must favor material mass, tactile friction, and structural weight.',
    keywords: 'comic design, sequential art, UI architecture, digital permanence',
    tags: ['Design', 'Sequential Art', 'Architecture'],
  },
  {
    id: 2,
    title: 'Sequential Manga Panels as UI Storyboarding Frameworks',
    slug: 'sequential-manga-panels-as-ui-storyboarding-frameworks',
    excerpt: 'Translating Japanese manga panel pacing, gutter tension, and high-contrast ink techniques into high-conversion digital narrative arcs.',
    content: `<h2>Translating Manga Paneling to Digital User Journeys</h2><p>Manga artists have perfected the art of guiding the reader's gaze across dense visual information. Through strategic variation in panel size, angle, and gutter spacing, sequential storytellers control emotion, suspense, and comprehension.</p><p>In digital interface design, user journeys follow identical principles. A landing page is not a disconnected series of cards—it is a continuous sequential narrative.</p><h3>Key Techniques</h3><ul><li><strong>Panel Hierarchy:</strong> Establishing primary hero visuals that establish setting before zooming into detailed features.</li><li><strong>Gutter Tension:</strong> Utilizing whitespace between sections to create natural cognitive breathing room.</li><li><strong>Speed Lines & Inking:</strong> Using subtle motion lines to draw attention toward key calls to action.</li></ul><p>By structuring digital layouts like serialized manga pages, user engagement increases dramatically as visitors naturally flow through the storytelling grid.</p>`,
    cover_image: '/assets/images/project_artwork_1_1785513185877.jpg',
    category_name: 'Conceptual Methodology',
    author_name: 'Kenji Sato',
    author_role: 'Lead Comic Artist',
    read_time: '8 min read',
    is_featured: false,
    is_published: true,
    published_at: '2026-07-14',
    meta_title: 'Sequential Manga Panels as UI Frameworks | Comic Art Studio',
    meta_description: 'Translating Japanese manga panel pacing and ink techniques into digital narrative arcs.',
    keywords: 'manga panels, UI storyboarding, sequential storytelling',
    tags: ['Manga', 'UI Design', 'Storyboarding'],
  },
  {
    id: 3,
    title: 'The Death of Disposable Web Templates',
    slug: 'the-death-of-disposable-web-templates',
    excerpt: 'How homogenized AI generators are driving visionary founders back toward bespoke editorial typography, custom shader physics, and physical brand monuments.',
    content: `<h2>The Counter-Revolution of Craft</h2><p>As automated website builders make basic web pages trivial to generate, generic templates lose all value. When every website looks like the same pre-built template, distinct visual identity becomes the ultimate competitive advantage.</p><p>Forward-thinking founders and creators are seeking bespoke craftsmanship—custom character art, hand-drawn illustration systems, unique typographic pairings, and deliberate interactive transitions.</p><h3>Why Bespoke Comic & Narrative Craft Wins</h3><ul><li>Instant brand recognition through unique visual language</li><li>Emotional connection forged by custom character art</li><li>High durability and distinction against cookie-cutter platforms</li></ul>`,
    cover_image: '/assets/images/project_artwork_2_1785513204720.jpg',
    category_name: 'Brand Architecture',
    author_name: 'Marcus Vance',
    author_role: 'Creative Director',
    read_time: '5 min read',
    is_featured: false,
    is_published: true,
    published_at: '2026-06-29',
    meta_title: 'The Death of Disposable Web Templates | Comic Art Studio',
    meta_description: 'Why visionary founders are moving away from generic templates toward custom narrative craft.',
    keywords: 'web design, brand architecture, custom illustration, comic art',
    tags: ['Branding', 'Craftsmanship', 'Design Trends'],
  },
  {
    id: 4,
    title: 'Obsidian & Titanium: Materials of Digital Permanence',
    slug: 'obsidian-and-titanium-materials-of-digital-permanence',
    excerpt: 'A study on physical craftsmanship, tactile hardware interfaces, and spatial acoustic pavilions constructed for high-net-worth archives.',
    content: `<h2>Bridging Physical Craft and Digital Narratives</h2><p>Physical printing of graphic novels and art books demands extreme attention to paper stock, ink viscosity, foil stamping, and binding durability. Bringing this same obsession to digital design creates experiences that feel physical, solid, and enduring.</p><p>We explore how high-contrast dark palettes, tactile micro-interactions, and heavy editorial typography create a sense of digital permanence akin to dark obsidian and brushed titanium.</p>`,
    cover_image: '/assets/images/project_artwork_3_1785513218624.jpg',
    category_name: 'Physical & Spatial Craft',
    author_name: 'Julian Thorne',
    author_role: 'Art Director',
    read_time: '6 min read',
    is_featured: false,
    is_published: true,
    published_at: '2026-06-11',
    meta_title: 'Obsidian & Titanium: Materials of Digital Permanence | Comic Art Studio',
    meta_description: 'A study on physical craftsmanship and material permanence in digital interfaces.',
    keywords: 'digital permanence, visual craft, design theory',
    tags: ['Craft', 'Materials', 'Visual Arts'],
  },
];

export const defaultSmtpSettings: SmtpSettings = {
  host: 'smtp.hostinger.com',
  port: 465,
  username: '',
  from_email: '',
  from_name: 'KINETIC Studio',
  encryption: 'ssl',
  is_active: true,
};

