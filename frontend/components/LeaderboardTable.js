'use client';

export default function LeaderboardTable({ users }) {
  const sorted = [...users].sort((a, b) => b.totalDrinks - a.totalDrinks || a.nickname.localeCompare(b.nickname));

  return (
    <div className="rounded-xl border border-zinc-300 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-xl font-bold text-zinc-900">Leaderboard</h2>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr>
            <th className="border-b border-zinc-300 py-2">Rank</th>
            <th className="border-b border-zinc-300 py-2">Nickname</th>
            <th className="border-b border-zinc-300 py-2">Total Drinks</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((user, index) => (
            <tr key={user.id} data-testid={`leaderboard-row-${index + 1}`}>
              <td className="border-b border-zinc-200 py-2">{index + 1}</td>
              <td className="border-b border-zinc-200 py-2">{user.nickname}</td>
              <td className="border-b border-zinc-200 py-2">{user.totalDrinks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
