import { validateBody } from '../middleware/validation.middleware';

export const validateCreateProject = validateBody(['title', 'slug', 'client', 'year']);
