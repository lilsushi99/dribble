import { isDbConnected, query } from '../config/database';
import { Project } from '../types';

let memoryProjects: Project[] = [
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
    image_url: '/assets/images/project_artwork_1_1785513185877.jpg',
    is_featured: true,
    is_published: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    image_url: '/assets/images/project_artwork_2_1785513204720.jpg',
    is_featured: true,
    is_published: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export class ProjectRepository {
  async findAll(): Promise<Project[]> {
    if (isDbConnected()) {
      const sql = `SELECT * FROM projects WHERE is_published = 1 ORDER BY sort_order ASC, id DESC`;
      return query<Project[]>(sql);
    }
    return memoryProjects;
  }

  async findBySlug(slug: string): Promise<Project | null> {
    if (isDbConnected()) {
      const sql = `SELECT * FROM projects WHERE slug = ? LIMIT 1`;
      const rows = await query<Project[]>(sql, [slug]);
      return rows.length ? rows[0] : null;
    }
    return memoryProjects.find((p) => p.slug === slug) || null;
  }

  async create(proj: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const now = new Date().toISOString();
    if (isDbConnected()) {
      const sql = `
        INSERT INTO projects (slug, title, client, year, grid_span, aspect_ratio, description, full_case_study, image_url, is_featured, is_published, sort_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      const res: any = await query(sql, [
        proj.slug,
        proj.title,
        proj.client,
        proj.year,
        proj.grid_span || 'col-span-12 md:col-span-6',
        proj.aspect_ratio || 'aspect-[4/3]',
        proj.description || null,
        proj.full_case_study || null,
        proj.image_url || null,
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
          values.push(value);
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
      const rows = await query<Project[]>(sql, [id]);
      return rows.length ? rows[0] : null;
    }
    return memoryProjects.find((p) => p.id === id) || null;
  }
}
