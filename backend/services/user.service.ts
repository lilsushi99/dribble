import { UserRepository } from '../repositories/user.repository';
import { hashPassword } from '../utils/password';

export class UserService {
  private userRepo = new UserRepository();

  async getAllUsers() {
    const users = await this.userRepo.findAll();
    return users.map(({ password_hash, ...u }) => u);
  }

  async getUserById(id: number) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new Error('User not found');
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async createUser(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role_id: number;
    avatar_url?: string;
  }) {
    const existing = await this.userRepo.findByEmail(userData.email);
    if (existing) {
      throw new Error('A user with this email address already exists');
    }

    const hashedPassword = await hashPassword(userData.password);

    const created = await this.userRepo.create({
      email: userData.email,
      password_hash: hashedPassword,
      first_name: userData.first_name,
      last_name: userData.last_name,
      role_id: Number(userData.role_id),
      avatar_url: userData.avatar_url,
      is_active: true,
    });

    const { password_hash, ...userWithoutPassword } = created;
    return userWithoutPassword;
  }

  async updateUser(id: number, updateData: any) {
    const dataToUpdate: any = { ...updateData };
    if (updateData.password) {
      dataToUpdate.password_hash = await hashPassword(updateData.password);
      delete dataToUpdate.password;
    }
    const updated = await this.userRepo.update(id, dataToUpdate);
    if (!updated) throw new Error('User not found or update failed');
    const { password_hash, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  async deleteUser(id: number) {
    return this.userRepo.delete(id);
  }
}
