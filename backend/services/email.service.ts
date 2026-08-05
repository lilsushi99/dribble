import nodemailer from 'nodemailer';
import { SettingRepository } from '../repositories/setting.repository';
import { logger } from '../utils/logger';

export class EmailService {
  private settingRepo = new SettingRepository();

  private async getTransporter() {
    const settings = await this.settingRepo.getAllSettings();

    const host = settings.smtp_host || process.env.SMTP_HOST || 'smtp.hostinger.com';
    const port = parseInt(settings.smtp_port || process.env.SMTP_PORT || '465', 10);
    const user = settings.smtp_username || process.env.SMTP_USER || 'contact@kinetic-studio.com';
    const pass = settings.smtp_password || process.env.SMTP_PASS || 'smtp_secret_pass';
    const encryption = settings.smtp_encryption || 'ssl';

    const isSecure = encryption === 'ssl' || port === 465;

    return nodemailer.createTransport({
      host,
      port,
      secure: isSecure,
      auth: user ? { user, pass } : undefined,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendClientAutoReply(toEmail: string, firstName: string) {
    try {
      const settings = await this.settingRepo.getAllSettings();
      const autoReplyEnabled = settings.smtp_auto_reply_enabled !== 'false';
      if (!autoReplyEnabled) return;

      const fromEmail = settings.smtp_from_email || process.env.SMTP_FROM || 'contact@kinetic-studio.com';
      const fromName = settings.smtp_from_name || 'Comic Art Studio';
      const subject = settings.smtp_auto_reply_subject || 'Thank you for contacting Comic Art Studio';
      
      const bodyTemplate =
        settings.smtp_auto_reply_body ||
        'Hi {first_name},\n\nThank you for contacting Comic Art Studio.\nSomeone from our team will review your inquiry and get back to you shortly.\n\nBest regards,\nComic Art Studio Team';

      const bodyText = bodyTemplate.replace(/\{first_name\}/g, firstName || 'there');

      const transporter = await this.getTransporter();

      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: toEmail,
        subject,
        text: bodyText,
        html: `<div font-family: sans-serif; font-size: 15px; color: #111; line-height: 1.6;">
          ${bodyText.replace(/\n/g, '<br/>')}
        </div>`,
      });

      logger.info(`Auto-reply email sent successfully to ${toEmail}`);
    } catch (err: any) {
      logger.warn(`Failed to send client auto-reply email to ${toEmail}: ${err.message}`);
    }
  }

  async sendBusinessNotification(submissionData: Record<string, any>) {
    try {
      const settings = await this.settingRepo.getAllSettings();
      const notificationEmail = settings.smtp_notification_email || settings.contact_email || process.env.SMTP_EMAIL || 'studio@comicartstudio.com';
      const fromEmail = settings.smtp_from_email || process.env.SMTP_FROM || 'contact@kinetic-studio.com';
      const fromName = settings.smtp_from_name || 'Comic Art Studio System';

      const clientName = `${submissionData.first_name || ''} ${submissionData.last_name || ''}`.trim() || submissionData.name || 'Visitor';
      const clientEmail = submissionData.email || 'N/A';

      const detailsHtml = Object.entries(submissionData)
        .map(([k, v]) => `<tr><td style="padding: 6px; font-weight: bold; border-bottom: 1px solid #eee;">${k}</td><td style="padding: 6px; border-bottom: 1px solid #eee;">${v}</td></tr>`)
        .join('');

      const transporter = await this.getTransporter();

      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: notificationEmail,
        subject: `[New Lead Inquiry] ${clientName} - Comic Art Studio`,
        text: `New Form Submission Received:\n\nClient Name: ${clientName}\nEmail: ${clientEmail}\n\nDetails:\n${JSON.stringify(submissionData, null, 2)}`,
        html: `
          <div style="font-family: sans-serif; font-size: 14px; color: #222;">
            <h2 style="color: #0097FF;">New Contact Form Submission Received</h2>
            <p><strong>Client:</strong> ${clientName} (${clientEmail})</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <thead>
                <tr style="background: #f4f4f5; text-align: left;">
                  <th style="padding: 8px;">Field</th>
                  <th style="padding: 8px;">Submitted Value</th>
                </tr>
              </thead>
              <tbody>
                ${detailsHtml}
              </tbody>
            </table>
          </div>
        `,
      });

      logger.info(`Business notification email sent to ${notificationEmail}`);
    } catch (err: any) {
      logger.warn(`Failed to send business notification email: ${err.message}`);
    }
  }

  async sendTestEmail(toEmail: string) {
    const settings = await this.settingRepo.getAllSettings();
    const fromEmail = settings.smtp_from_email || process.env.SMTP_FROM || 'contact@kinetic-studio.com';
    const fromName = settings.smtp_from_name || 'Comic Art Studio';

    const transporter = await this.getTransporter();

    await transporter.verify();

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,
      subject: 'Test Email - Comic Art Studio SMTP Settings',
      text: 'Congratulations! Your SMTP configuration is working perfectly.',
      html: '<div style="font-family: sans-serif; padding: 20px; background: #f0fdf4; border-radius: 8px;"><h3 style="color: #166534;">SMTP Connection Verified Successfully</h3><p>This is a test email sent from Comic Art Studio Admin Panel.</p></div>',
    });

    return true;
  }
}
