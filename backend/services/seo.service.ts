import fs from 'fs';
import path from 'path';
import { SeoRepository, SeoRecord } from '../repositories/seo.repository';
import { ProjectRepository } from '../repositories/project.repository';
import { BlogRepository } from '../repositories/blog.repository';
import { SettingRepository } from '../repositories/setting.repository';

export class SeoService {
  private seoRepo = new SeoRepository();
  private projectRepo = new ProjectRepository();
  private blogRepo = new BlogRepository();
  private settingRepo = new SettingRepository();

  async getAllSeo() {
    return this.seoRepo.getAllSeoSettings();
  }

  async saveSeo(data: SeoRecord) {
    return this.seoRepo.saveSeoSetting(data);
  }

  async saveAllSeo(seoMap: Record<string, SeoRecord>) {
    const results: Record<string, SeoRecord> = {};
    for (const pageKey of Object.keys(seoMap)) {
      results[pageKey] = await this.seoRepo.saveSeoSetting({
        ...seoMap[pageKey],
        page_key: pageKey,
      });
    }
    return results;
  }

  async generateSitemap(): Promise<{ xml: string; generatedAt: string; urlCount: number }> {
    const settings = await this.settingRepo.getAllSettings();
    const globalSeo = await this.seoRepo.getSeoByPageKey('global');

    let domain = settings['domain_url'] || globalSeo?.canonical_url || 'https://kinetic.studio';
    domain = domain.replace(/\/$/, '');

    const now = new Date().toISOString().split('T')[0];

    // Core static routes
    const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = [
      { loc: `${domain}/`, lastmod: now, changefreq: 'daily', priority: '1.0' },
      { loc: `${domain}/studio`, lastmod: now, changefreq: 'weekly', priority: '0.8' },
      { loc: `${domain}/projects`, lastmod: now, changefreq: 'daily', priority: '0.9' },
      { loc: `${domain}/blog`, lastmod: now, changefreq: 'daily', priority: '0.9' },
      { loc: `${domain}/contact`, lastmod: now, changefreq: 'monthly', priority: '0.7' },
    ];

    // Fetch published projects
    try {
      const projects = await this.projectRepo.findPublished();
      projects.forEach((proj) => {
        const lastmod = proj.updated_at ? proj.updated_at.split('T')[0] : now;
        urls.push({
          loc: `${domain}/projects#${proj.slug}`,
          lastmod,
          changefreq: 'weekly',
          priority: '0.8',
        });
      });
    } catch (e) {
      console.warn('Could not fetch projects for sitemap', e);
    }

    // Fetch published blog posts
    try {
      const posts = await this.blogRepo.findPublished();
      posts.forEach((post) => {
        const lastmod = post.updated_at ? post.updated_at.split('T')[0] : now;
        urls.push({
          loc: `${domain}/blog#${post.slug}`,
          lastmod,
          changefreq: 'weekly',
          priority: '0.8',
        });
      });
    } catch (e) {
      console.warn('Could not fetch blog posts for sitemap', e);
    }

    // Build XML content
    const urlElements = urls
      .map(
        (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
      )
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;

    // Save XML file locally to public/sitemap.xml if possible
    try {
      const publicDir = path.join(process.cwd(), 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');
    } catch (err) {
      console.warn('Failed to write sitemap.xml to disk:', err);
    }

    // Store generation timestamp in settings
    await this.settingRepo.updateSetting('last_sitemap_generated', new Date().toISOString(), 'seo');

    return {
      xml,
      generatedAt: new Date().toISOString(),
      urlCount: urls.length,
    };
  }
}
