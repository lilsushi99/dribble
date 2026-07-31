import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { AuthenticatedRequest, JwtPayload } from '../types/auth.types';
import { sendError } from '../utils/response';

export function authenticateJwt(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication token required', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error: any) {
    return sendError(res, 'Invalid or expired access token', 401);
  }
}

export function requireRoles(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Unauthenticated request', 401);
    }

    if (!allowedRoles.includes(req.user.roleName)) {
      return sendError(
        res,
        `Access denied. Role '${req.user.roleName}' lacks permission for this resource.`,
        403
      );
    }

    next();
  };
}
