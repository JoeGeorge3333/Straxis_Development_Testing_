import { useNavigate } from "react-router-dom";

import { useActiveLeague, useDashboardTasks } from "../state";
import { TaskItem } from "./TaskItem";

export function TaskList() {
  const tasks = useDashboardTasks();
  const league = useActiveLeague();
  const nav = useNavigate();

  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Tasks</h2>
        <div className="muted" style={{ fontSize: 12 }}>
          {league ? "Shared daily tasks" : "No league"}
        </div>
      </div>
      <div className="list">
        {tasks.length === 0 ? (
          <div className="panelBody muted">No challenge tasks yet. League owner can add them from the league hub.</div>
        ) : (
          tasks.map((t) => <TaskItem key={t.id} task={t} onOpen={() => nav(`/tasks/${t.id}`)} />)
        )}
      </div>
    </div>
  );
}
