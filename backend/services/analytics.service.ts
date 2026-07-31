import { AnalyticsRepository } from '../repositories/analytics.repository';

export class AnalyticsService {
  private analyticsRepo = new AnalyticsRepository();

  async logPageView(pageUrl: string, referrer?: string, ip?: string, ua?: string) {
    return this.analyticsRepo.recordPageView(pageUrl, referrer, ip, ua);
  }

  async logActivity(userId: number | null, action: string, targetTable?: string, targetId?: number, details?: any, ip?: string) {
    return this.analyticsRepo.recordActivityLog(userId, action, targetTable, targetId, details, ip);
  }

  async getRecentLogs(limit = 20) {
    return this.analyticsRepo.getRecentActivityLogs(limit);
  }
}
