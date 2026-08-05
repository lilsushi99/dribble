import { isDbConnected, query } from '../config/database';
import { BlogPost } from '../types';

let memoryBlogPosts: BlogPost[] = [
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
    view_count: 540,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    view_count: 382,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    view_count: 290,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    view_count: 215,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export class BlogRepository {
  async findAll(): Promise<BlogPost[]> {
    if (isDbConnected()) {
      const sql = `SELECT * FROM blog_posts ORDER BY id DESC`;
      return query<BlogPost[]>(sql);
    }
    return memoryBlogPosts;
  }

  async findPublished(): Promise<BlogPost[]> {
    return this.findAll();
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
