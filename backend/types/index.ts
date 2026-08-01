export * from './auth.types';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role_id: number;
  role_name?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  client?: string;
  year: string;
  grid_span?: string;
  aspect_ratio?: string;
  description: string;
  full_case_study?: string;
  image_url: string;
  tools_used?: string[];
  gallery_images?: string[];
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  cover_image?: string;
  category_id?: number;
  author_id?: number;
  is_published: boolean;
  published_at?: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface MediaItem {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  file_path: string;
  category: string;
  uploaded_by?: number;
  created_at: string;
}

export interface SiteSetting {
  id: number;
  setting_key: string;
  setting_value: string;
  category: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface FormSubmission {
  id: number;
  form_id: number;
  data_json: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}
