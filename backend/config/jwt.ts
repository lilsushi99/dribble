import dotenv from 'dotenv';
dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'kinetic_jwt_super_secret_key_2026_prod',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'kinetic_jwt_refresh_secret_key_2026_prod',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};
