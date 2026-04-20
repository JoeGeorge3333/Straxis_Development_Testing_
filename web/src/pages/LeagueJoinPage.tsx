import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppActions, useAppState } from "../state";

export function LeagueJoinPage() {
  const nav = useNavigate();
  const { joinLeague, clearLeagueJoinError } = useAppActions();
  const { leagueJoinError } = useAppState();
  const [key, setKey] = useState("");
  const [joinAttempt, setJoinAttempt] = useState(0);

  useEffect(() => {
    clearLeagueJoinError();
  }, [clearLeagueJoinError]);

  useEffect(() => {
    if (joinAttempt === 0) return;
    if (leagueJoinError) return;
    nav("/league");
  }, [joinAttempt, leagueJoinError, nav]);

  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Join league</h2>
        <Link to="/league" className="muted">
          Back
        </Link>
      </div>
      <div className="panelBody">
        <p className="muted" style={{ marginTop: 0 }}>
          Enter the access key the league owner shared (try <code className="codeInline">STRX-DEMO</code> for the starter
          group).
        </p>
        <div className="formGrid" style={{ marginTop: 16 }}>
          <input
            className="input"
            placeholder="STRX-…"
            value={key}
            onChange={(e) => {
              clearLeagueJoinError();
              setKey(e.target.value);
            }}
            autoCapitalize="characters"
          />
          {leagueJoinError ? <div style={{ color: "#c62828", fontSize: 14 }}>{leagueJoinError}</div> : null}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Link to="/league" className="iconButton" style={{ display: "inline-flex", textDecoration: "none" }}>
              Cancel
            </Link>
            <button
              className="button"
              type="button"
              disabled={key.trim().length < 4}
              onClick={() => {
                joinLeague(key);
                setJoinAttempt((n) => n + 1);
              }}
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
