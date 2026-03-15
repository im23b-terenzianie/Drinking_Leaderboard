import express, { Request, Response } from 'express';
import { UserModel } from './models/user.model';
import { drinkService } from './services/drink.service';
import { hashPassword, validatePasswordStrength } from './utils/password.utils';
import { validateEmail, validateNickname } from './utils/validation.utils';
import { toPublicUser } from './types/user.types';

const app = express();

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

app.post('/api/users/register', async (req: Request, res: Response) => {
  const { nickname, email, password, avatarUrl } = req.body ?? {};

  if (!nickname || !email || !password) {
    return res.status(400).json({ error: 'nickname, email and password are required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const nicknameValidation = validateNickname(nickname);
  if (!nicknameValidation.valid) {
    return res.status(400).json({ error: nicknameValidation.message });
  }

  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({ error: passwordValidation.message });
  }

  const [emailTaken, nicknameTaken] = await Promise.all([
    UserModel.emailExists(email),
    UserModel.nicknameExists(nickname),
  ]);

  if (emailTaken) {
    return res.status(409).json({ error: 'Email is already used' });
  }

  if (nicknameTaken) {
    return res.status(409).json({ error: 'Nickname is already used' });
  }

  const passwordHash = await hashPassword(password);
  const createdUser = await UserModel.create({
    nickname,
    email,
    password_hash: passwordHash,
    avatar_url: avatarUrl,
  });

  return res.status(201).json({ user: toPublicUser(createdUser) });
});

app.get('/api/users/:id', async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: 'Invalid user id' });
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(200).json({ user: toPublicUser(user) });
});

app.put('/api/users/:id', async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: 'Invalid user id' });
  }

  const updatePayload: { nickname?: string; email?: string; avatar_url?: string } = {};

  if (req.body?.nickname !== undefined) {
    const nicknameValidation = validateNickname(req.body.nickname);
    if (!nicknameValidation.valid) {
      return res.status(400).json({ error: nicknameValidation.message });
    }
    updatePayload.nickname = req.body.nickname;
  }

  if (req.body?.email !== undefined) {
    if (!validateEmail(req.body.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    updatePayload.email = req.body.email;
  }

  if (req.body?.avatarUrl !== undefined) {
    updatePayload.avatar_url = req.body.avatarUrl;
  }

  const updatedUser = await UserModel.update(userId, updatePayload);
  if (!updatedUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(200).json({ user: toPublicUser(updatedUser) });
});

app.delete('/api/users/:id', async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: 'Invalid user id' });
  }

  const deleted = await UserModel.delete(userId);
  if (!deleted) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(204).send();
});

app.post('/api/drinks', async (req: Request, res: Response) => {
  const userId = Number(req.body?.userId);
  const drinkType = String(req.body?.drinkType ?? '');
  const amount = req.body?.amount !== undefined ? Number(req.body.amount) : 1;

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: 'Invalid user id' });
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  try {
    const entry = drinkService.addDrink(userId, drinkType, amount);
    return res.status(201).json({ entry });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/api/drinks/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: 'Invalid user id' });
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(200).json({ stats: drinkService.getUserStats(userId) });
});

app.get('/api/leaderboard', async (_req: Request, res: Response) => {
  const users = await UserModel.findAll(1000, 0);
  const leaderboard = drinkService.getLeaderboard(users.map((user) => ({ id: user.id, nickname: user.nickname })));
  return res.status(200).json({ leaderboard });
});

export default app;
