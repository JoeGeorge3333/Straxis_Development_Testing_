import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import { LeagueChat } from "../components/LeagueChat";
import { LeaderboardList } from "../components/LeaderboardList";
import { pickOpponentId, useActiveLeague, useAppState } from "../state";

function VsStrip() {
  const s = useAppState();
  const league = useActiveLeague();
  const me = s.users[s.meId];
  const oppId = pickOpponentId(s);
  const opp = oppId ? s.users[oppId] : null;

  if (!league || !opp) {
    return (
      <div className="panelBody muted" style={{ borderBottom: "1px solid var(--line)" }}>
        Add another member to see a head-to-head strip, or open the leaderboard below.
      </div>
    );
  }

  const total = Math.max(me.total_points + opp.total_points, 1);
  const leftPct = Math.round((me.total_points / total) * 100);

  return (
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
  );
}

export function LeaguePage() {
  const league = useActiveLeague();
  const s = useAppState();
  const [copied, setCopied] = useState(false);

  const copyKey = useCallback(() => {
    if (!league) return;
    void navigator.clipboard.writeText(league.accessKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [league]);

  if (!league) {
    return (
      <div className="card">
        <div className="cardHeader">
          <h2 className="cardTitle">League</h2>
        </div>
        <div className="panelBody muted">No active league. Create one or join with an access key.</div>
        <div className="panelBody" style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link to="/league/create" className="button">
            Create league
          </Link>
          <Link to="/league/join" className="button">
            Join with key
          </Link>
        </div>
      </div>
    );
  }

  const members = league.memberIds.map((id) => s.users[id]).filter(Boolean);
  const isOwner = league.ownerId === s.meId;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <div className="cardHeader">
          <h2 className="cardTitle">{league.name}</h2>
          <Link to="/" className="muted" style={{ fontSize: 12 }}>
            Dashboard
          </Link>
        </div>
        <div className="panelBody">
          <div style={{ fontWeight: 650, marginBottom: 8 }}>Access key</div>
          <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>
            Share this key so others join the same challenge group. Their home dashboard will load these league tasks.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <code className="accessKeyBox">{league.accessKey}</code>
            <button type="button" className="button" onClick={copyKey}>
              {copied ? "Copied" : "Copy key"}
            </button>
          </div>
        </div>
        <div className="panelBody" style={{ borderTop: "1px solid var(--line)", paddingTop: 16 }}>
          <div style={{ fontWeight: 650, marginBottom: 8 }}>Members ({members.length})</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "rgba(232,227,216,0.82)" }}>
            {members.map((u) => (
              <li key={u.id}>
                {u.avatar} {u.name}
                {u.id === league.ownerId ? <span className="muted"> · owner</span> : null}
              </li>
            ))}
          </ul>
        </div>
        <div className="panelBody" style={{ borderTop: "1px solid var(--line)", display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link to="/league/create" className="iconButton" style={{ textDecoration: "none", padding: "10px 14px", width: "auto" }}>
            New league
          </Link>
          <Link to="/league/join" className="iconButton" style={{ textDecoration: "none", padding: "10px 14px", width: "auto" }}>
            Join league
          </Link>
          {isOwner ? (
            <Link to="/league/challenge" className="button" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
              Edit challenge tasks
            </Link>
          ) : null}
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h2 className="cardTitle">Matchup</h2>
        </div>
        <VsStrip />
        <div style={{ borderTop: "1px solid var(--line)" }}>
          <LeaderboardList memberIds={league.memberIds} />
        </div>
      </div>

      <LeagueChat leagueId={league.id} />
    </div>
  );
}
