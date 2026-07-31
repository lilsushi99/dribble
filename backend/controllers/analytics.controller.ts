import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types/auth.types';

export class AnalyticsController {
  private analyticsService = new AnalyticsService();

  trackPageView = async (req: Request, res: Response) => {
    try {
      const { pageUrl, referrer } = req.body;
      const ip = req.ip || req.socket.remoteAddress;
      const ua = req.get('user-agent');

      await this.analyticsService.logPageView(pageUrl, referrer, ip, ua);
      return sendSuccess(res, null, 'Pageview tracked successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  };

  getActivityLogs = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const logs = await this.analyticsService.getRecentLogs(30);
      return sendSuccess(res, logs, 'Recent activity logs retrieved');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  };
}
