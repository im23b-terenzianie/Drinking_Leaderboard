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

describe('Drink endpoints', () => {
  const mockedUserModel = UserModel as jest.Mocked<typeof UserModel>;

  beforeEach(() => {
    jest.clearAllMocks();
    drinkService.reset();
  });

  it('creates a drink entry and returns user stats', async () => {
    mockedUserModel.findById.mockResolvedValue({
      id: 2,
      nickname: 'ana',
      email: 'ana@test.dev',
      password_hash: 'hashed',
      avatar_url: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const createResponse = await request(app)
      .post('/api/drinks')
      .send({ userId: 2, drinkType: 'beer', amount: 3 });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.entry.amount).toBe(3);

    const statsResponse = await request(app).get('/api/drinks/2');

    expect(statsResponse.status).toBe(200);
    expect(statsResponse.body.stats.totalDrinks).toBe(3);
    expect(statsResponse.body.stats.byType.beer).toBe(3);
  });

  it('rejects unknown users', async () => {
    mockedUserModel.findById.mockResolvedValue(null);

    const response = await request(app)
      .post('/api/drinks')
      .send({ userId: 99, drinkType: 'water', amount: 1 });

    expect(response.status).toBe(404);
  });

  it('rejects invalid user id on create', async () => {
    const response = await request(app)
      .post('/api/drinks')
      .send({ userId: -1, drinkType: 'water', amount: 1 });

    expect(response.status).toBe(400);
  });

  it('rejects invalid amount', async () => {
    mockedUserModel.findById.mockResolvedValue({
      id: 1,
      nickname: 'user',
      email: 'u@test.dev',
      password_hash: 'hashed',
      avatar_url: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const response = await request(app)
      .post('/api/drinks')
      .send({ userId: 1, drinkType: 'soda', amount: 0 });

    expect(response.status).toBe(400);
  });

  it('rejects invalid user id on stats lookup', async () => {
    const response = await request(app).get('/api/drinks/abc');
    expect(response.status).toBe(400);
  });

  it('returns 404 on stats lookup for unknown user', async () => {
    mockedUserModel.findById.mockResolvedValue(null);

    const response = await request(app).get('/api/drinks/77');

    expect(response.status).toBe(404);
  });
});
