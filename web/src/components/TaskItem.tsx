import { useMemo, useState } from "react";

import type { Task } from "../types";
import { useAppActions } from "../state";

export function TaskItem({ task, onOpen }: { task: Task; onOpen(): void }) {
  const { toggleTask, setQuickNote } = useAppActions();
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(task.quickNote ?? "");

  const checked = task.completedToday;
  const boxClass = `checkbox ${checked ? "checkboxChecked" : ""}`;

  const bullet = useMemo(() => {
    if (task.type === "time") return "•";
    if (task.type === "number") return "•";
    return "•";
  }, [task.type]);

  return (
    <div
      className="row"
      role="button"
      tabIndex={0}
      onClick={() => onOpen()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen();
      }}
      aria-label={`Open task ${task.name}`}
    >
      <div className="muted" aria-hidden="true">
        {bullet}
      </div>

      <div className="rowName">
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 650, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {task.name}
          </div>
          <div className="muted" style={{ fontSize: 12 }}>
            {task.points} pts
            {task.quickNote ? ` • ${task.quickNote}` : ""}
          </div>
        </div>
      </div>

      <button
        className="tinyBox"
        type="button"
        aria-label={editingNote ? "Close notes" : "Add note"}
        onClick={(e) => {
          e.stopPropagation();
          setEditingNote((v) => !v);
          setNoteDraft(task.quickNote ?? "");
        }}
      >
        ≡
      </button>

      <button
        className={boxClass}
        type="button"
        aria-label={checked ? "Mark incomplete" : "Mark complete"}
        onClick={(e) => {
          e.stopPropagation();
          toggleTask(task.id);
        }}
      />

      {editingNote ? (
        <div
          style={{
            gridColumn: "1 / -1",
            paddingTop: 10,
            display: "grid",
            gap: 8,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            className="input"
            placeholder="Quick note…"
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
          />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              className="iconButton"
              type="button"
              onClick={() => {
                setEditingNote(false);
              }}
            >
              Close
            </button>
            <button
              className="button"
              type="button"
              onClick={() => {
                setQuickNote(task.id, noteDraft.trim());
                setEditingNote(false);
              }}
            >
              Save note
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

