import { useMemo } from "react";

import { getActiveLeague, useAppState } from "../state";

export function DataLogsPage() {
  const state = useAppState();
  const { logs } = state;
  const league = getActiveLeague(state);

  const taskNameById = useMemo(() => {
    const map = new Map<string, string>();
    if (league) {
      for (const t of league.challengeTasks) map.set(t.id, t.name);
    }
    return map;
  }, [league]);

  const visibleLogs = useMemo(() => {
    if (!league) return logs;
    const lid = league.id;
    return logs.filter((l) => !l.leagueId || l.leagueId === lid);
  }, [logs, league]);

  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Data / Logs</h2>
        <div className="muted" style={{ fontSize: 12 }}>
          {league ? league.name : "All"} · {visibleLogs.length} entries
        </div>
      </div>
      <div className="panelBody">
        {visibleLogs.length === 0 ? (
          <div className="muted">No logs yet. Complete a task or submit a log from a task detail page.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {visibleLogs.slice(0, 50).map((l) => (
              <div
                key={l.id}
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  padding: 12,
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontWeight: 650 }}>{taskNameById.get(l.task_id) ?? l.task_id}</div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    {new Date(l.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                  value: {String(l.value ?? "")} • points: {l.pointsDelta >= 0 ? `+${l.pointsDelta}` : l.pointsDelta}
                  {l.leagueId ? ` · ${l.leagueId}` : ""}
                </div>
                {l.notes ? <div style={{ marginTop: 8 }}>{l.notes}</div> : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
