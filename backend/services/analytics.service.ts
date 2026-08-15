import { AnalyticsRepository, EventInput } from '../repositories/analytics.repository';

export class AnalyticsService {
  private analyticsRepo = new AnalyticsRepository();

  async logEvent(input: EventInput) {
    return this.analyticsRepo.recordEvent(input);
  }

  async logActivity(userId: number | null, action: string, targetTable?: string, targetId?: number, details?: any, ip?: string) {
    return this.analyticsRepo.recordActivityLog(userId, action, targetTable, targetId, details, ip);
  }

  async getRecentLogs(limit = 20) {
    return this.analyticsRepo.getRecentActivityLogs(limit);
  }

  async getDashboardSummary() {
    return this.analyticsRepo.getDashboardSummary();
  }
}
