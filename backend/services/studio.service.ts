import { StudioRepository } from '../repositories/studio.repository';

export class StudioService {
  private studioRepo = new StudioRepository();

  async getStudioData() {
    return this.studioRepo.getStudioPageData();
  }

  async updateStudioData(data: any) {
    return this.studioRepo.updateStudioPageData(data);
  }
}
