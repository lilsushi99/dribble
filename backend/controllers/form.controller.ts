import { Request, Response } from 'express';
import { FormService } from '../services/form.service';
import { sendSuccess, sendError } from '../utils/response';

export class FormController {
  private formService = new FormService();

  submitForm = async (req: Request, res: Response) => {
    try {
      const formId = Number(req.params.formId || 1);
      const ip = req.ip || req.socket.remoteAddress;
      const ua = req.get('user-agent');

      const submission = await this.formService.submitForm(formId, req.body, ip, ua);
      return sendSuccess(res, submission, 'Form submitted successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  };

  getSubmissions = async (req: Request, res: Response) => {
    try {
      const formId = Number(req.params.formId || 1);
      const submissions = await this.formService.getSubmissions(formId);
      return sendSuccess(res, submissions, 'Form submissions retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  };
}
