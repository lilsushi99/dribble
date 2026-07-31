import { Router } from 'express';
import { BlogController } from '../controllers/blog.controller';
import { authenticateJwt, requireRoles } from '../middleware/auth.middleware';

const router = Router();
const controller = new BlogController();

router.get('/', controller.getAllPosts);
router.get('/:slug', controller.getPostBySlug);
router.post('/', authenticateJwt, requireRoles('Super Admin', 'Admin', 'Editor'), controller.createPost);
router.put('/:id', authenticateJwt, requireRoles('Super Admin', 'Admin', 'Editor'), controller.updatePost);
router.delete('/:id', authenticateJwt, requireRoles('Super Admin', 'Admin'), controller.deletePost);

export default router;
