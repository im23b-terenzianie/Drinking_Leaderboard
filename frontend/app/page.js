'use client';

import { useState, useEffect, useCallback } from 'react';
import DrinkForm from '../components/DrinkForm';
import LeaderboardTable from '../components/LeaderboardTable';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const STORAGE_KEY = 'drinking_leaderboard_user';

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [nicknameInput, setNicknameInput] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [lastEvent, setLastEvent] = useState('No drinks logged yet');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/leaderboard`);
      if (!res.ok) return;
      const data = await res.json();
      setLeaderboard(data.leaderboard ?? []);
    } catch {
      // backend offline – silently keep stale data
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30_000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  const handleJoin = async (e) => {
    e.preventDefault();
    const nickname = nicknameInput.trim();
    if (!nickname) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong');
        return;
      }
      const user = data.user;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setCurrentUser(user);
      await fetchLeaderboard();
    } catch {
      setError('Cannot reach the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDrink = async ({ drinkType }) => {
    if (!currentUser) return;

    try {
      const res = await fetch(`${API_URL}/api/drinks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, drinkType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLastEvent(`Error: ${data.error}`);
        return;
      }
      const { entry } = data;
      setLastEvent(`${currentUser.nickname} logged a ${entry.drinkType} (+${entry.points} pt${entry.points !== 1 ? 's' : ''})`);
      await fetchLeaderboard();
    } catch {
      setLastEvent('Could not reach server');
    }
  };

  const handleLeave = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser(null);
    setNicknameInput('');
  };

  if (!currentUser) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-4 py-16 bg-zinc-100 text-zinc-950">
        <h1 className="mb-2 text-4xl font-black tracking-tight">Drinking Leaderboard</h1>
        <p className="mb-8 text-sm text-zinc-500">Compete against everyone in the world. Pick up a drink, earn points.</p>

        <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-5 text-sm w-full">
          <p className="mb-2 font-semibold text-zinc-700">Point system</p>
          <ul className="space-y-1 text-zinc-600">
            <li>Beer &nbsp;→ +1 pt</li>
            <li>Cocktail → +2 pts</li>
            <li>Shot &nbsp;→ +3 pts</li>
          </ul>
        </div>

        <form onSubmit={handleJoin} className="w-full grid gap-3">
          <label className="grid gap-1 text-sm font-medium text-zinc-800">
            Choose a username
            <input
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              placeholder="e.g. party_legend"
              className="rounded-md border border-zinc-300 px-3 py-2 text-base"
              maxLength={30}
              required
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {loading ? 'Joining…' : 'Join Leaderboard'}
          </button>
        </form>

        {leaderboard.length > 0 && (
          <div className="mt-10 w-full">
            <LeaderboardTable users={leaderboard} />
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-8">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Drinking Leaderboard</h1>
          <p className="text-sm text-zinc-500">Playing as <span className="font-semibold text-zinc-800">{currentUser.nickname}</span></p>
        </div>
        <button
          onClick={handleLeave}
          className="mt-1 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50"
        >
          Leave
        </button>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <DrinkForm onSubmit={handleAddDrink} />
        <LeaderboardTable users={leaderboard} currentUserId={currentUser.id} />
      </section>

      <p className="mt-6 rounded-md border border-zinc-300 bg-white px-4 py-3 text-sm" aria-live="polite">
        {lastEvent}
      </p>
    </main>
  );
}
