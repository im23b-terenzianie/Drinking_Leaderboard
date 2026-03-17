import request from 'supertest';
import app from '../app';
import { UserModel } from '../models/user.model';

jest.mock('../models/user.model', () => ({
  UserModel: {
    emailExists: jest.fn(),
    nicknameExists: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('User endpoints', () => {
  const mockedUserModel = UserModel as jest.Mocked<typeof UserModel>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a user', async () => {
    mockedUserModel.emailExists.mockResolvedValue(false);
    mockedUserModel.nicknameExists.mockResolvedValue(false);
    mockedUserModel.create.mockResolvedValue({
      id: 1,
      nickname: 'enzo',
      email: 'enzo@test.dev',
      password_hash: 'hashed',
      avatar_url: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const response = await request(app)
      .post('/api/users/register')
      .send({ nickname: 'enzo', email: 'enzo@test.dev', password: 'secret123' });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe('enzo@test.dev');
    expect(response.body.user.password_hash).toBeUndefined();
  });

  it('validates invalid email on register', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({ nickname: 'enzo', email: 'invalid', password: 'secret123' });

    expect(response.status).toBe(400);
  });

  it('rejects register when required fields are missing', async () => {
    const response = await request(app).post('/api/users/register').send({ nickname: 'enzo' });

    expect(response.status).toBe(400);
  });

  it('returns 409 on duplicate email', async () => {
    mockedUserModel.emailExists.mockResolvedValue(true);
    mockedUserModel.nicknameExists.mockResolvedValue(false);

    const response = await request(app)
      .post('/api/users/register')
      .send({ nickname: 'enzo', email: 'enzo@test.dev', password: 'secret123' });

    expect(response.status).toBe(409);
  });

  it('gets one user', async () => {
    mockedUserModel.findById.mockResolvedValue({
      id: 5,
      nickname: 'mona',
      email: 'mona@test.dev',
      password_hash: 'hashed',
      avatar_url: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const response = await request(app).get('/api/users/5');

    expect(response.status).toBe(200);
    expect(response.body.user.nickname).toBe('mona');
  });

  it('returns 400 for invalid user id on get', async () => {
    const response = await request(app).get('/api/users/invalid');
    expect(response.status).toBe(400);
  });

  it('returns 404 when get user is missing', async () => {
    mockedUserModel.findById.mockResolvedValue(null);

    const response = await request(app).get('/api/users/99');

    expect(response.status).toBe(404);
  });

  it('updates one user', async () => {
    mockedUserModel.update.mockResolvedValue({
      id: 7,
      nickname: 'neo',
      email: 'neo@test.dev',
      password_hash: 'hashed',
      avatar_url: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const response = await request(app).put('/api/users/7').send({ nickname: 'neo' });

    expect(response.status).toBe(200);
    expect(response.body.user.id).toBe(7);
  });

  it('returns 400 on invalid email when updating user', async () => {
    const response = await request(app).put('/api/users/7').send({ email: 'bad' });
    expect(response.status).toBe(400);
  });

  it('deletes one user', async () => {
    mockedUserModel.delete.mockResolvedValue(true);

    const response = await request(app).delete('/api/users/7');

    expect(response.status).toBe(204);
  });

  it('returns 400 for invalid id on delete', async () => {
    const response = await request(app).delete('/api/users/0');
    expect(response.status).toBe(400);
  });
});
