import { isDbConnected, query } from '../config/database';

let memoryAnalyticsLogs: any[] = [];
let memoryActivityLogs: any[] = [];

export class AnalyticsRepository {
  async recordPageView(pageUrl: string, referrer?: string, visitorIp?: string, userAgent?: string): Promise<void> {
    if (isDbConnected()) {
      const sql = `
        INSERT INTO analytics (page_url, referrer, visitor_ip, user_agent, created_at)
        VALUES (?, ?, ?, ?, NOW())
      `;
      await query(sql, [pageUrl, referrer || null, visitorIp || null, userAgent || null]);
      return;
    }

    memoryAnalyticsLogs.push({ pageUrl, referrer, visitorIp, userAgent, createdAt: new Date() });
  }

  async recordActivityLog(userId: number | null, action: string, targetTable?: string, targetId?: number, details?: any, ipAddress?: string): Promise<void> {
    const detailsJson = details ? JSON.stringify(details) : null;
    if (isDbConnected()) {
      const sql = `
        INSERT INTO activity_logs (user_id, action, target_table, target_id, details_json, ip_address, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `;
      await query(sql, [userId, action, targetTable || null, targetId || null, detailsJson, ipAddress || null]);
      return;
    }

    memoryActivityLogs.push({ userId, action, targetTable, targetId, details, ipAddress, createdAt: new Date() });
  }

  async getRecentActivityLogs(limit = 20): Promise<any[]> {
    if (isDbConnected()) {
      const sql = `
        SELECT a.*, u.first_name, u.last_name, u.email 
        FROM activity_logs a 
        LEFT JOIN users u ON a.user_id = u.id 
        ORDER BY a.id DESC LIMIT ?
      `;
      return query<any[]>(sql, [limit]);
    }

    return memoryActivityLogs.slice(-limit).reverse();
  }
}
