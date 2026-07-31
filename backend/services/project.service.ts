import { ProjectRepository } from '../repositories/project.repository';
import { Project } from '../types';

export class ProjectService {
  private projectRepo = new ProjectRepository();

  async getAllProjects() {
    return this.projectRepo.findAll();
  }

  async getProjectBySlug(slug: string) {
    const project = await this.projectRepo.findBySlug(slug);
    if (!project) throw new Error('Project not found');
    return project;
  }

  async createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const existing = await this.projectRepo.findBySlug(projectData.slug);
    if (existing) {
      throw new Error('Project slug must be unique');
    }
    return this.projectRepo.create(projectData);
  }

  async updateProject(id: number, updateData: Partial<Project>) {
    const updated = await this.projectRepo.update(id, updateData);
    if (!updated) throw new Error('Project not found or update failed');
    return updated;
  }

  async deleteProject(id: number) {
    return this.projectRepo.delete(id);
  }
}
