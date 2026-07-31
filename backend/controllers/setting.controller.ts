import { Request, Response } from 'express';
import { SettingService } from '../services/setting.service';
import { sendSuccess, sendError } from '../utils/response';

export class SettingController {
  private settingService = new SettingService();

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
}
