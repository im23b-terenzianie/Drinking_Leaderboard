import { queryOne } from '../db/connection';
import { DrinkType, DRINK_POINTS, DrinkEntry } from '../types/drink.types';
import { UserModel } from '../models/user.model';

export const drinkService = {
  async logDrink(userId: number, drinkType: DrinkType): Promise<DrinkEntry> {
    const points = DRINK_POINTS[drinkType];

    const row = await queryOne<{ id: number; user_id: number; drink_type: string; points: number; logged_at: Date }>(
      `INSERT INTO drinks (user_id, drink_type, points) VALUES ($1, $2, $3) RETURNING *`,
      [userId, drinkType, points]
    );

    if (!row) throw new Error('Failed to log drink');

    await UserModel.addPoints(userId, points);

    return {
      id: row.id,
      userId: row.user_id,
      drinkType: row.drink_type as DrinkType,
      points: row.points,
      loggedAt: row.logged_at,
    };
  },
};
