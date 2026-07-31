import { validateBody } from '../middleware/validation.middleware';

export const validateCreateUser = validateBody(['email', 'password', 'first_name', 'last_name', 'role_id']);
