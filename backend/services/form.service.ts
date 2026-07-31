import { FormRepository } from '../repositories/form.repository';

export class FormService {
  private formRepo = new FormRepository();

  async submitForm(formId: number, formData: any, ipAddress?: string, userAgent?: string) {
    const dataJson = typeof formData === 'string' ? formData : JSON.stringify(formData);
    return this.formRepo.submitForm(formId, dataJson, ipAddress, userAgent);
  }

  async getSubmissions(formId: number) {
    return this.formRepo.getSubmissionsByForm(formId);
  }
}
