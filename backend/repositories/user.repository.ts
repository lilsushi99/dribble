import { isDbConnected, query } from '../config/database';
import { User } from '../types';

// In-memory fallback database store
let memoryUsers: User[] = [
  {
    id: 1,
    email: 'admin@kinetic.studio',
    password_hash: '$2a$10$wT8B14dYkM0Lg8P./f9r.OqR63R0iS98P.6L5sO2kU1.1e8x5a3yG', // AdminPassword2026!
    first_name: 'Super',
    last_name: 'Admin',
    role_id: 1,
    role_name: 'Super Admin',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let memorySessions: any[] = [];

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    if (isDbConnected()) {
      const sql = `
        SELECT u.*, r.name as role_name 
        FROM users u 
        JOIN roles r ON u.role_id = r.id 
        WHERE u.email = ? AND u.is_active = 1 
        LIMIT 1
      `;
      const rows = await query<any[]>(sql, [email]);
      return rows.length ? rows[0] : null;
    }

    const found = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return found || null;
  }

  async findById(id: number): Promise<User | null> {
    if (isDbConnected()) {
      const sql = `
        SELECT u.*, r.name as role_name 
        FROM users u 
        JOIN roles r ON u.role_id = r.id 
        WHERE u.id = ? AND u.is_active = 1 
        LIMIT 1
      `;
      const rows = await query<any[]>(sql, [id]);
      return rows.length ? rows[0] : null;
    }

    const found = memoryUsers.find((u) => u.id === id);
    return found || null;
  }

  async findAll(): Promise<User[]> {
    if (isDbConnected()) {
      const sql = `
        SELECT u.id, u.email, u.first_name, u.last_name, u.role_id, r.name as role_name, u.avatar_url, u.is_active, u.created_at, u.updated_at 
        FROM users u 
        JOIN roles r ON u.role_id = r.id 
        ORDER BY u.id ASC
      `;
      return query<User[]>(sql);
    }
    return memoryUsers;
  }

  async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const now = new Date().toISOString();

    if (isDbConnected()) {
      const sql = `
        INSERT INTO users (email, password_hash, first_name, last_name, role_id, avatar_url, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      const res: any = await query(sql, [
        user.email,
        user.password_hash,
        user.first_name,
        user.last_name,
        user.role_id,
        user.avatar_url || null,
        user.is_active ? 1 : 0,
      ]);

      const newUser = await this.findById(res.insertId);
      return newUser!;
    }

    const roleMap: Record<number, string> = { 1: 'Super Admin', 2: 'Admin', 3: 'Editor' };
    const newId = memoryUsers.length + 1;
    const createdUser: User = {
      ...user,
      id: newId,
      role_name: roleMap[user.role_id] || 'Editor',
      created_at: now,
      updated_at: now,
    };
    memoryUsers.push(createdUser);
    return createdUser;
  }

  async createSession(userId: number, refreshToken: string, ipAddress?: string, userAgent?: string): Promise<void> {
    if (isDbConnected()) {
      const sql = `
        INSERT INTO sessions (user_id, refresh_token, ip_address, user_agent, expires_at, created_at)
        VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY), NOW())
      `;
      await query(sql, [userId, refreshToken, ipAddress || null, userAgent || null]);
      return;
    }

    memorySessions.push({ userId, refreshToken, ipAddress, userAgent, createdAt: new Date() });
  }

  async removeSession(refreshToken: string): Promise<void> {
    if (isDbConnected()) {
      const sql = `DELETE FROM sessions WHERE refresh_token = ?`;
      await query(sql, [refreshToken]);
      return;
    }

    memorySessions = memorySessions.filter((s) => s.refreshToken !== refreshToken);
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    if (isDbConnected()) {
      const fields: string[] = [];
      const values: any[] = [];

      Object.entries(data).forEach(([k, v]) => {
        if (k !== 'id' && k !== 'role_name') {
          fields.push(`${k} = ?`);
          values.push(v);
        }
      });

      if (fields.length === 0) return this.findById(id);

      values.push(id);
      const sql = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
      await query(sql, values);
      return this.findById(id);
    }

    const index = memoryUsers.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const roleMap: Record<number, string> = { 1: 'Super Admin', 2: 'Admin', 3: 'Editor' };
    memoryUsers[index] = {
      ...memoryUsers[index],
      ...data,
      role_name: data.role_id ? roleMap[data.role_id] : memoryUsers[index].role_name,
      updated_at: new Date().toISOString(),
    };
    return memoryUsers[index];
  }

  async delete(id: number): Promise<boolean> {
    if (isDbConnected()) {
      const sql = `DELETE FROM users WHERE id = ?`;
      await query(sql, [id]);
      return true;
    }

    const len = memoryUsers.length;
    memoryUsers = memoryUsers.filter((u) => u.id !== id);
    return memoryUsers.length < len;
  }
}
