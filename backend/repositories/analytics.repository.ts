import { isDbConnected, query } from '../config/database';

let memoryEvents: any[] = [];
let memoryActivityLogs: any[] = [];

export interface EventInput {
  eventType: string;
  path: string;
  referrer?: string;
  userAgent?: string;
  deviceCategory?: string;
  countryCode?: string;
  ipAddress?: string;
}

export class AnalyticsRepository {
  async recordEvent(input: EventInput): Promise<void> {
    if (isDbConnected()) {
      const sql = `
        INSERT INTO analytics_events
          (event_type, path, referrer, user_agent, device_category, country_code, ip_address, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      await query(sql, [
        input.eventType,
        input.path,
        input.referrer || null,
        input.userAgent || null,
        input.deviceCategory || null,
        input.countryCode || null,
        input.ipAddress || null,
      ]);
      return;
    }

    memoryEvents.push({ ...input, created_at: new Date() });
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

  async getLastAdminLogin(): Promise<string | null> {
    if (isDbConnected()) {
      const sql = `
        SELECT a.created_at, u.first_name, u.last_name
        FROM activity_logs a
        LEFT JOIN users u ON a.user_id = u.id
        WHERE a.action = 'admin_login'
        ORDER BY a.id DESC LIMIT 1
      `;
      const rows = await query<any[]>(sql);
      if (rows.length) {
        const r = rows[0];
        const who = r.first_name ? `${r.first_name} ${r.last_name || ''}`.trim() : 'Admin';
        return `${who} — ${new Date(r.created_at).toLocaleString()}`;
      }
      return null;
    }

    const last = [...memoryActivityLogs].reverse().find((l) => l.action === 'admin_login');
    return last ? new Date(last.createdAt).toLocaleString() : null;
  }

  async getDashboardSummary(): Promise<any> {
    if (!isDbConnected()) {
      return this.getMemoryDashboardSummary();
    }

    const countEvents = async (eventType: string, extraWhere = '', params: any[] = []) => {
      const sql = `SELECT COUNT(*) as c FROM analytics_events WHERE event_type = ? ${extraWhere}`;
      const rows = await query<any[]>(sql, [eventType, ...params]);
      return rows[0]?.c || 0;
    };

    const countDistinctVisitors = async (extraWhere = '', params: any[] = []) => {
      const sql = `SELECT COUNT(DISTINCT ip_address) as c FROM analytics_events WHERE event_type = 'page_view' ${extraWhere}`;
      const rows = await query<any[]>(sql, params);
      return rows[0]?.c || 0;
    };

    const [
      totalVisitors,
      totalPageViews,
      visitorsToday,
      visitorsThisMonth,
      homeViews,
      projectsListViews,
      projectViews,
      studioViews,
      blogViews,
      contactViews,
      ctaClicksTotal,
      bookCallClicks,
      chatClicks,
      portfolioClicks,
      trendsRaw,
      deviceRaw,
      browserRaw,
      countryRaw,
      lastLogin,
    ] = await Promise.all([
      countDistinctVisitors(),
      countEvents('page_view'),
      countDistinctVisitors('AND DATE(created_at) = CURDATE()'),
      countDistinctVisitors('AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'),
      countEvents('page_view', "AND path = 'home'"),
      countEvents('page_view', "AND path = 'projects'"),
      countEvents('project_view'),
      countEvents('page_view', "AND path = 'studio'"),
      countEvents('page_view', "AND path = 'blog'"),
      countEvents('page_view', "AND path = 'contact'"),
      countEvents('cta_click'),
      countEvents('book_call_click'),
      countEvents('chat_click'),
      countEvents('portfolio_click'),
      query<any[]>(
        `SELECT DATE(created_at) as date, COUNT(DISTINCT ip_address) as visitors, COUNT(*) as pageViews
         FROM analytics_events
         WHERE event_type = 'page_view' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
         GROUP BY DATE(created_at)
         ORDER BY date ASC`
      ),
      query<any[]>(
        `SELECT COALESCE(device_category, 'Unknown') as name, COUNT(*) as value
         FROM analytics_events WHERE event_type = 'page_view'
         GROUP BY device_category`
      ),
      query<any[]>(
        `SELECT
           CASE
             WHEN user_agent LIKE '%Edg/%' THEN 'Edge'
             WHEN user_agent LIKE '%Chrome/%' AND user_agent NOT LIKE '%Edg/%' THEN 'Chrome'
             WHEN user_agent LIKE '%Firefox/%' THEN 'Firefox'
             WHEN user_agent LIKE '%Safari/%' AND user_agent NOT LIKE '%Chrome/%' THEN 'Safari'
             WHEN user_agent IS NULL THEN 'Unknown'
             ELSE 'Other'
           END as name,
           COUNT(*) as value
         FROM analytics_events WHERE event_type = 'page_view'
         GROUP BY name`
      ),
      query<any[]>(
        `SELECT COALESCE(country_code, 'Unknown') as code, COUNT(*) as visitors
         FROM analytics_events WHERE event_type = 'page_view'
         GROUP BY country_code
         ORDER BY visitors DESC
         LIMIT 10`
      ),
      this.getLastAdminLogin(),
    ]);

    const deviceColors: Record<string, string> = { desktop: '#3b82f6', mobile: '#22c55e', tablet: '#f59e0b', Unknown: '#94a3b8' };
    const browserColors: Record<string, string> = { Chrome: '#3b82f6', Safari: '#06b6d4', Firefox: '#f97316', Edge: '#22c55e', Other: '#94a3b8', Unknown: '#94a3b8' };

    const totalDeviceCount = deviceRaw.reduce((sum, d) => sum + Number(d.value), 0) || 1;
    const totalBrowserCount = browserRaw.reduce((sum, b) => sum + Number(b.value), 0) || 1;
    const totalCountryVisitors = countryRaw.reduce((sum, c) => sum + Number(c.visitors), 0) || 1;

    return {
      totalVisitors,
      totalPageViews,
      visitorsToday,
      visitorsThisMonth,
      homeViews,
      projectsListViews,
      projectViews,
      studioViews,
      blogViews,
      contactViews,
      ctaClicks: ctaClicksTotal + bookCallClicks + chatClicks + portfolioClicks,
      bookCallClicks,
      chatClicks,
      portfolioClicks,
      storageUsageGb: 0,
      storageMaxGb: 10,
      lastLogin: lastLogin || 'No logins recorded yet',
      visitorTrends: trendsRaw.map((t) => ({
        date: t.date instanceof Date ? t.date.toISOString().slice(0, 10) : String(t.date),
        visitors: Number(t.visitors),
        pageViews: Number(t.pageViews),
      })),
      deviceBreakdown: deviceRaw.map((d) => ({
        name: d.name,
        value: Math.round((Number(d.value) / totalDeviceCount) * 100),
        fill: deviceColors[d.name] || '#94a3b8',
      })),
      browserBreakdown: browserRaw.map((b) => ({
        name: b.name,
        value: Math.round((Number(b.value) / totalBrowserCount) * 100),
        fill: browserColors[b.name] || '#94a3b8',
      })),
      countryBreakdown: countryRaw.map((c) => ({
        country: c.code === 'Unknown' ? 'Unknown' : c.code,
        code: c.code,
        visitors: Number(c.visitors),
        percentage: Math.round((Number(c.visitors) / totalCountryVisitors) * 100),
      })),
    };
  }

  private getMemoryDashboardSummary() {
    const pageViews = memoryEvents.filter((e) => e.eventType === 'page_view');
    const uniqueIps = new Set(pageViews.map((e) => e.ipAddress).filter(Boolean));
    const countBy = (type: string) => memoryEvents.filter((e) => e.eventType === type).length;
    const countByPath = (path: string) =>
      memoryEvents.filter((e) => e.eventType === 'page_view' && e.path === path).length;

    return {
      totalVisitors: uniqueIps.size,
      totalPageViews: pageViews.length,
      visitorsToday: uniqueIps.size,
      visitorsThisMonth: uniqueIps.size,
      homeViews: countByPath('home'),
      projectsListViews: countByPath('projects'),
      projectViews: countBy('project_view'),
      studioViews: countByPath('studio'),
      blogViews: countByPath('blog'),
      contactViews: countByPath('contact'),
      ctaClicks: countBy('cta_click') + countBy('book_call_click') + countBy('chat_click') + countBy('portfolio_click'),
      bookCallClicks: countBy('book_call_click'),
      chatClicks: countBy('chat_click'),
      portfolioClicks: countBy('portfolio_click'),
      storageUsageGb: 0,
      storageMaxGb: 10,
      lastLogin: (() => {
        const last = [...memoryActivityLogs].reverse().find((l) => l.action === 'admin_login');
        return last ? new Date(last.createdAt).toLocaleString() : 'No logins recorded yet';
      })(),
      visitorTrends: [],
      deviceBreakdown: [],
      browserBreakdown: [],
      countryBreakdown: [],
    };
  }
}
