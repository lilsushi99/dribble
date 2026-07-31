import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types/auth.types';

export class AuthController {
  private authService = new AuthService();

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.get('user-agent');

      const result = await this.authService.login(email, password, ipAddress, userAgent);
      return sendSuccess(res, result, 'Login successful');
    } catch (err: any) {
      return sendError(res, err.message, 401);
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshToken(refreshToken);
      return sendSuccess(res, result, 'Token refreshed successfully');
    } catch (err: any) {
      return sendError(res, err.message, 401);
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await this.authService.logout(refreshToken);
      }
      return sendSuccess(res, null, 'Logged out successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  };

  me = async (req: AuthenticatedRequest, res: Response) => {
    return sendSuccess(res, { user: req.user }, 'Current session user');
  };
}
