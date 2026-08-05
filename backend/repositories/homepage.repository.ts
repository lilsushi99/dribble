import { isDbConnected, query } from '../config/database';

let memoryHomepage = {
  id: 1,
  hero_heading: 'Crafting Digital Monuments with Sequential Comic Precision',
  hero_subtitle:
    'Comic Art Studio operates as an independent design laboratory bridging physical motion architecture, editorial visual identity, and high-performance digital systems.',
  hero_cta_primary_text: 'Explore Selected Projects',
  hero_cta_primary_url: '/projects',
  hero_cta_secondary_text: 'Read Studio Philosophy',
  hero_cta_secondary_url: '/studio',
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
    'Sequential Storytelling',
    'Bespoke Inking',
    'Architectural UI',
    'Physical Motion',
    'Titanium Craft',
    'Obsidian Aesthetics',
  ],
  cta_title: 'Initiate Your Commission',
  cta_subtitle:
    'Partner with our studio to engineer a bespoke digital monument tailored to your brand architecture.',
  cta_button_text: 'Connect with Atelier',
  cta_button_url: '/contact',
};

export class HomepageRepository {
  async getHomepageData(): Promise<any> {
    if (isDbConnected()) {
      const sql = `SELECT * FROM homepage_content ORDER BY id ASC LIMIT 1`;
      const rows = await query<any[]>(sql);
      if (rows.length) {
        const r = rows[0];
        return {
          id: r.id || 1,
          hero_heading: r.hero_heading || memoryHomepage.hero_heading,
          hero_subtitle: r.hero_subtitle || memoryHomepage.hero_subtitle,
          hero_cta_primary_text: r.hero_cta_primary_text || memoryHomepage.hero_cta_primary_text,
          hero_cta_primary_url: r.hero_cta_primary_url || memoryHomepage.hero_cta_primary_url,
          hero_cta_secondary_text: r.hero_cta_secondary_text || memoryHomepage.hero_cta_secondary_text,
          hero_cta_secondary_url: r.hero_cta_secondary_url || memoryHomepage.hero_cta_secondary_url,
          story_title: r.story_title || memoryHomepage.story_title,
          story_subtitle: r.story_subtitle || memoryHomepage.story_subtitle,
          story_content: r.story_content || memoryHomepage.story_content,
          mission_statement: r.mission_statement || memoryHomepage.mission_statement,
          vision_statement: r.vision_statement || memoryHomepage.vision_statement,
          philosophy_statement: r.philosophy_statement || memoryHomepage.philosophy_statement,
          statistics_json:
            typeof r.statistics_json === 'string'
              ? JSON.parse(r.statistics_json)
              : r.statistics_json || memoryHomepage.statistics_json,
          marquee_items_json:
            typeof r.marquee_items_json === 'string'
              ? JSON.parse(r.marquee_items_json)
              : r.marquee_items_json || memoryHomepage.marquee_items_json,
          cta_title: r.cta_title || memoryHomepage.cta_title,
          cta_subtitle: r.cta_subtitle || memoryHomepage.cta_subtitle,
          cta_button_text: r.cta_button_text || memoryHomepage.cta_button_text,
          cta_button_url: r.cta_button_url || memoryHomepage.cta_button_url,
        };
      }
      return memoryHomepage;
    }
    return memoryHomepage;
  }

  async updateHomepageData(data: any): Promise<any> {
    if (isDbConnected()) {
      const statsJson = JSON.stringify(data.statistics_json || []);
      const marqueeJson = JSON.stringify(data.marquee_items_json || []);

      const sql = `
        INSERT INTO homepage_content (
          id, hero_heading, hero_subtitle, hero_cta_primary_text, hero_cta_primary_url,
          hero_cta_secondary_text, hero_cta_secondary_url, story_title, story_subtitle,
          story_content, mission_statement, vision_statement, philosophy_statement,
          statistics_json, marquee_items_json, cta_title, cta_subtitle, cta_button_text,
          cta_button_url, updated_at
        )
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
          hero_heading = VALUES(hero_heading),
          hero_subtitle = VALUES(hero_subtitle),
          hero_cta_primary_text = VALUES(hero_cta_primary_text),
          hero_cta_primary_url = VALUES(hero_cta_primary_url),
          hero_cta_secondary_text = VALUES(hero_cta_secondary_text),
          hero_cta_secondary_url = VALUES(hero_cta_secondary_url),
          story_title = VALUES(story_title),
          story_subtitle = VALUES(story_subtitle),
          story_content = VALUES(story_content),
          mission_statement = VALUES(mission_statement),
          vision_statement = VALUES(vision_statement),
          philosophy_statement = VALUES(philosophy_statement),
          statistics_json = VALUES(statistics_json),
          marquee_items_json = VALUES(marquee_items_json),
          cta_title = VALUES(cta_title),
          cta_subtitle = VALUES(cta_subtitle),
          cta_button_text = VALUES(cta_button_text),
          cta_button_url = VALUES(cta_button_url),
          updated_at = NOW()
      `;
      await query(sql, [
        data.hero_heading || '',
        data.hero_subtitle || '',
        data.hero_cta_primary_text || '',
        data.hero_cta_primary_url || '',
        data.hero_cta_secondary_text || '',
        data.hero_cta_secondary_url || '',
        data.story_title || '',
        data.story_subtitle || '',
        data.story_content || '',
        data.mission_statement || '',
        data.vision_statement || '',
        data.philosophy_statement || '',
        statsJson,
        marqueeJson,
        data.cta_title || '',
        data.cta_subtitle || '',
        data.cta_button_text || '',
        data.cta_button_url || '',
      ]);
      return this.getHomepageData();
    }

    memoryHomepage = { ...memoryHomepage, ...data };
    return memoryHomepage;
  }
}
