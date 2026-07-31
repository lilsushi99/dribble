import { Request, Response } from 'express';
import { BlogService } from '../services/blog.service';
import { sendSuccess, sendError } from '../utils/response';

export class BlogController {
  private blogService = new BlogService();

  getAllPosts = async (req: Request, res: Response) => {
    try {
      const posts = await this.blogService.getAllPosts();
      return sendSuccess(res, posts, 'Blog posts retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  };

  getPostBySlug = async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const post = await this.blogService.getPostBySlug(slug);
      return sendSuccess(res, post, 'Blog post retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message, 404);
    }
  };

  createPost = async (req: Request, res: Response) => {
    try {
      const post = await this.blogService.createPost(req.body);
      return sendSuccess(res, post, 'Blog post created successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  };

  updatePost = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const updated = await this.blogService.updatePost(id, req.body);
      return sendSuccess(res, updated, 'Blog post updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  };

  deletePost = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await this.blogService.deletePost(id);
      return sendSuccess(res, null, 'Blog post deleted successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  };
}
