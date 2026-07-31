import { isDbConnected, query } from '../config/database';

let memoryStudioPage = {
  hero_title: 'Engineering digital monuments with architectural discipline',
  hero_subtitle: 'KINETIC operates as an independent design laboratory bridging physical motion architecture, editorial visual identity, and high-performance digital systems.',
  philosophy_content: 'We view digital spaces not as disposable interfaces, but as enduring architectural structures.',
  metrics_json: JSON.stringify([
    { label: 'Projects Completed', value: '148+' },
    { label: 'Clients Served', value: '62' },
    { label: 'Design Awards', value: '24' },
    { label: 'Client Capital Raised', value: '$450M+' },
  ]),
};

export class StudioRepository {
  async getStudioPageData(): Promise<any> {
    if (isDbConnected()) {
      const sql = `SELECT * FROM studio_page ORDER BY id ASC LIMIT 1`;
      const rows = await query<any[]>(sql);
      return rows.length ? rows[0] : memoryStudioPage;
    }
    return memoryStudioPage;
  }

  async updateStudioPageData(data: any): Promise<any> {
    if (isDbConnected()) {
      const sql = `
        INSERT INTO studio_page (id, hero_title, hero_subtitle, philosophy_content, metrics_json, updated_at)
        VALUES (1, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE 
          hero_title = VALUES(hero_title),
          hero_subtitle = VALUES(hero_subtitle),
          philosophy_content = VALUES(philosophy_content),
          metrics_json = VALUES(metrics_json),
          updated_at = NOW()
      `;
      await query(sql, [
        data.hero_title,
        data.hero_subtitle,
        data.philosophy_content,
        typeof data.metrics_json === 'string' ? data.metrics_json : JSON.stringify(data.metrics_json),
      ]);
      return this.getStudioPageData();
    }

    memoryStudioPage = { ...memoryStudioPage, ...data };
    return memoryStudioPage;
  }
}
