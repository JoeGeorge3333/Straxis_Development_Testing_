import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useActiveLeague, useAppActions, useIsLeagueOwner } from "../state";
import type { TaskType } from "../types";

export function CreateTaskPage() {
  const nav = useNavigate();
  const { addChallengeTask } = useAppActions();
  const league = useActiveLeague();
  const owner = useIsLeagueOwner();
  const [name, setName] = useState("");
  const [type, setType] = useState<TaskType>("checkbox");
  const [points, setPoints] = useState("5");

  const canSubmit = useMemo(() => name.trim().length >= 2 && Number(points) > 0, [name, points]);

  if (!league) {
    return (
      <div className="card">
        <div className="cardHeader">
          <h2 className="cardTitle">Add challenge task</h2>
          <Link to="/" className="muted">
            Back
          </Link>
        </div>
        <div className="panelBody muted">Join or create a league first — tasks belong to the active league challenge.</div>
      </div>
    );
  }

  if (!owner) {
    return (
      <div className="card">
        <div className="cardHeader">
          <h2 className="cardTitle">Add challenge task</h2>
          <Link to="/" className="muted">
            Back
          </Link>
        </div>
        <div className="panelBody">
          <p className="muted">Only the league owner can add rows to the shared challenge.</p>
          <Link to="/league" className="button" style={{ display: "inline-block", marginTop: 12 }}>
            League hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Add to challenge</h2>
        <Link to="/" className="muted">
          Back
        </Link>
      </div>
      <div className="panelBody">
        <p className="muted" style={{ marginTop: 0, fontSize: 13 }}>
          Adds a task for <strong>{league.name}</strong>. Everyone in the league will see it on their dashboard.
        </p>
        <div className="formGrid" style={{ marginTop: 12 }}>
          <input className="input" placeholder="Task name" value={name} onChange={(e) => setName(e.target.value)} />

          <select className="input" value={type} onChange={(e) => setType(e.target.value as TaskType)}>
            <option value="checkbox">Checkbox</option>
            <option value="number">Number</option>
            <option value="time">Time</option>
          </select>

          <input
            className="input"
            type="number"
            min={1}
            placeholder="Points"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />

          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <button className="iconButton" type="button" onClick={() => nav(-1)}>
              Cancel
            </button>
            <button
              className="button"
              type="button"
              disabled={!canSubmit}
              onClick={() => {
                addChallengeTask({
                  id: `${league.id}_ct_${Date.now()}`,
                  name: name.trim(),
                  type,
                  points: Number(points),
                });
                nav("/");
              }}
            >
              Add task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
