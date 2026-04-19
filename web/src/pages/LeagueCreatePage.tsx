import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppActions } from "../state";

export function LeagueCreatePage() {
  const nav = useNavigate();
  const { createLeague } = useAppActions();
  const [name, setName] = useState("");

  const canSubmit = name.trim().length >= 2;

  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Create league</h2>
        <Link to="/league" className="muted">
          Back
        </Link>
      </div>
      <div className="panelBody">
        <p className="muted" style={{ marginTop: 0 }}>
          Creates a new challenge group with a default daily task set. You will get an <strong>access key</strong> to share so
          others can join the same dashboard tasks.
        </p>
        <div className="formGrid" style={{ marginTop: 16 }}>
          <input className="input" placeholder="League name" value={name} onChange={(e) => setName(e.target.value)} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Link to="/league" className="iconButton" style={{ display: "inline-flex", textDecoration: "none" }}>
              Cancel
            </Link>
            <button
              className="button"
              type="button"
              disabled={!canSubmit}
              onClick={() => {
                createLeague(name.trim());
                nav("/league");
              }}
            >
              Create &amp; go to league
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
