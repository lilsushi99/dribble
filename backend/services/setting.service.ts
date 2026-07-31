import { SettingRepository } from '../repositories/setting.repository';

export class SettingService {
  private settingRepo = new SettingRepository();

  async getSettings() {
    return this.settingRepo.getAllSettings();
  }

  async updateSettings(settingsMap: Record<string, string>, category = 'general') {
    for (const [key, value] of Object.entries(settingsMap)) {
      await this.settingRepo.updateSetting(key, String(value), category);
    }
    return this.settingRepo.getAllSettings();
  }
}
