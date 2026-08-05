import { HomepageRepository } from '../repositories/homepage.repository';

export class HomepageService {
  private homepageRepo = new HomepageRepository();

  async getHomepageData() {
    return this.homepageRepo.getHomepageData();
  }

  async updateHomepageData(data: any) {
    return this.homepageRepo.updateHomepageData(data);
  }
}
