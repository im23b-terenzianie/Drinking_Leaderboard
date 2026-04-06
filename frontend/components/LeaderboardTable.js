'use client';

export default function LeaderboardTable({ users, currentUserId }) {
  if (!users || users.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-300 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-xl font-bold text-zinc-900">Leaderboard</h2>
        <p className="text-sm text-zinc-400">No one on the board yet. Be first!</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-300 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-xl font-bold text-zinc-900">Leaderboard</h2>
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-zinc-500">
            <th className="border-b border-zinc-200 pb-2 pr-4">#</th>
            <th className="border-b border-zinc-200 pb-2 pr-4">Player</th>
            <th className="border-b border-zinc-200 pb-2 text-right">Points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const isMe = currentUserId != null && user.id === currentUserId;
            return (
              <tr
                key={user.id}
                data-testid={`leaderboard-row-${index + 1}`}
                className={isMe ? 'font-semibold' : ''}
              >
                <td className="border-b border-zinc-100 py-2 pr-4 text-zinc-400">{index + 1}</td>
                <td className="border-b border-zinc-100 py-2 pr-4">
                  {user.nickname}
                  {isMe && <span className="ml-1.5 text-xs text-zinc-400">(you)</span>}
                </td>
                <td className="border-b border-zinc-100 py-2 text-right tabular-nums">{user.total_points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
