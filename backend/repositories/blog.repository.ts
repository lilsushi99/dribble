import { isDbConnected, query } from '../config/database';
import { BlogPost } from '../types';

let memoryBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'The Discipline of Spatial Typography',
    slug: 'discipline-of-spatial-typography',
    excerpt: 'Exploring architectural letterforms and continuous motion layouts in digital systems.',
    content: 'Full article body detailing grid alignment and mathematical typographic scales...',
    cover_image: '/assets/images/project_artwork_1_1785513185877.jpg',
    category_id: 1,
    author_id: 1,
    is_published: true,
    published_at: new Date().toISOString(),
    view_count: 342,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export class BlogRepository {
  async findAll(): Promise<BlogPost[]> {
    if (isDbConnected()) {
      const sql = `SELECT * FROM blog_posts WHERE is_published = 1 ORDER BY id DESC`;
      return query<BlogPost[]>(sql);
    }
    return memoryBlogPosts;
  }

  async findBySlug(slug: string): Promise<BlogPost | null> {
    if (isDbConnected()) {
      const sql = `SELECT * FROM blog_posts WHERE slug = ? LIMIT 1`;
      const rows = await query<BlogPost[]>(sql, [slug]);
      return rows.length ? rows[0] : null;
    }
    return memoryBlogPosts.find((p) => p.slug === slug) || null;
  }

  async create(post: Omit<BlogPost, 'id' | 'view_count' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    const now = new Date().toISOString();
    if (isDbConnected()) {
      const sql = `
        INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, category_id, author_id, is_published, published_at, view_count, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())
      `;
      const res: any = await query(sql, [
        post.title,
        post.slug,
        post.excerpt || null,
        post.content || null,
        post.cover_image || null,
        post.category_id || null,
        post.author_id || null,
        post.is_published ? 1 : 0,
        post.published_at || null,
      ]);

      const created = await this.findBySlug(post.slug);
      return created!;
    }

    const newPost: BlogPost = {
      ...post,
      id: memoryBlogPosts.length + 1,
      view_count: 0,
      created_at: now,
      updated_at: now,
    };
    memoryBlogPosts.push(newPost);
    return newPost;
  }

  async findById(id: number): Promise<BlogPost | null> {
    if (isDbConnected()) {
      const sql = `SELECT * FROM blog_posts WHERE id = ? LIMIT 1`;
      const rows = await query<BlogPost[]>(sql, [id]);
      return rows.length ? rows[0] : null;
    }
    return memoryBlogPosts.find((p) => p.id === id) || null;
  }

  async update(id: number, post: Partial<BlogPost>): Promise<BlogPost | null> {
    if (isDbConnected()) {
      const fields: string[] = [];
      const values: any[] = [];

      Object.entries(post).forEach(([key, value]) => {
        if (key !== 'id') {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      });

      if (fields.length === 0) return this.findById(id);

      values.push(id);
      const sql = `UPDATE blog_posts SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
      await query(sql, values);
      return this.findById(id);
    }

    const index = memoryBlogPosts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    memoryBlogPosts[index] = {
      ...memoryBlogPosts[index],
      ...post,
      updated_at: new Date().toISOString(),
    };
    return memoryBlogPosts[index];
  }

  async delete(id: number): Promise<boolean> {
    if (isDbConnected()) {
      const sql = `DELETE FROM blog_posts WHERE id = ?`;
      await query(sql, [id]);
      return true;
    }

    const len = memoryBlogPosts.length;
    memoryBlogPosts = memoryBlogPosts.filter((p) => p.id !== id);
    return memoryBlogPosts.length < len;
  }
}
