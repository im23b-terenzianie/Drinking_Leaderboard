import { query, queryOne } from '../db/connection';
import { User, UserCreateInput } from '../types/user.types';

export class UserModel {
  static async create(userData: UserCreateInput): Promise<User> {
    const result = await queryOne<User>(
      `INSERT INTO users (nickname) VALUES ($1) RETURNING *`,
      [userData.nickname]
    );
    if (!result) throw new Error('Failed to create user');
    return result;
  }

  static async findById(id: number): Promise<User | null> {
    return queryOne<User>('SELECT * FROM users WHERE id = $1', [id]);
  }

  static async findByNickname(nickname: string): Promise<User | null> {
    return queryOne<User>('SELECT * FROM users WHERE nickname = $1', [nickname]);
  }

  static async nicknameExists(nickname: string): Promise<boolean> {
    const result = await queryOne<{ exists: boolean }>(
      'SELECT EXISTS(SELECT 1 FROM users WHERE nickname = $1)',
      [nickname]
    );
    return result?.exists || false;
  }

  static async addPoints(id: number, points: number): Promise<User | null> {
    return queryOne<User>(
      'UPDATE users SET total_points = total_points + $1 WHERE id = $2 RETURNING *',
      [points, id]
    );
  }

  static async getLeaderboard(limit: number = 100): Promise<User[]> {
    return query<User>(
      'SELECT * FROM users ORDER BY total_points DESC, nickname ASC LIMIT $1',
      [limit]
    );
  }
}
