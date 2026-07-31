import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateLogin, validateRefreshToken } from '../validators/auth.validator';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();
const controller = new AuthController();

router.post('/login', validateLogin, controller.login);
router.post('/refresh-token', validateRefreshToken, controller.refreshToken);
router.post('/logout', controller.logout);
router.get('/me', authenticateJwt, controller.me);

export default router;
