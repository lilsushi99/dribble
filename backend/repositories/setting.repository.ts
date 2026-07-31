import { isDbConnected, query } from '../config/database';
import { SiteSetting } from '../types';

let memorySettings: Record<string, string> = {
  site_title: 'KINETIC — Architectural Design Laboratory',
  site_tagline: 'Engineering digital monuments with architectural discipline',
  contact_email: 'contact@kinetic-studio.com',
  primary_accent_color: '#E6A800',
};

export class SettingRepository {
  async getAllSettings(): Promise<Record<string, string>> {
    if (isDbConnected()) {
      const sql = `SELECT setting_key, setting_value FROM site_settings`;
      const rows = await query<SiteSetting[]>(sql);
      const settingsMap: Record<string, string> = {};
      rows.forEach((r) => {
        settingsMap[r.setting_key] = r.setting_value;
      });
      return settingsMap;
    }
    return memorySettings;
  }

  async updateSetting(key: string, value: string, category = 'general'): Promise<void> {
    if (isDbConnected()) {
      const sql = `
        INSERT INTO site_settings (setting_key, setting_value, category, updated_at)
        VALUES (?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()
      `;
      await query(sql, [key, value, category]);
      return;
    }
    memorySettings[key] = value;
  }
}
