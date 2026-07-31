import { Request } from 'express';

export interface JwtPayload {
  userId: number;
  email: string;
  roleId: number;
  roleName: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
