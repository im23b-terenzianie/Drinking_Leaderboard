import express, { Request, Response } from 'express';
import { UserModel } from './models/user.model';
import { drinkService } from './services/drink.service';
import { DRINK_POINTS, DrinkType } from './types/drink.types';

const app = express();

app.use(express.json());

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.options('*', (_req, res) => res.sendStatus(204));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

// Join or rejoin the leaderboard with a nickname
app.post('/api/users', async (req: Request, res: Response) => {
  const nickname = String(req.body?.nickname ?? '').trim();

  if (!nickname) {
    return res.status(400).json({ error: 'nickname is required' });
  }
  if (nickname.length < 2 || nickname.length > 30) {
    return res.status(400).json({ error: 'Nickname must be 2–30 characters' });
  }
  if (!/^[a-zA-Z0-9_]+$/.test(nickname)) {
    return res.status(400).json({ error: 'Nickname can only contain letters, numbers, and underscores' });
  }

  const existing = await UserModel.findByNickname(nickname);
  if (existing) {
    return res.status(200).json({ user: existing });
  }

  const user = await UserModel.create({ nickname });
  return res.status(201).json({ user });
});

// Log a drink — photo is validated client-side only, not uploaded
app.post('/api/drinks', async (req: Request, res: Response) => {
  const userId = Number(req.body?.userId);
  const drinkType = String(req.body?.drinkType ?? '').toLowerCase() as DrinkType;

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: 'Invalid user id' });
  }

  if (!Object.keys(DRINK_POINTS).includes(drinkType)) {
    return res.status(400).json({ error: 'drinkType must be beer, cocktail, or shot' });
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const entry = await drinkService.logDrink(userId, drinkType);
  return res.status(201).json({ entry });
});

// Global leaderboard
app.get('/api/leaderboard', async (_req: Request, res: Response) => {
  const users = await UserModel.getLeaderboard(100);
  return res.status(200).json({ leaderboard: users });
});

export default app;
