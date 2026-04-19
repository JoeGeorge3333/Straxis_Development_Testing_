import { useNavigate } from "react-router-dom";

import { useAppActions, useAppState } from "../state";

const EMOJI_OPTIONS = [
  "🙂",
  "😀",
  "😎",
  "🤩",
  "😤",
  "💪",
  "🔥",
  "⚡",
  "🏆",
  "🥇",
  "🎯",
  "😮",
  "😬",
  "😐",
  "😴",
  "🤔",
  "🙃",
  "😉",
  "😇",
  "🥳",
  "😅",
  "👊",
  "✨",
  "🌟",
];

export function EmojiPickPage() {
  const nav = useNavigate();
  const { users, meId } = useAppState();
  const { setMyAvatar } = useAppActions();
  const current = users[meId]?.avatar ?? "🙂";

  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Choose avatar</h2>
        <button type="button" className="iconButton" onClick={() => nav(-1)} aria-label="Close">
          ←
        </button>
      </div>
      <div className="panelBody">
        <p className="muted" style={{ marginTop: 0, marginBottom: 16, fontSize: 14 }}>
          Current: <span style={{ fontSize: 22 }}>{current}</span>
        </p>
        <div className="emojiGrid" role="list">
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className={`emojiCell ${emoji === current ? "emojiCellSelected" : ""}`}
              onClick={() => {
                setMyAvatar(emoji);
                nav(-1);
              }}
              aria-label={`Select ${emoji}`}
              aria-pressed={emoji === current}
            >
              <span className="emojiCellGlyph">{emoji}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
