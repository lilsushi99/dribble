import { BlogRepository } from '../repositories/blog.repository';
import { BlogPost } from '../types';

export class BlogService {
  private blogRepo = new BlogRepository();

  async getAllPosts() {
    return this.blogRepo.findAll();
  }

  async getPostBySlug(slug: string) {
    const post = await this.blogRepo.findBySlug(slug);
    if (!post) throw new Error('Blog post not found');
    return post;
  }

  async createPost(postData: Omit<BlogPost, 'id' | 'view_count' | 'created_at' | 'updated_at'>) {
    const existing = await this.blogRepo.findBySlug(postData.slug);
    if (existing) {
      throw new Error('A blog post with this slug already exists');
    }
    return this.blogRepo.create(postData);
  }

  async updatePost(id: number, updateData: Partial<BlogPost>) {
    const updated = await this.blogRepo.update(id, updateData);
    if (!updated) throw new Error('Blog post not found or update failed');
    return updated;
  }

  async deletePost(id: number) {
    return this.blogRepo.delete(id);
  }
}
