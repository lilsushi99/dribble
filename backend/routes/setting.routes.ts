import { Router } from 'express';
import { SettingController } from '../controllers/setting.controller';
import { authenticateJwt, requireRoles } from '../middleware/auth.middleware';

const router = Router();
const controller = new SettingController();

router.get('/', controller.getSettings);
router.put('/', authenticateJwt, requireRoles('Super Admin', 'Admin'), controller.updateSettings);

router.get('/smtp', controller.getSmtpSettings);
router.put('/smtp', authenticateJwt, requireRoles('Super Admin', 'Admin'), controller.updateSmtpSettings);
router.post('/smtp/test', authenticateJwt, requireRoles('Super Admin', 'Admin'), controller.testSmtp);

export default router;
