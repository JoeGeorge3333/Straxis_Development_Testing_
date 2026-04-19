import { useMemo } from "react";
import { Link } from "react-router-dom";

import { pickOpponentId, useActiveLeague, useAppState } from "../state";
import { LeaderboardList } from "./LeaderboardList";

export function LeaguePanel() {
  const s = useAppState();
  const league = useActiveLeague();
  const me = s.users[s.meId];
  const oppId = useMemo(() => pickOpponentId(s), [s]);
  const opp = oppId ? s.users[oppId] : null;

  const leftPct = useMemo(() => {
    if (!opp) return 50;
    const total = Math.max(me.total_points + opp.total_points, 1);
    return Math.round((me.total_points / total) * 100);
  }, [me.total_points, opp]);

  if (!league) {
    return (
      <div className="card">
        <div className="cardHeader">
          <h2 className="cardTitle">League</h2>
          <Link to="/league/join" className="muted" style={{ fontSize: 12 }}>
            Join
          </Link>
        </div>
        <div className="panelBody muted">No active league — create or join from the league hub.</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">{league.name}</h2>
        <Link to="/league" className="muted" style={{ fontSize: 12 }}>
          Open
        </Link>
      </div>

      {opp ? (
        <>
          <div className="vsRow">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="avatar" aria-hidden="true">
                {me.avatar}
              </div>
              <div>
                <div style={{ fontWeight: 650 }}>{me.name}</div>
                <div className="scorePill">{me.total_points} pts</div>
              </div>
            </div>

            <div className="muted" style={{ fontWeight: 800, letterSpacing: "0.18em" }}>
              VS
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, justifySelf: "end" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 650 }}>{opp.name}</div>
                <div className="scorePill">{opp.total_points} pts</div>
              </div>
              <div className="avatar" aria-hidden="true">
                {opp.avatar}
              </div>
            </div>
          </div>

          <div style={{ padding: "0 16px 16px" }}>
            <div className="bar" style={{ ["--left" as never]: `${leftPct}%` }}>
              <div className="barLeft" />
              <div className="barRight" />
            </div>
          </div>
        </>
      ) : (
        <div className="panelBody muted" style={{ borderBottom: "1px solid var(--line)" }}>
          Invite a second member to see a matchup bar.
        </div>
      )}

      <div style={{ borderTop: "1px solid var(--line)" }}>
        <LeaderboardList memberIds={league.memberIds} />
      </div>
    </div>
  );
}
