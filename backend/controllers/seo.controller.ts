import { Request, Response } from 'express';
import { SeoService } from '../services/seo.service';
import { sendSuccess, sendError } from '../utils/response';

export class SeoController {
  private seoService = new SeoService();

  getAllSeo = async (req: Request, res: Response) => {
    try {
      const data = await this.seoService.getAllSeo();
      return sendSuccess(res, data, 'SEO settings retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  };

  saveSeo = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      let updated;
      if (data.seoMap) {
        updated = await this.seoService.saveAllSeo(data.seoMap);
      } else {
        updated = await this.seoService.saveSeo(data);
      }
      return sendSuccess(res, updated, 'SEO settings saved successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  };

  generateSitemap = async (req: Request, res: Response) => {
    try {
      const result = await this.seoService.generateSitemap();
      return sendSuccess(res, result, 'sitemap.xml generated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  };
}
