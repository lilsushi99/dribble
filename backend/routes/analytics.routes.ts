import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticateJwt, requireRoles } from '../middleware/auth.middleware';

const router = Router();
const controller = new AnalyticsController();

router.post('/track', controller.trackEvent);
router.get('/logs', authenticateJwt, requireRoles('Super Admin'), controller.getActivityLogs);
router.get('/dashboard', authenticateJwt, controller.getDashboardSummary);

export default router;
