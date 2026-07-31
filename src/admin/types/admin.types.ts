export interface AdminUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
  role_name?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface LayoutSection {
  id: string;
  key: string;
  name: string;
  description: string;
  visible: boolean;
  order: number;
  heading: string;
  subheading: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  bgStyle: 'dark' | 'darker' | 'accent' | 'glass';
  spacing: 'compact' | 'default' | 'spacious';
  animationEnabled: boolean;
  imageUrl?: string;
}

export interface MediaFile {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  file_path: string;
  category: 'logos' | 'projects' | 'studio' | 'blog' | 'comic_panels' | 'general';
  uploaded_by?: number;
  created_at: string;
}

export interface StatMetric {
  id: string;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  timeframe?: string;
  category: 'visitors' | 'views' | 'clicks' | 'system';
}

export interface FormSubmissionData {
  id: number;
  form_id: number;
  data_json: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface ActivityLogItem {
  id: number;
  user_id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  action: string;
  target_table?: string;
  target_id?: number;
  details_json?: any;
  ip_address?: string;
  created_at: string;
}

export interface ProjectCMSItem {
  id: number;
  slug: string;
  title: string;
  client: string;
  year: string;
  grid_span?: string;
  aspect_ratio?: string;
  description?: string;
  full_case_study?: string;
  image_url?: string;
  is_featured: boolean;
  is_published: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface StudioPageData {
  id?: number;
  hero_title: string;
  hero_subtitle: string;
  philosophy_content: string;
  metrics_json?: string;
  updated_at?: string;
}

export interface BlogPostItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  cover_image?: string;
  category_id?: number;
  category_name?: string;
  author_id?: number;
  author_name?: string;
  is_published: boolean;
  published_at?: string;
  view_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SmtpSettings {
  id?: number;
  host: string;
  port: number;
  username?: string;
  from_email: string;
  from_name: string;
  encryption: 'ssl' | 'tls' | 'none';
  is_active: boolean;
}

export interface FormFieldSpec {
  id: string;
  label: string;
  name: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface DashboardAnalytics {
  totalVisitors: number;
  visitorsToday: number;
  visitorsThisMonth: number;
  projectViews: number;
  studioViews: number;
  blogViews: number;
  contactViews: number;
  ctaClicks: number;
  bookCallClicks: number;
  chatClicks: number;
  portfolioClicks: number;
  storageUsageGb: number;
  storageMaxGb: number;
  lastLogin: string;
  visitorTrends: Array<{ date: string; visitors: number; pageViews: number }>;
  deviceBreakdown: Array<{ name: string; value: number; fill: string }>;
  browserBreakdown: Array<{ name: string; value: number; fill: string }>;
  countryBreakdown: Array<{ country: string; code: string; visitors: number; percentage: number }>;
}
