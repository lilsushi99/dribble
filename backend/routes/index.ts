import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import projectRoutes from './project.routes';
import blogRoutes from './blog.routes';
import settingRoutes from './setting.routes';
import mediaRoutes from './media.routes';
import formRoutes from './form.routes';
import studioRoutes from './studio.routes';
import analyticsRoutes from './analytics.routes';
import seoRoutes from './seo.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/blog', blogRoutes);
router.use('/settings', settingRoutes);
router.use('/media', mediaRoutes);
router.use('/forms', formRoutes);
router.use('/studio', studioRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/seo', seoRoutes);

export default router;
