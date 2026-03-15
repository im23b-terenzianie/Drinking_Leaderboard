export interface DrinkEntry {
  id: number;
  userId: number;
  drinkType: string;
  amount: number;
  consumedAt: Date;
}

export interface UserDrinkStats {
  userId: number;
  totalDrinks: number;
  byType: Record<string, number>;
}

export interface LeaderboardEntry {
  userId: number;
  nickname: string;
  totalDrinks: number;
}
