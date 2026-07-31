import { validateBody } from '../middleware/validation.middleware';

export const validateLogin = validateBody(['email', 'password']);
export const validateRegister = validateBody(['email', 'password', 'first_name', 'last_name']);
export const validateRefreshToken = validateBody(['refreshToken']);
