import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service';
import { sendSuccess, sendError } from '../utils/response';

export class ProjectController {
  private projectService = new ProjectService();

  getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await this.projectService.getAllProjects();
      return sendSuccess(res, projects, 'Projects retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  };

  getProjectBySlug = async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const project = await this.projectService.getProjectBySlug(slug);
      return sendSuccess(res, project, 'Project retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message, 404);
    }
  };

  createProject = async (req: Request, res: Response) => {
    try {
      const project = await this.projectService.createProject(req.body);
      return sendSuccess(res, project, 'Project created successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  };

  updateProject = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const updated = await this.projectService.updateProject(id, req.body);
      return sendSuccess(res, updated, 'Project updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  };

  deleteProject = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await this.projectService.deleteProject(id);
      return sendSuccess(res, null, 'Project deleted successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  };
}
