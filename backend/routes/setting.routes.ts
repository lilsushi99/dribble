import { Router } from 'express';
import { SettingController } from '../controllers/setting.controller';
import { authenticateJwt, requireRoles } from '../middleware/auth.middleware';

const router = Router();
const controller = new SettingController();

router.get('/', controller.getSettings);
router.put('/', authenticateJwt, requireRoles('Super Admin', 'Admin'), controller.updateSettings);

export default router;
