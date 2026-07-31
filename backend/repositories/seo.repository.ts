import { isDbConnected, query } from '../config/database';

export interface SeoRecord {
  id?: number;
  page_key: string;
  meta_title: string;
  meta_description: string;
  keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  canonical_url?: string;
  updated_at?: string;
}

let memorySeoRecords: Record<string, SeoRecord> = {
  global: {
    page_key: 'global',
    meta_title: 'KINETIC — High-Performance Motion Architecture & Digital Systems',
    meta_description: 'KINETIC operates as an independent design laboratory bridging physical motion architecture, editorial visual identity, and high-performance digital systems.',
    keywords: 'motion architecture, digital studio, design laboratory, kinetic systems',
    og_title: 'KINETIC — High-Performance Digital Systems',
    og_description: 'Independent design laboratory engineering digital monuments with architectural discipline.',
    og_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    canonical_url: 'https://kinetic.studio',
  },
  homepage: {
    page_key: 'homepage',
    meta_title: 'KINETIC | Kinetic Motion & Digital Architecture',
    meta_description: 'Welcome to KINETIC. We build bespoke digital spaces and motion systems.',
    keywords: 'kinetic, motion design, architectural web, luxury digital',
    og_title: 'KINETIC | Home',
    og_description: 'Explore our latest motion architecture and kinetic studio projects.',
    og_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  },
  studio: {
    page_key: 'studio',
    meta_title: 'Studio & Laboratory — KINETIC',
    meta_description: 'Our design philosophy, laboratory practices, and kinetic team.',
    keywords: 'studio philosophy, kinetic laboratory, spatial typography',
    og_title: 'Studio & Laboratory — KINETIC',
    og_description: 'Engineering digital monuments with architectural discipline.',
    og_image_url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop',
  },
  projects: {
    page_key: 'projects',
    meta_title: 'Selected Projects & Portfolio — KINETIC',
    meta_description: 'Explore selected architectural digital projects and case studies.',
    keywords: 'portfolio, architectural projects, case studies, digital monuments',
    og_title: 'Selected Projects — KINETIC',
    og_description: 'Explore selected architectural digital projects and case studies.',
    og_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  },
  blog: {
    page_key: 'blog',
    meta_title: 'Editorial Archives & Essays — KINETIC',
    meta_description: 'Manifestos, technical essays, and spatial design perspectives.',
    keywords: 'blog, essays, spatial typography, design manifesto',
    og_title: 'Editorial Archives — KINETIC',
    og_description: 'Manifestos, technical essays, and spatial design perspectives.',
    og_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  },
  contact: {
    page_key: 'contact',
    meta_title: 'Initiate Commission — KINETIC Contact',
    meta_description: 'Connect with KINETIC for high-impact spatial design and digital commissions.',
    keywords: 'contact, commission, hire kinetic studio, inquiry',
    og_title: 'Initiate Commission — KINETIC',
    og_description: 'Connect with KINETIC for high-impact spatial design and digital commissions.',
    og_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  },
};

export class SeoRepository {
  async getSeoByPageKey(pageKey: string): Promise<SeoRecord | null> {
    if (isDbConnected()) {
      const sql = `SELECT * FROM seo_settings WHERE page_key = ? LIMIT 1`;
      const rows = await query<SeoRecord[]>(sql, [pageKey]);
      return rows.length ? rows[0] : memorySeoRecords[pageKey] || null;
    }
    return memorySeoRecords[pageKey] || null;
  }

  async getAllSeoSettings(): Promise<Record<string, SeoRecord>> {
    if (isDbConnected()) {
      const sql = `SELECT * FROM seo_settings`;
      const rows = await query<SeoRecord[]>(sql);
      const res: Record<string, SeoRecord> = { ...memorySeoRecords };
      rows.forEach((r) => {
        res[r.page_key] = r;
      });
      return res;
    }
    return memorySeoRecords;
  }

  async saveSeoSetting(data: SeoRecord): Promise<SeoRecord> {
    if (isDbConnected()) {
      const sql = `
        INSERT INTO seo_settings (page_key, meta_title, meta_description, keywords, og_title, og_description, og_image_url, canonical_url, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE 
          meta_title = VALUES(meta_title),
          meta_description = VALUES(meta_description),
          keywords = VALUES(keywords),
          og_title = VALUES(og_title),
          og_description = VALUES(og_description),
          og_image_url = VALUES(og_image_url),
          canonical_url = VALUES(canonical_url),
          updated_at = NOW()
      `;
      await query(sql, [
        data.page_key,
        data.meta_title,
        data.meta_description || null,
        data.keywords || null,
        data.og_title || null,
        data.og_description || null,
        data.og_image_url || null,
        data.canonical_url || null,
      ]);
      const updated = await this.getSeoByPageKey(data.page_key);
      return updated!;
    }

    memorySeoRecords[data.page_key] = {
      ...memorySeoRecords[data.page_key],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return memorySeoRecords[data.page_key];
  }
}
