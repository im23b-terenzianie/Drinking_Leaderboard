'use client';

import { useState } from 'react';
import DrinkForm from '../components/DrinkForm';
import LeaderboardTable from '../components/LeaderboardTable';

const initialUsers = [
  { id: 1, nickname: 'enzo', totalDrinks: 0 },
  { id: 2, nickname: 'lina', totalDrinks: 0 },
  { id: 3, nickname: 'mika', totalDrinks: 0 },
];

export default function Home() {
  const [users, setUsers] = useState(initialUsers);
  const [lastEvent, setLastEvent] = useState('No drinks added yet');

  const handleAddDrink = ({ userId, drinkType, amount }) => {
    if (!drinkType.trim() || !Number.isFinite(amount) || amount <= 0) {
      setLastEvent('Invalid drink input');
      return;
    }

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, totalDrinks: user.totalDrinks + amount } : user
      )
    );

    const user = users.find((entry) => entry.id === userId);
    setLastEvent(`${user?.nickname ?? 'unknown'} added ${amount} ${drinkType}`);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-8">
      <header className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">Drinking Leaderboard</h1>
        <p className="text-sm text-zinc-700">Track drinks, compare totals, keep the ranking fresh.</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <DrinkForm users={users} onSubmit={handleAddDrink} />
        <LeaderboardTable users={users} />
      </section>

      <p className="mt-6 rounded-md border border-zinc-300 bg-white px-4 py-3 text-sm" aria-live="polite">
        {lastEvent}
      </p>
    </main>
  );
}
