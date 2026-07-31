import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { sendSuccess, sendError } from '../utils/response';

export class UserController {
  private userService = new UserService();

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.getAllUsers();
      return sendSuccess(res, users, 'Users retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const user = await this.userService.getUserById(id);
      return sendSuccess(res, user, 'User retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message, 404);
    }
  };

  createUser = async (req: Request, res: Response) => {
    try {
      const created = await this.userService.createUser(req.body);
      return sendSuccess(res, created, 'User created successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const updated = await this.userService.updateUser(id, req.body);
      return sendSuccess(res, updated, 'User updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await this.userService.deleteUser(id);
      return sendSuccess(res, null, 'User deleted successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  };
}
