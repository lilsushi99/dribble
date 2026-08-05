import { FormRepository } from '../repositories/form.repository';
import { EmailService } from './email.service';

export class FormService {
  private formRepo = new FormRepository();
  private emailService = new EmailService();

  async submitForm(formId: number, formData: any, ipAddress?: string, userAgent?: string) {
    const dataJson = typeof formData === 'string' ? formData : JSON.stringify(formData);
    const submission = await this.formRepo.submitForm(formId, dataJson, ipAddress, userAgent);

    let parsed: any = {};
    if (typeof formData === 'object' && formData !== null) {
      parsed = formData;
    } else {
      try {
        parsed = JSON.parse(dataJson);
      } catch (e) {
        parsed = {};
      }
    }

    const email = parsed.email || parsed.Email;
    const firstName = parsed.first_name || parsed.firstName || (parsed.name ? parsed.name.split(' ')[0] : 'there');

    if (email) {
      this.emailService.sendClientAutoReply(email, firstName).catch(() => {});
    }
    this.emailService.sendBusinessNotification(parsed).catch(() => {});

    return submission;
  }

  async getSubmissions(formId: number) {
    return this.formRepo.getSubmissionsByForm(formId);
  }
}
