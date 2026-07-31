import { Router } from 'express';
import { SeoController } from '../controllers/seo.controller';
import { authenticateJwt, requireRoles } from '../middleware/auth.middleware';

const router = Router();
const controller = new SeoController();

router.get('/', controller.getAllSeo);
router.put('/', authenticateJwt, requireRoles('Super Admin', 'Admin'), controller.saveSeo);
router.post('/sitemap/generate', authenticateJwt, requireRoles('Super Admin', 'Admin'), controller.generateSitemap);

export default router;
