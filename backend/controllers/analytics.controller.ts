import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types/auth.types';

// Lightweight, dependency-free device-category detection from the User-Agent string.
// No external library needed for this level of granularity.
function detectDeviceCategory(userAgent: string | undefined): string {
  if (!userAgent) return 'Unknown';
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/.test(ua)) return 'tablet';
  if (/mobi|iphone|android/.test(ua)) return 'mobile';
  return 'desktop';
}

// Country detection without a paid/external GeoIP service: only trusts headers a CDN/proxy
// (e.g. Cloudflare) would set. If the site isn't behind one of these, this returns undefined
// rather than guessing — honest "Unknown" beats fabricated country data.
function detectCountryCode(req: Request): string | undefined {
  const headerCandidates = ['cf-ipcountry', 'x-country-code', 'x-vercel-ip-country'];
  for (const header of headerCandidates) {
    const val = req.get(header);
    if (val && val !== 'XX') return val.toUpperCase();
  }
  return undefined;
}

export class AnalyticsController {
  private analyticsService = new AnalyticsService();

  trackEvent = async (req: Request, res: Response) => {
    try {
      const { eventType, path, referrer } = req.body;
      if (!eventType || !path) {
        return sendError(res, 'eventType and path are required', 400);
      }

      const ip = req.ip || req.socket.remoteAddress || undefined;
      const userAgent = req.get('user-agent') || undefined;

      await this.analyticsService.logEvent({
        eventType,
        path,
        referrer,
        userAgent,
        deviceCategory: detectDeviceCategory(userAgent),
        countryCode: detectCountryCode(req),
        ipAddress: ip,
      });

      return sendSuccess(res, null, 'Event tracked successfully');
    } catch (err: any) {
      // Analytics must never break the site for the visitor — log and return success-shaped
      // response either way rather than surfacing an error for a non-critical background call.
      console.error('Failed to track analytics event:', err.message);
      return sendSuccess(res, null, 'Event tracking skipped');
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

  getDashboardSummary = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const summary = await this.analyticsService.getDashboardSummary();
      return sendSuccess(res, summary, 'Dashboard analytics retrieved');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  };
}
