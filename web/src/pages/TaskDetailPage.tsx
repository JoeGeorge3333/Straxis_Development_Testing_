/**
 * Task detail / log — planned “proof image” flow (S3 presigned URLs, data model, UX) lives in:
 * docs/task-proof-s3-plan.md
 */
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAppActions, useDashboardTasks } from "../state";
import type { TaskType } from "../types";

function defaultValueFor(type: TaskType) {
  if (type === "number") return "1";
  if (type === "time") return "10";
  return "";
}

export function TaskDetailPage() {
  const nav = useNavigate();
  const { taskId } = useParams();
  const tasks = useDashboardTasks();
  const { addLog } = useAppActions();

  const task = useMemo(() => tasks.find((t) => t.id === taskId), [tasks, taskId]);
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!task) return;
    setValue(defaultValueFor(task.type));
    setNotes("");
  }, [task, taskId]);

  if (!task) {
    return (
      <div className="card">
        <div className="cardHeader">
          <h2 className="cardTitle">Task</h2>
          <Link to="/" className="muted">
            Back
          </Link>
        </div>
        <div className="panelBody">Task not found (check you are in the league that defines this task).</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">{task.name}</h2>
        <Link to="/" className="muted">
          Back
        </Link>
      </div>
      <div className="panelBody">
        <div className="formGrid">
          <div className="muted" style={{ fontSize: 12 }}>
            {task.points} pts • type: {task.type}
          </div>

          {task.type === "checkbox" ? null : (
            <input
              className="input"
              type="number"
              min={0}
              placeholder={task.type === "time" ? "Minutes" : "Value"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )}

          <textarea
            className="textarea"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <button className="iconButton" type="button" onClick={() => nav(-1)}>
              Cancel
            </button>
            <button
              className="button"
              type="button"
              onClick={() => {
                addLog({
                  task_id: task.id,
                  value: task.type === "checkbox" ? "logged" : value,
                  notes: notes.trim() || undefined,
                  pointsDelta: task.points,
                });
                nav("/");
              }}
            >
              Submit log (+{task.points})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
