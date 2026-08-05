import { Request, Response } from 'express';
import { SettingService } from '../services/setting.service';
import { EmailService } from '../services/email.service';
import { sendSuccess, sendError } from '../utils/response';

export class SettingController {
  private settingService = new SettingService();
  private emailService = new EmailService();

  getSettings = async (req: Request, res: Response) => {
    try {
      const settings = await this.settingService.getSettings();
      return sendSuccess(res, settings, 'Settings retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  };

  updateSettings = async (req: Request, res: Response) => {
    try {
      const { settings, category } = req.body;
      const updated = await this.settingService.updateSettings(settings || req.body, category);
      return sendSuccess(res, updated, 'Settings updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  };

  getSmtpSettings = async (req: Request, res: Response) => {
    try {
      const settings = await this.settingService.getSettings();
      const smtp = {
        host: settings.smtp_host || process.env.SMTP_HOST || 'smtp.hostinger.com',
        port: parseInt(settings.smtp_port || process.env.SMTP_PORT || '465', 10),
        username: settings.smtp_username || process.env.SMTP_USER || 'contact@kinetic-studio.com',
        password: settings.smtp_password || process.env.SMTP_PASS || 'smtp_secret_pass',
        from_email: settings.smtp_from_email || process.env.SMTP_FROM || 'contact@kinetic-studio.com',
        from_name: settings.smtp_from_name || 'Comic Art Studio',
        encryption: (settings.smtp_encryption as 'ssl' | 'tls' | 'none') || 'ssl',
        is_active: settings.smtp_auto_reply_enabled !== 'false',
        auto_reply_subject: settings.smtp_auto_reply_subject || 'Thank you for contacting Comic Art Studio',
        auto_reply_body:
          settings.smtp_auto_reply_body ||
          'Hi {first_name},\n\nThank you for contacting Comic Art Studio.\nSomeone from our team will review your inquiry and get back to you shortly.',
        notification_email: settings.smtp_notification_email || settings.contact_email || 'studio@comicartstudio.com',
      };
      return sendSuccess(res, smtp, 'SMTP settings retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  };

  updateSmtpSettings = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const settingsMap: Record<string, string> = {
        smtp_host: String(body.host || ''),
        smtp_port: String(body.port || '465'),
        smtp_username: String(body.username || ''),
        smtp_password: String(body.password || ''),
        smtp_from_email: String(body.from_email || ''),
        smtp_from_name: String(body.from_name || ''),
        smtp_encryption: String(body.encryption || 'ssl'),
        smtp_auto_reply_enabled: body.is_active !== false ? 'true' : 'false',
        smtp_auto_reply_subject: String(body.auto_reply_subject || ''),
        smtp_auto_reply_body: String(body.auto_reply_body || ''),
        smtp_notification_email: String(body.notification_email || ''),
      };
      await this.settingService.updateSettings(settingsMap, 'smtp');
      return sendSuccess(res, body, 'SMTP settings updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  };

  testSmtp = async (req: Request, res: Response) => {
    try {
      const { test_email } = req.body;
      const target = test_email || (req as any).user?.email || 'test@comicartstudio.com';
      await this.emailService.sendTestEmail(target);
      return sendSuccess(res, { recipient: target }, `Test email successfully sent to ${target}`);
    } catch (err: any) {
      return sendError(res, `SMTP Test failed: ${err.message}`, 400);
    }
  };
}
