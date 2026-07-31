import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { UserRepository } from '../repositories/user.repository';
import { comparePassword, hashPassword } from '../utils/password';

export class AuthService {
  private userRepo = new UserRepository();

  async login(email: string, password: string, ipAddress?: string, userAgent?: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      roleId: user.role_id,
      roleName: user.role_name || 'Super Admin',
    };

    const accessToken = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn as any });
    const refreshToken = jwt.sign(payload, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpiresIn as any });

    await this.userRepo.createSession(user.id, refreshToken, ipAddress, userAgent);

    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, jwtConfig.refreshSecret) as any;
      const user = await this.userRepo.findById(decoded.userId);
      if (!user) {
        throw new Error('User no longer exists');
      }

      const payload = {
        userId: user.id,
        email: user.email,
        roleId: user.role_id,
        roleName: user.role_name || 'Editor',
      };

      const accessToken = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn as any });
      return { accessToken };
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    await this.userRepo.removeSession(refreshToken);
    return true;
  }
}
