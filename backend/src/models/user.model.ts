import { query, queryOne } from '../db/connection';
import { User, UserCreateInput, UserUpdateInput } from '../types/user.types';

export class UserModel {
  // Create a new user
  static async create(userData: UserCreateInput): Promise<User> {
    const { nickname, email, password_hash, avatar_url } = userData;
    
    const result = await queryOne<User>(
      `INSERT INTO users (nickname, email, password_hash, avatar_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nickname, email, password_hash, avatar_url || null]
    );

    if (!result) {
      throw new Error('Failed to create user');
    }

    return result;
  }

  // Find user by ID
  static async findById(id: number): Promise<User | null> {
    return queryOne<User>(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
  }

  // Find user by email
  static async findByEmail(email: string): Promise<User | null> {
    return queryOne<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
  }

  // Find user by nickname
  static async findByNickname(nickname: string): Promise<User | null> {
    return queryOne<User>(
      'SELECT * FROM users WHERE nickname = $1',
      [nickname]
    );
  }

  // Update user
  static async update(id: number, userData: UserUpdateInput): Promise<User | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (userData.nickname !== undefined) {
      updates.push(`nickname = $${paramIndex++}`);
      values.push(userData.nickname);
    }
    if (userData.email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      values.push(userData.email);
    }
    if (userData.avatar_url !== undefined) {
      updates.push(`avatar_url = $${paramIndex++}`);
      values.push(userData.avatar_url);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const updateQuery = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    return queryOne<User>(updateQuery, values);
  }

  // Delete user
  static async delete(id: number): Promise<boolean> {
    const result = await query<{ id: number }>(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );
    return result.length > 0;
  }

  // Get all users (for admin purposes)
  static async findAll(limit: number = 100, offset: number = 0): Promise<User[]> {
    return query<User>(
      'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
  }

  // Check if email exists
  static async emailExists(email: string): Promise<boolean> {
    const result = await queryOne<{ exists: boolean }>(
      'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)',
      [email]
    );
    return result?.exists || false;
  }

  // Check if nickname exists
  static async nicknameExists(nickname: string): Promise<boolean> {
    const result = await queryOne<{ exists: boolean }>(
      'SELECT EXISTS(SELECT 1 FROM users WHERE nickname = $1)',
      [nickname]
    );
    return result?.exists || false;
  }
}
