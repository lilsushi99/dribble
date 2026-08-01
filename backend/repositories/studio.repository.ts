import { isDbConnected, query } from '../config/database';

let memoryStudioPage = {
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

export class StudioRepository {
  async getStudioPageData(): Promise<any> {
    if (isDbConnected()) {
      const sql = `SELECT * FROM studio_page ORDER BY id ASC LIMIT 1`;
      const rows = await query<any[]>(sql);
      if (rows.length) {
        const r = rows[0];
        return {
          id: r.id || 1,
          intro_heading: r.intro_heading || r.hero_title || memoryStudioPage.intro_heading,
          intro_subtitle: r.intro_subtitle || r.hero_subtitle || memoryStudioPage.intro_subtitle,
          story_heading: r.story_heading || memoryStudioPage.story_heading,
          story_content: r.story_content || r.philosophy_content || memoryStudioPage.story_content,
          stats_cards: typeof r.stats_cards === 'string' ? JSON.parse(r.stats_cards) : (r.stats_cards || memoryStudioPage.stats_cards),
          value_cards: typeof r.value_cards === 'string' ? JSON.parse(r.value_cards) : (r.value_cards || memoryStudioPage.value_cards),
          show_comic_panel: r.show_comic_panel !== undefined ? Boolean(r.show_comic_panel) : true,
          show_counter: r.show_counter !== undefined ? Boolean(r.show_counter) : true,
          cta_heading: r.cta_heading || memoryStudioPage.cta_heading,
          cta_description: r.cta_description || memoryStudioPage.cta_description,
          cta_button_text: r.cta_button_text || memoryStudioPage.cta_button_text,
          cta_button_url: r.cta_button_url || memoryStudioPage.cta_button_url,
          show_cta: r.show_cta !== undefined ? Boolean(r.show_cta) : true,
        };
      }
      return memoryStudioPage;
    }
    return memoryStudioPage;
  }

  async updateStudioPageData(data: any): Promise<any> {
    if (isDbConnected()) {
      const statsJson = JSON.stringify(data.stats_cards || []);
      const valuesJson = JSON.stringify(data.value_cards || []);

      const sql = `
        INSERT INTO studio_page (id, intro_heading, intro_subtitle, story_heading, story_content, stats_cards, value_cards, show_comic_panel, show_counter, cta_heading, cta_description, cta_button_text, cta_button_url, show_cta, updated_at)
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE 
          intro_heading = VALUES(intro_heading),
          intro_subtitle = VALUES(intro_subtitle),
          story_heading = VALUES(story_heading),
          story_content = VALUES(story_content),
          stats_cards = VALUES(stats_cards),
          value_cards = VALUES(value_cards),
          show_comic_panel = VALUES(show_comic_panel),
          show_counter = VALUES(show_counter),
          cta_heading = VALUES(cta_heading),
          cta_description = VALUES(cta_description),
          cta_button_text = VALUES(cta_button_text),
          cta_button_url = VALUES(cta_button_url),
          show_cta = VALUES(show_cta),
          updated_at = NOW()
      `;
      await query(sql, [
        data.intro_heading || '',
        data.intro_subtitle || '',
        data.story_heading || '',
        data.story_content || '',
        statsJson,
        valuesJson,
        data.show_comic_panel ? 1 : 0,
        data.show_counter ? 1 : 0,
        data.cta_heading || '',
        data.cta_description || '',
        data.cta_button_text || '',
        data.cta_button_url || '',
        data.show_cta ? 1 : 0,
      ]);
      return this.getStudioPageData();
    }

    memoryStudioPage = { ...memoryStudioPage, ...data };
    return memoryStudioPage;
  }
}
