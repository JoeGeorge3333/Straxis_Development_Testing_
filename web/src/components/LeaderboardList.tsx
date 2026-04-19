import { useMemo } from "react";

import { useAppState } from "../state";

function ordinal(i: number) {
  if (i === 1) return "1st";
  if (i === 2) return "2nd";
  if (i === 3) return "3rd";
  return `${i}th`;
}

export function LeaderboardList({ memberIds }: { memberIds?: string[] }) {
  const { users } = useAppState();

  const sorted = useMemo(() => {
    const list = memberIds?.length
      ? memberIds.map((id) => users[id]).filter((u): u is NonNullable<typeof u> => Boolean(u))
      : Object.values(users);
    return list.slice().sort((a, b) => b.total_points - a.total_points).slice(0, 8);
  }, [users, memberIds]);

  return (
    <div className="panelBody">
      <div style={{ fontWeight: 700, marginBottom: 10 }}>Leaderboard</div>
      <div style={{ display: "grid", gap: 10 }}>
        {sorted.map((u, idx) => (
          <div key={u.id} style={{ display: "grid", gridTemplateColumns: "42px 1fr auto", gap: 10, alignItems: "center" }}>
            <div className="avatar" aria-hidden="true">
              {u.avatar}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 650, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ordinal(idx + 1)} {u.name}
                </div>
              </div>
              <div className="muted" style={{ fontSize: 12 }}>
                {u.total_points} pts
              </div>
            </div>
            <div className="muted" style={{ fontSize: 12 }}>
              {u.total_points}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
