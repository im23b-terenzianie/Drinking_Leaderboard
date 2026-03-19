'use client';

import { useState } from 'react';

export default function DrinkForm({ users, onSubmit }) {
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id ?? 0);
  const [drinkType, setDrinkType] = useState('beer');
  const [amount, setAmount] = useState(1);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ userId: Number(selectedUserId), drinkType, amount: Number(amount) });
  };

  return (
    <form onSubmit={handleSubmit} aria-label="drink-form" className="grid gap-3 rounded-xl border border-zinc-300 bg-white p-4 shadow-sm">
      <label className="grid gap-1 text-sm font-medium text-zinc-800">
        User
        <select
          aria-label="user-select"
          value={selectedUserId}
          onChange={(event) => setSelectedUserId(Number(event.target.value))}
          className="rounded-md border border-zinc-300 px-2 py-1"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nickname}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm font-medium text-zinc-800">
        Drink Type
        <input
          aria-label="drink-type"
          value={drinkType}
          onChange={(event) => setDrinkType(event.target.value)}
          className="rounded-md border border-zinc-300 px-2 py-1"
        />
      </label>

      <label className="grid gap-1 text-sm font-medium text-zinc-800">
        Amount
        <input
          aria-label="drink-amount"
          type="number"
          min={1}
          value={amount}
          onChange={(event) => setAmount(Number(event.target.value))}
          className="rounded-md border border-zinc-300 px-2 py-1"
        />
      </label>

      <button type="submit" className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-700">
        Add Drink
      </button>
    </form>
  );
}
