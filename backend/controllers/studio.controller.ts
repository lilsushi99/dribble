import { Request, Response } from 'express';
import { StudioService } from '../services/studio.service';
import { sendSuccess, sendError } from '../utils/response';

export class StudioController {
  private studioService = new StudioService();

  getStudioData = async (req: Request, res: Response) => {
    try {
      const data = await this.studioService.getStudioData();
      return sendSuccess(res, data, 'Studio page content retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  };

  updateStudioData = async (req: Request, res: Response) => {
    try {
      const updated = await this.studioService.updateStudioData(req.body);
      return sendSuccess(res, updated, 'Studio page content updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  };
}
