import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { authenticateJwt, requireRoles } from '../middleware/auth.middleware';
import { validateCreateProject } from '../validators/project.validator';

const router = Router();
const controller = new ProjectController();

// Public routes
router.get('/', controller.getAllProjects);
router.get('/:slug', controller.getProjectBySlug);

// Protected routes
router.post('/', authenticateJwt, requireRoles('Super Admin', 'Admin', 'Editor'), validateCreateProject, controller.createProject);
router.put('/:id', authenticateJwt, requireRoles('Super Admin', 'Admin'), controller.updateProject);
router.delete('/:id', authenticateJwt, requireRoles('Super Admin', 'Admin'), controller.deleteProject);

export default router;
