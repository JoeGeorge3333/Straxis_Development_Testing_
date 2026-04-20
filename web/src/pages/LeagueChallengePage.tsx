import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useActiveLeague, useAppActions, useIsLeagueOwner } from "../state";
import type { TaskType } from "../types";

export function LeagueChallengePage() {
  const nav = useNavigate();
  const league = useActiveLeague();
  const owner = useIsLeagueOwner();
  const { addChallengeTask, removeChallengeTask } = useAppActions();

  const [name, setName] = useState("");
  const [type, setType] = useState<TaskType>("checkbox");
  const [points, setPoints] = useState("5");

  const canAdd = useMemo(() => name.trim().length >= 2 && Number(points) > 0, [name, points]);

  if (!league) {
    return (
      <div className="card">
        <div className="cardHeader">
          <h2 className="cardTitle">Challenge tasks</h2>
          <Link to="/league" className="muted">
            Back
          </Link>
        </div>
        <div className="panelBody">
          <div className="muted">Join or create a league first.</div>
        </div>
      </div>
    );
  }

  if (!owner) {
    return (
      <div className="card">
        <div className="cardHeader">
          <h2 className="cardTitle">Challenge tasks</h2>
          <Link to="/league" className="muted">
            Back
          </Link>
        </div>
        <div className="panelBody">
          <div className="muted">Only the league owner can edit the shared challenge.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Challenge tasks</h2>
        <Link to="/league" className="muted">
          Back
        </Link>
      </div>
      <div className="panelBody">
        <p className="muted" style={{ marginTop: 0 }}>
          These rows are the <strong>shared challenge</strong>. Everyone in <strong>{league.name}</strong> sees them on
          their dashboard.
        </p>

        <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
          {league.challengeTasks.map((t) => (
            <div key={t.id} className="challengeRow" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 650 }}>{t.name}</div>
                <div className="muted" style={{ fontSize: 12 }}>
                  {t.type} · {t.points} pts · <code className="codeInline">{t.id}</code>
                </div>
              </div>
              <button type="button" className="iconButton" onClick={() => removeChallengeTask(t.id)} aria-label="Remove task">
                ✕
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
          <div style={{ fontWeight: 650, marginBottom: 10 }}>Add task</div>
          <div className="formGrid">
            <input className="input" placeholder="Task name" value={name} onChange={(e) => setName(e.target.value)} />
            <select className="input" value={type} onChange={(e) => setType(e.target.value as TaskType)}>
              <option value="checkbox">Checkbox</option>
              <option value="number">Number</option>
              <option value="time">Time</option>
            </select>
            <input className="input" type="number" min={1} value={points} onChange={(e) => setPoints(e.target.value)} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="iconButton" type="button" onClick={() => nav("/league")}>
                Done
              </button>
              <button
                className="button"
                type="button"
                disabled={!canAdd}
                onClick={() => {
                  addChallengeTask({
                    id: `${league.id}_ct_${Date.now()}`,
                    name: name.trim(),
                    type,
                    points: Number(points),
                  });
                  setName("");
                  setPoints("5");
                }}
              >
                Add to challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
