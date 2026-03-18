import { UserModel } from './user.model';
import { query, queryOne } from '../db/connection';

jest.mock('../db/connection', () => ({
  query: jest.fn(),
  queryOne: jest.fn(),
}));

describe('UserModel database tests', () => {
  const mockedQuery = query as jest.MockedFunction<typeof query>;
  const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a user with expected SQL params', async () => {
    mockedQueryOne.mockResolvedValue({
      id: 1,
      nickname: 'db_user',
      email: 'db@test.dev',
      password_hash: 'hashed',
      avatar_url: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const result = await UserModel.create({
      nickname: 'db_user',
      email: 'db@test.dev',
      password_hash: 'hashed',
      avatar_url: undefined,
    });

    expect(result.nickname).toBe('db_user');
    expect(mockedQueryOne).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users'),
      ['db_user', 'db@test.dev', 'hashed', null]
    );
  });

  it('checks email existence', async () => {
    mockedQueryOne.mockResolvedValue({ exists: true });

    const exists = await UserModel.emailExists('db@test.dev');

    expect(exists).toBe(true);
    expect(mockedQueryOne).toHaveBeenCalledWith(
      expect.stringContaining('SELECT EXISTS'),
      ['db@test.dev']
    );
  });

  it('returns user by id and email lookups', async () => {
    const now = new Date();
    mockedQueryOne
      .mockResolvedValueOnce({
        id: 9,
        nickname: 'id_user',
        email: 'id@test.dev',
        password_hash: 'hashed',
        avatar_url: null,
        created_at: now,
        updated_at: now,
      })
      .mockResolvedValueOnce({
        id: 11,
        nickname: 'mail_user',
        email: 'mail@test.dev',
        password_hash: 'hashed',
        avatar_url: null,
        created_at: now,
        updated_at: now,
      })
      .mockResolvedValueOnce({
        id: 15,
        nickname: 'nick_user',
        email: 'nick@test.dev',
        password_hash: 'hashed',
        avatar_url: null,
        created_at: now,
        updated_at: now,
      });

    await expect(UserModel.findById(9)).resolves.toMatchObject({ id: 9 });
    await expect(UserModel.findByEmail('mail@test.dev')).resolves.toMatchObject({ id: 11 });
    await expect(UserModel.findByNickname('nick_user')).resolves.toMatchObject({ id: 15 });
  });

  it('updates user with no payload by falling back to findById', async () => {
    mockedQueryOne.mockResolvedValue({
      id: 12,
      nickname: 'fallback',
      email: 'fallback@test.dev',
      password_hash: 'hashed',
      avatar_url: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const result = await UserModel.update(12, {});

    expect(result?.id).toBe(12);
    expect(mockedQueryOne).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [12]);
  });

  it('updates user with payload values', async () => {
    mockedQueryOne.mockResolvedValue({
      id: 21,
      nickname: 'new_name',
      email: 'new@test.dev',
      password_hash: 'hashed',
      avatar_url: 'avatar',
      created_at: new Date(),
      updated_at: new Date(),
    });

    const result = await UserModel.update(21, {
      nickname: 'new_name',
      email: 'new@test.dev',
      avatar_url: 'avatar',
    });

    expect(result?.nickname).toBe('new_name');
    expect(mockedQueryOne).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE users'),
      ['new_name', 'new@test.dev', 'avatar', 21]
    );
  });

  it('returns all users and checks nickname existence', async () => {
    mockedQuery.mockResolvedValue([
      {
        id: 1,
        nickname: 'all_user',
        email: 'all@test.dev',
        password_hash: 'hashed',
        avatar_url: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ] as never[]);
    mockedQueryOne.mockResolvedValue({ exists: false });

    const users = await UserModel.findAll(10, 5);
    const exists = await UserModel.nicknameExists('missing_user');

    expect(users).toHaveLength(1);
    expect(exists).toBe(false);
    expect(mockedQuery).toHaveBeenCalledWith(
      'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [10, 5]
    );
  });

  it('deletes user and returns true if row exists', async () => {
    mockedQuery.mockResolvedValue([{ id: 55 }] as never[]);

    const deleted = await UserModel.delete(55);

    expect(deleted).toBe(true);
    expect(mockedQuery).toHaveBeenCalledWith('DELETE FROM users WHERE id = $1 RETURNING id', [55]);
  });
});
