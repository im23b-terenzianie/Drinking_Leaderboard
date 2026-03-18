import { DrinkService } from './drink.service';

describe('DrinkService leaderboard logic', () => {
  it('aggregates drinks and sorts leaderboard', () => {
    const service = new DrinkService();
    service.addDrink(1, 'beer', 2);
    service.addDrink(1, 'water', 1);
    service.addDrink(2, 'wine', 5);

    const stats = service.getUserStats(1);
    expect(stats.totalDrinks).toBe(3);
    expect(stats.byType.beer).toBe(2);
    expect(stats.byType.water).toBe(1);

    const leaderboard = service.getLeaderboard([
      { id: 1, nickname: 'alpha' },
      { id: 2, nickname: 'beta' },
    ]);

    expect(leaderboard[0]).toEqual({ userId: 2, nickname: 'beta', totalDrinks: 5 });
    expect(leaderboard[1]).toEqual({ userId: 1, nickname: 'alpha', totalDrinks: 3 });
  });

  it('throws for invalid drink payload', () => {
    const service = new DrinkService();
    expect(() => service.addDrink(1, '', 1)).toThrow('Drink type is required');
    expect(() => service.addDrink(1, 'beer', 0)).toThrow('Amount must be greater than 0');
  });
});
