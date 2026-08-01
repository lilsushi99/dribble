import { isDbConnected, query } from '../config/database';
import { Project } from '../types';

let memoryProjects: Project[] = [];

export class ProjectRepository {
  async findAll(): Promise<Project[]> {
    if (isDbConnected()) {
      const sql = `SELECT * FROM projects ORDER BY sort_order ASC, id DESC`;
      const rows = await query<any[]>(sql);
      return rows.map((r) => ({
        ...r,
        tools_used: typeof r.tools_used === 'string' ? JSON.parse(r.tools_used || '[]') : r.tools_used || [],
        gallery_images: typeof r.gallery_images === 'string' ? JSON.parse(r.gallery_images || '[]') : r.gallery_images || [],
        is_featured: Boolean(r.is_featured),
        is_published: Boolean(r.is_published),
      }));
    }
    return memoryProjects;
  }

  async findPublished(): Promise<Project[]> {
    const all = await this.findAll();
    return all.filter((p) => p.is_published);
  }

  async findBySlug(slug: string): Promise<Project | null> {
    if (isDbConnected()) {
      const sql = `SELECT * FROM projects WHERE slug = ? LIMIT 1`;
      const rows = await query<any[]>(sql, [slug]);
      if (!rows.length) return null;
      const r = rows[0];
      return {
        ...r,
        tools_used: typeof r.tools_used === 'string' ? JSON.parse(r.tools_used || '[]') : r.tools_used || [],
        gallery_images: typeof r.gallery_images === 'string' ? JSON.parse(r.gallery_images || '[]') : r.gallery_images || [],
        is_featured: Boolean(r.is_featured),
        is_published: Boolean(r.is_published),
      };
    }
    return memoryProjects.find((p) => p.slug === slug) || null;
  }

  async create(proj: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const now = new Date().toISOString();
    const toolsUsedJson = JSON.stringify(proj.tools_used || []);
    const galleryImagesJson = JSON.stringify(proj.gallery_images || []);

    if (isDbConnected()) {
      const sql = `
        INSERT INTO projects (slug, title, client, year, grid_span, aspect_ratio, description, full_case_study, image_url, tools_used, gallery_images, is_featured, is_published, sort_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      await query(sql, [
        proj.slug,
        proj.title,
        proj.client || '',
        proj.year,
        proj.grid_span || 'col-span-12 md:col-span-6',
        proj.aspect_ratio || 'aspect-[4/3]',
        proj.description || '',
        proj.full_case_study || null,
        proj.image_url || '',
        toolsUsedJson,
        galleryImagesJson,
        proj.is_featured ? 1 : 0,
        proj.is_published ? 1 : 0,
        proj.sort_order || 0,
      ]);

      const created = await this.findBySlug(proj.slug);
      return created!;
    }

    const newProj: Project = {
      ...proj,
      id: memoryProjects.length + 1,
      tools_used: proj.tools_used || [],
      gallery_images: proj.gallery_images || [],
      created_at: now,
      updated_at: now,
    };
    memoryProjects.push(newProj);
    return newProj;
  }

  async update(id: number, proj: Partial<Project>): Promise<Project | null> {
    if (isDbConnected()) {
      const fields: string[] = [];
      const values: any[] = [];

      Object.entries(proj).forEach(([key, value]) => {
        if (key !== 'id') {
          fields.push(`${key} = ?`);
          if (key === 'tools_used' || key === 'gallery_images') {
            values.push(JSON.stringify(value || []));
          } else if (key === 'is_featured' || key === 'is_published') {
            values.push(value ? 1 : 0);
          } else {
            values.push(value);
          }
        }
      });

      if (fields.length === 0) return this.findById(id);

      values.push(id);
      const sql = `UPDATE projects SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
      await query(sql, values);
      return this.findById(id);
    }

    const index = memoryProjects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    memoryProjects[index] = {
      ...memoryProjects[index],
      ...proj,
      updated_at: new Date().toISOString(),
    };
    return memoryProjects[index];
  }

  async delete(id: number): Promise<boolean> {
    if (isDbConnected()) {
      const sql = `DELETE FROM projects WHERE id = ?`;
      await query(sql, [id]);
      return true;
    }

    const len = memoryProjects.length;
    memoryProjects = memoryProjects.filter((p) => p.id !== id);
    return memoryProjects.length < len;
  }

  async findById(id: number): Promise<Project | null> {
    if (isDbConnected()) {
      const sql = `SELECT * FROM projects WHERE id = ? LIMIT 1`;
      const rows = await query<any[]>(sql, [id]);
      if (!rows.length) return null;
      const r = rows[0];
      return {
        ...r,
        tools_used: typeof r.tools_used === 'string' ? JSON.parse(r.tools_used || '[]') : r.tools_used || [],
        gallery_images: typeof r.gallery_images === 'string' ? JSON.parse(r.gallery_images || '[]') : r.gallery_images || [],
        is_featured: Boolean(r.is_featured),
        is_published: Boolean(r.is_published),
      };
    }
    return memoryProjects.find((p) => p.id === id) || null;
  }
}
