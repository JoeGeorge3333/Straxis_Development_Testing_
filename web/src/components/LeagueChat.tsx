import { useEffect, useRef, useState } from "react";

import { useAppActions, useAppState } from "../state";

export function LeagueChat({ leagueId }: { leagueId: string }) {
  const { users, leagueChat } = useAppState();
  const { postLeagueChat } = useAppActions();
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const messages = leagueChat[leagueId] ?? [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="card leagueChatCard">
      <div className="cardHeader">
        <h2 className="cardTitle">League chat</h2>
        <span className="muted" style={{ fontSize: 11, letterSpacing: "0.06em" }}>
          MOCK
        </span>
      </div>
      <p className="muted leagueChatHint">
        In-memory only — no sync between devices. Layout preview for a future realtime channel.
      </p>
      <div className="leagueChatScroll" role="log" aria-live="polite">
        {messages.length === 0 ? (
          <div className="muted" style={{ padding: "8px 14px" }}>
            No messages yet.
          </div>
        ) : (
          messages.map((m) => {
            const u = users[m.userId];
            const label = u ? `${u.avatar} ${u.name}` : m.userId;
            return (
              <div key={m.id} className="leagueChatRow">
                <div className="leagueChatMeta">
                  <span className="leagueChatAuthor">{label}</span>
                  <span className="muted leagueChatTime">{new Date(m.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <div className="leagueChatBody">{m.body}</div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>
      <form
        className="leagueChatForm"
        onSubmit={(e) => {
          e.preventDefault();
          const t = draft.trim();
          if (!t) return;
          postLeagueChat(leagueId, t);
          setDraft("");
        }}
      >
        <input
          className="input"
          placeholder="Message (mock)…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={500}
          aria-label="Chat message"
        />
        <button type="submit" className="button" disabled={!draft.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
