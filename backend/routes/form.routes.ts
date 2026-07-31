import { Router } from 'express';
import { FormController } from '../controllers/form.controller';
import { authenticateJwt, requireRoles } from '../middleware/auth.middleware';

const router = Router();
const controller = new FormController();

router.post('/:formId/submit', controller.submitForm);
router.get('/:formId/submissions', authenticateJwt, requireRoles('Super Admin', 'Admin'), controller.getSubmissions);

export default router;
