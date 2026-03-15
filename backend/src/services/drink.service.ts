import type { DrinkEntry, LeaderboardEntry, UserDrinkStats } from '../types/drink.types';

type UserLookup = { id: number; nickname: string };

export class DrinkService {
  private entries: DrinkEntry[] = [];
  private nextId = 1;

  addDrink(userId: number, drinkType: string, amount: number = 1): DrinkEntry {
    const sanitizedType = drinkType.trim().toLowerCase();
    if (!sanitizedType) {
      throw new Error('Drink type is required');
    }
    if (amount <= 0 || !Number.isFinite(amount)) {
      throw new Error('Amount must be greater than 0');
    }

    const entry: DrinkEntry = {
      id: this.nextId++,
      userId,
      drinkType: sanitizedType,
      amount,
      consumedAt: new Date(),
    };

    this.entries.push(entry);
    return entry;
  }

  getUserStats(userId: number): UserDrinkStats {
    const userEntries = this.entries.filter((entry) => entry.userId === userId);

    const byType = userEntries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.drinkType] = (acc[entry.drinkType] || 0) + entry.amount;
      return acc;
    }, {});

    return {
      userId,
      totalDrinks: userEntries.reduce((sum, entry) => sum + entry.amount, 0),
      byType,
    };
  }

  getLeaderboard(users: UserLookup[]): LeaderboardEntry[] {
    return users
      .map((user) => ({
        userId: user.id,
        nickname: user.nickname,
        totalDrinks: this.getUserStats(user.id).totalDrinks,
      }))
      .sort((a, b) => b.totalDrinks - a.totalDrinks || a.nickname.localeCompare(b.nickname));
  }

  reset(): void {
    this.entries = [];
    this.nextId = 1;
  }
}

export const drinkService = new DrinkService();
