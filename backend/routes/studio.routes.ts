import { Router } from 'express';
import { StudioController } from '../controllers/studio.controller';
import { authenticateJwt, requireRoles } from '../middleware/auth.middleware';

const router = Router();
const controller = new StudioController();

router.get('/', controller.getStudioData);
router.put('/', authenticateJwt, requireRoles('Super Admin', 'Admin'), controller.updateStudioData);

export default router;
