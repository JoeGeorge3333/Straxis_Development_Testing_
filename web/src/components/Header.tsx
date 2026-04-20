import { Link } from "react-router-dom";

import { programChallengeDay } from "../lib/dayKey";
import { useActiveLeague, useAppState } from "../state";

export function Header() {
  const { users, meId, rollDayKey } = useAppState();
  const league = useActiveLeague();
  const avatar = users[meId]?.avatar ?? "🙂";

  const challengeDay = league ? programChallengeDay(league.startedOnDayKey, rollDayKey) : null;

  return (
    <header className="topNav">
      <div className="topNavInner">
        <div className="topNavSide topNavSideLeft">
          <Link to="/profile/emoji" className="iconButton iconButtonAvatar" aria-label="Choose profile emoji">
            <span className="iconButtonAvatarGlyph">{avatar}</span>
          </Link>
        </div>

        <div className="topNavCenter" aria-label="App title and active challenge">
          <div className="navTitle">STRAXIS</div>
          {league ? (
            <div className="topNavChallengeInline">
              <span className="challengeName">{league.name}</span>
              <span className="challengeDayPill" aria-label={`Challenge day ${challengeDay}`}>
                DAY {challengeDay}
              </span>
            </div>
          ) : (
            <div className="topNavChallengeInline topNavChallengeFallback muted">
              <span style={{ fontSize: "11px", letterSpacing: "0.06em" }}>
                <Link to="/league/join">Join</Link>
                {" · "}
                <Link to="/league/create">Create</Link>
              </span>
            </div>
          )}
        </div>

        <div className="topNavSide topNavSideRight">
          <Link to="/tasks/new" className="iconButton iconButtonPrimary" aria-label="Create new task">
            +
          </Link>
        </div>
      </div>
    </header>
  );
}
