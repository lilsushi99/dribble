import { Router } from 'express';
import { MediaController } from '../controllers/media.controller';
import { upload } from '../config/upload';
import { authenticateJwt, requireRoles } from '../middleware/auth.middleware';

const router = Router();
const controller = new MediaController();

router.use(authenticateJwt);

router.get('/', controller.getAllMedia);
router.post('/upload', upload.single('file'), controller.uploadMedia);
router.delete('/:id', requireRoles('Super Admin', 'Admin'), controller.deleteMedia);

export default router;
