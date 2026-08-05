import { Router } from 'express';
import { HomepageController } from '../controllers/homepage.controller';
import { authenticateJwt, requireRoles } from '../middleware/auth.middleware';

const router = Router();
const controller = new HomepageController();

router.get('/', controller.getHomepageData);
router.put('/', authenticateJwt, requireRoles('Super Admin', 'Admin'), controller.updateHomepageData);

export default router;
