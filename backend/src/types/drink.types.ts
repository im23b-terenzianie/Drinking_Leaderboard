export type DrinkType = 'beer' | 'cocktail' | 'shot';

export const DRINK_POINTS: Record<DrinkType, number> = {
  beer: 1,
  cocktail: 2,
  shot: 3,
};

export interface DrinkEntry {
  id: number;
  userId: number;
  drinkType: DrinkType;
  points: number;
  loggedAt: Date;
}

export interface LeaderboardEntry {
  userId: number;
  nickname: string;
  totalPoints: number;
}
