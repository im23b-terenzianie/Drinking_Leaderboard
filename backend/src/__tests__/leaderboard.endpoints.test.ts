import request from 'supertest';
import app from '../app';
import { UserModel } from '../models/user.model';
import { drinkService } from '../services/drink.service';

jest.mock('../models/user.model', () => ({
  UserModel: {
    findById: jest.fn(),
    findAll: jest.fn(),
  },
}));

describe('Leaderboard endpoints', () => {
  const mockedUserModel = UserModel as jest.Mocked<typeof UserModel>;

  beforeEach(() => {
    jest.clearAllMocks();
    drinkService.reset();

    mockedUserModel.findById.mockImplementation(async (id: number) => {
      if (id === 1) {
        return {
          id: 1,
          nickname: 'alex',
          email: 'alex@test.dev',
          password_hash: 'hashed',
          avatar_url: null,
          created_at: new Date(),
          updated_at: new Date(),
        };
      }
      if (id === 2) {
        return {
          id: 2,
          nickname: 'bella',
          email: 'bella@test.dev',
          password_hash: 'hashed',
          avatar_url: null,
          created_at: new Date(),
          updated_at: new Date(),
        };
      }
      return null;
    });

    mockedUserModel.findAll.mockResolvedValue([
      {
        id: 1,
        nickname: 'alex',
        email: 'alex@test.dev',
        password_hash: 'hashed',
        avatar_url: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        nickname: 'bella',
        email: 'bella@test.dev',
        password_hash: 'hashed',
        avatar_url: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  });

  it('returns users sorted by total drinks', async () => {
    await request(app).post('/api/drinks').send({ userId: 2, drinkType: 'wine', amount: 1 });
    await request(app).post('/api/drinks').send({ userId: 1, drinkType: 'beer', amount: 4 });

    const response = await request(app).get('/api/leaderboard');

    expect(response.status).toBe(200);
    expect(response.body.leaderboard).toHaveLength(2);
    expect(response.body.leaderboard[0].userId).toBe(1);
    expect(response.body.leaderboard[0].totalDrinks).toBe(4);
  });
});
