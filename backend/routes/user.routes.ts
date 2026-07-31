import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateJwt, requireRoles } from '../middleware/auth.middleware';
import { validateCreateUser } from '../validators/user.validator';

const router = Router();
const controller = new UserController();

router.use(authenticateJwt);

router.get('/', requireRoles('Super Admin', 'Admin'), controller.getAllUsers);
router.get('/:id', requireRoles('Super Admin', 'Admin'), controller.getUserById);
router.post('/', requireRoles('Super Admin'), validateCreateUser, controller.createUser);
router.put('/:id', requireRoles('Super Admin'), controller.updateUser);
router.delete('/:id', requireRoles('Super Admin'), controller.deleteUser);

export default router;
