import { Response } from 'express';
import { MediaService } from '../services/media.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types/auth.types';

export class MediaController {
  private mediaService = new MediaService();

  getAllMedia = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const media = await this.mediaService.getAllMedia();
      return sendSuccess(res, media, 'Media library items retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  };

  uploadMedia = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.file) {
        return sendError(res, 'No file was uploaded', 400);
      }

      const category = req.body.category || 'general';
      const resolvedFolder = (req as any).resolvedUploadFolder;
      const userId = req.user?.userId;

      const mediaRecord = await this.mediaService.saveMediaRecord(req.file, category, userId, resolvedFolder);
      return sendSuccess(res, mediaRecord, 'File uploaded and saved successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  };

  deleteMedia = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      await this.mediaService.deleteMedia(id);
      return sendSuccess(res, null, 'Media file deleted successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  };
}
