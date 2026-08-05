import { Request, Response } from 'express';
import { HomepageService } from '../services/homepage.service';
import { sendSuccess, sendError } from '../utils/response';

export class HomepageController {
  private homepageService = new HomepageService();

  getHomepageData = async (req: Request, res: Response) => {
    try {
      const data = await this.homepageService.getHomepageData();
      return sendSuccess(res, data, 'Homepage content retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  };

  updateHomepageData = async (req: Request, res: Response) => {
    try {
      const updated = await this.homepageService.updateHomepageData(req.body);
      return sendSuccess(res, updated, 'Homepage content updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  };
}
